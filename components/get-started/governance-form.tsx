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
import { DatePicker } from '@/components/ui/date-picker'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  proposalType: z.enum(['text', 'program_upgrade', 'parameter_change']),
  votingPeriod: z.number().min(1, {
    message: 'Voting period must be at least 1 day.',
  }),
  quorum: z.number().min(1).max(100, {
    message: 'Quorum must be between 1 and 100 percent.',
  }),
  startDate: z.date(),
  programAddress: z.string().optional(),
  parameterName: z.string().optional(),
  parameterValue: z.string().optional(),
})

interface GovernanceFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
  isWalletConnected: boolean
}

export function GovernanceForm({ onSubmit, isLoading, isWalletConnected }: GovernanceFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      proposalType: 'text',
      votingPeriod: 7,
      quorum: 51,
      startDate: new Date(),
      programAddress: '',
      parameterName: '',
      parameterValue: '',
    },
  })

  const watchProposalType = form.watch('proposalType')

  function onFormSubmit(data: z.infer<typeof formSchema>) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposal Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter proposal title" {...field} />
              </FormControl>
              <FormDescription>
                Provide a clear and concise title for your proposal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposal Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter proposal description"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your proposal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proposalType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proposal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text Proposal</SelectItem>
                  <SelectItem value="program_upgrade">Program Upgrade</SelectItem>
                  <SelectItem value="parameter_change">Parameter Change</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of proposal you want to create.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchProposalType === 'program_upgrade' && (
          <FormField
            control={form.control}
            name="programAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter program address" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the address of the program you want to upgrade.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchProposalType === 'parameter_change' && (