'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Repeat, Wallet, Loader2 } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { useToast } from "@/components/ui/use-toast"

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  currency: z.enum(['SOL', 'USDC', 'BARK']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Start date must be in the future',
  }),
  endDate: z.string().optional(),
  isAutoRenewing: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export default function CreateSubscriptionBlinkPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      amount: '',
      currency: 'SOL',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      isAutoRenewing: false,
    },
  })

  const onSubmit = (data: FormData) => {
    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Subscription Blink Created",
        description: "Your Subscription Blink has been successfully created.",
      })
      router.push('/blinks')
    } catch (error) {
      console.error('Error creating Subscription Blink:', error)
      toast({
        title: "Error",
        description: "Failed to create Subscription Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
            <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
            Create Subscription Blink
          </h1>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <WalletButton />
            <Button onClick={() => router.push('/blinks')} variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blinks
            </Button>
          </div>
        </header>

        {!publicKey ? (
          <Alert className="mb-6">
            <Wallet className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to create a Subscription Blink. You need a connected wallet to interact with the Solana blockchain.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create a Subscription Blink</CardTitle>
              <CardDescription>Fill in the details to create your Subscription Blink</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Subscription Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Enter subscription name"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Subscription Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="description"
                        placeholder="Enter subscription description"
                        {...field}
                      />
                    )}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Subscription Amount</Label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter subscription amount"
                        {...field}
                      />
                    )}
                  />
                  {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOL">SOL</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="BARK">BARK</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currency && <p className="text-sm text-red-500">{errors.currency.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="startDate"
                        type="date"
                        {...field}
                      />
                    )}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="endDate"
                        type="date"
                        {...field}
                      />
                    )}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="isAutoRenewing"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isAutoRenewing"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="isAutoRenewing">Auto-renewing Subscription</Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Repeat className="mr-2 h-4 w-4" />
                  Create Subscription Blink
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription Blink Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this Subscription Blink? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button onClick={handleSubmit(handleConfirmedSubmit)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}