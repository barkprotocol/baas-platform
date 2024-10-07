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

const donationFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  currency: z.enum(["SOL", "USDC"]),
  recipient: z.string().min(32, {
    message: "Please enter a valid Solana address.",
  }),
  message: z.string().max(200, {
    message: "Message must not exceed 200 characters.",
  }).optional(),
})

type DonationFormValues = z.infer<typeof donationFormSchema>

interface DonationFormProps {
  onSubmit: (data: DonationFormValues) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
  usdcPrice: number | null
}

export function DonationForm({ onSubmit, isLoading, isWalletConnected, solPrice, usdcPrice }: DonationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "",
      currency: "SOL",
      recipient: "",
      message: "",
    },
  })

  async function handleSubmit(values: DonationFormValues) {
    setIsSubmitting(true)
    await onSubmit(values)
    setIsSubmitting(false)
    form.reset()
  }

  const watchAmount = form.watch("amount")
  const watchCurrency = form.watch("currency")

  const usdEquivalent = () => {
    if (!watchAmount || isNaN(Number(watchAmount))) return "0.00"
    if (watchCurrency === "SOL" && solPrice) {
      return (Number(watchAmount) * solPrice).toFixed(2)
    }
    if (watchCurrency === "USDC" && usdcPrice) {
      return (Number(watchAmount) * usdcPrice).toFixed(2)
    }
    return "0.00"
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donation Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.000000001" min="0" placeholder="0.1" {...field} />
              </FormControl>
              <FormDescription>
                Enter the amount you wish to donate. (${usdEquivalent()} USD)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the currency for your donation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Address</FormLabel>
              <FormControl>
                <Input placeholder="Solana address of the recipient" {...field} />
              </FormControl>
              <FormDescription>
                Enter the Solana address of the donation recipient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a message to your donation..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can add a personal message to your donation (max 200 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting || !isWalletConnected}>
          {isSubmitting ? "Processing Donation..." : "Donate"}
        </Button>
      </form>
    </Form>
  )
}