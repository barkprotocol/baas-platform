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
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  tokenAddress: z.string().min(32, {
    message: 'Token address must be at least 32 characters.',
  }),
  recipients: z.string().min(1, {
    message: 'At least one recipient address is required.',
  }),
  amount: z.string().min(1, {
    message: 'Amount is required.',
  }),
  tokenType: z.enum(['SOL', 'SPL']),
})

interface AirdropFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
  usdcPrice: number | null
}

export function AirdropForm({ onSubmit, isLoading, isWalletConnected, solPrice, usdcPrice }: AirdropFormProps) {
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenAddress: '',
      recipients: '',
      amount: '',
      tokenType: 'SOL',
    },
  })

  function calculateEstimatedCost(data: z.infer<typeof formSchema>) {
    const recipientCount = data.recipients.split('\n').filter(address => address.trim() !== '').length
    const amount = parseFloat(data.amount)
    if (isNaN(amount) || recipientCount === 0) {
      setEstimatedCost(null)
      return
    }

    let cost = 0
    if (data.tokenType === 'SOL' && solPrice) {
      cost = amount * recipientCount * solPrice
    } else if (data.tokenType === 'SPL' && usdcPrice) {
      // Assuming SPL token price is pegged to USDC for this example
      cost = amount * recipientCount * usdcPrice
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
          name="tokenType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="SPL">SPL Token</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose between SOL or an SPL token for your airdrop.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                For SOL, you can leave this blank. For SPL tokens, enter the token's mint address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                Enter the amount of tokens to send to each recipient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}