'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  rewardType: z.enum(['token', 'nft']),
  tokenAddress: z.string().min(32, {
    message: 'Token address must be at least 32 characters.',
  }).optional(),
  nftAddress: z.string().min(32, {
    message: 'NFT address must be at least 32 characters.',
  }).optional(),
  recipients: z.string().min(1, {
    message: 'At least one recipient address is required.',
  }),
  amount: z.string().min(1, {
    message: 'Amount is required.',
  }),
  isRecurring: z.boolean(),
  frequency: z.string().optional(),
})

interface RewardsFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
  usdcPrice: number | null
}

export function RewardsForm({ onSubmit, isLoading, isWalletConnected, solPrice, usdcPrice }: RewardsFormProps) {
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rewardType: 'token',
      tokenAddress: '',
      nftAddress: '',
      recipients: '',
      amount: '',
      isRecurring: false,
      frequency: '',
    },
  })

  const watchRewardType = form.watch('rewardType')
  const watchIsRecurring = form.watch('isRecurring')

  function calculateEstimatedCost(data: z.infer<typeof formSchema>) {
    const recipientCount = data.recipients.split('\n').filter(address => address.trim() !== '').length
    const amount = parseFloat(data.amount)
    if (isNaN(amount) || recipientCount === 0) {
      setEstimatedCost(null)
      return
    }

    let cost = 0
    if (data.rewardType === 'token' && usdcPrice) {
      // Assuming token price is pegged to USDC for this example
      cost = amount * recipientCount * usdcPrice
    } else if (data.rewardType === 'nft' && solPrice) {
      // Assuming a flat rate of 0.1 SOL per NFT mint
      cost = 0.1 * recipientCount * solPrice
    }

    setEstimatedCost(cost)
  }

  function onFormSubmit(data: z.infer<typeof formSchema>) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reward type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose between token or NFT rewards.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchRewardType === 'token' && (
          <FormField
            control={form.control}
            name="tokenAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter token address" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the address of the token you want to distribute as rewards.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchRewardType === 'nft' && (
          <FormField
            control={form.control}
            name="nftAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NFT Collection Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter NFT collection address" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the address of the NFT collection you want to distribute as rewards.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="recipients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Addresses</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter recipient addresses, one per line"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the recipient wallet addresses, one per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount per Recipient</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    calculateEstimatedCost(form.getValues())
                  }}
                />
              </FormControl>
              <FormDescription>
                {watchRewardType === 'token' 
                  ? 'Enter the amount of tokens to send to each recipient.'
                  : 'Enter the number of NFTs to mint for each recipient.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Recurring Rewards</FormLabel>
                <FormDescription>
                  Enable this if you want to set up recurring rewards distribution.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {watchIsRecurring && (
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose how often you want to distribute rewards.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {estimatedCost !== null && (
          <div className="text-sm text-muted-foreground">
            Estimated cost: ${estimatedCost.toFixed(2)} USD
          </div>
        )}

        <Button type="submit" disabled={isLoading || !isWalletConnected}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Set Up Rewards'
          )}
        </Button>
      </form>
    </Form>
  )
}