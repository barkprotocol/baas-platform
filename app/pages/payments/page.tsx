'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, CreditCard, Wallet, Building, RefreshCw, Save, Trash2, Info } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import QRCode from 'qrcode.react'
import { Switch } from "@/components/ui/switch"

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  currency: z.enum(["USDC", "BARK", "SOL"]),
  paymentMethod: z.enum(["crypto", "card", "bank"]),
  recipient: z.string().min(1, "Recipient is required"),
  saveRecipient: z.boolean().default(false),
})

type PaymentForm = z.infer<typeof paymentSchema>

// Environment variables
const MERCHANT_FEE_PERCENTAGE = parseFloat(process.env.NEXT_PUBLIC_MERCHANT_FEE_PERCENTAGE || "1.5")
const BARK_PROTOCOL_FEE_PERCENTAGE = 0.05
const SOLANA_TX_FEE = 0.000005 // Assuming a fixed Solana transaction fee in SOL

// Mock API calls
const submitPayment = async (data: PaymentForm): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, transactionId: Math.random().toString(36).substring(2, 15) })
    }, 2000)
  })
}

const fetchRecentTransactions = async (): Promise<Array<{ id: string; amount: string; currency: string; recipient: string; date: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', amount: '100', currency: 'USDC', recipient: 'Alice', date: '2024-10-01' },
        { id: '2', amount: '50', currency: 'BARK', recipient: 'Bob', date: '2024-10-02' },
        { id: '3', amount: '0.5', currency: 'SOL', recipient: 'Charlie', date: '2024-10-03' },
      ])
    }, 1000)
  })
}

const fetchExchangeRates = async (): Promise<{ [key: string]: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        USDC: 1,
        BARK: 0.1,
        SOL: 50,
      })
    }, 500)
  })
}

const quickAmounts = [10, 50, 100, 500]

export default function PaymentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<Array<{ id: string; amount: string; currency: string; recipient: string; date: string }>>([])
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transactionFee, setTransactionFee] = useState(0)
  const [savedRecipients, setSavedRecipients] = useState<string[]>([])

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      currency: "USDC",
      paymentMethod: "crypto",
      recipient: "",
      saveRecipient: false,
    },
  })

  useEffect(() => {
    fetchRecentTransactions().then(setRecentTransactions)
    fetchExchangeRates().then(setExchangeRates)
    const storedRecipients = localStorage.getItem('savedRecipients')
    if (storedRecipients) {
      setSavedRecipients(JSON.parse(storedRecipients))
    }
  }, [])

  const onSubmit = async (data: PaymentForm) => {
    setIsSubmitting(true)
    try {
      const result = await submitPayment(data)
      if (result.success) {
        if (data.saveRecipient && !savedRecipients.includes(data.recipient)) {
          const newSavedRecipients = [...savedRecipients, data.recipient]
          setSavedRecipients(newSavedRecipients)
          localStorage.setItem('savedRecipients', JSON.stringify(newSavedRecipients))
        }
        setShowConfirmation(true)
        form.reset()
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTransactionFee = (amount: string, currency: string, paymentMethod: string) => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return 0

    let merchantFee = (numAmount * MERCHANT_FEE_PERCENTAGE) / 100
    let barkProtocolFee = (numAmount * BARK_PROTOCOL_FEE_PERCENTAGE) / 100
    let solanaTxFee = SOLANA_TX_FEE * (exchangeRates[currency] || 1)

    let totalFee = merchantFee + barkProtocolFee + solanaTxFee

    // Apply logic from the attachment
    if (paymentMethod === 'crypto') {
      totalFee *= 0.5 // 50% discount for crypto payments
    } else if (paymentMethod === 'card') {
      totalFee *= 1.2 // 20% surcharge for card payments
    }

    setTransactionFee(parseFloat(totalFee.toFixed(2)))
    return totalFee
  }

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'amount' || name === 'currency' || name === 'paymentMethod') {
        calculateTransactionFee(value.amount || '0', value.currency || 'USDC', value.paymentMethod || 'crypto')
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  const handleQuickAmountSelect = (amount: number) => {
    form.setValue('amount', amount.toString())
    calculateTransactionFee(amount.toString(), form.getValues('currency'), form.getValues('paymentMethod'))
  }

  const handleDeleteRecipient = (recipient: string) => {
    const newSavedRecipients = savedRecipients.filter(r => r !== recipient)
    setSavedRecipients(newSavedRecipients)
    localStorage.setItem('savedRecipients', JSON.stringify(newSavedRecipients))
    toast({
      title: "Recipient Deleted",
      description: `${recipient} has been removed from your saved recipients.`,
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Button onClick={() => router.push('/')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
        Back to Main
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <CreditCard className="mr-2 h-6 w-6" style={{color: '#D0BFB4'}} />
              Make a Payment
            </CardTitle>
            <CardDescription>Send money quickly and securely</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the amount you wish to send
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmountSelect(amount)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="USDC" id="usdc" />
                            </FormControl>
                            <Label htmlFor="usdc" className="font-normal flex items-center">
                              <Image src="/assets/icons/usdc.png" alt="USDC" width={24} height={24} className="mr-1" />
                              USDC
                            </Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="BARK" id="bark" />
                            </FormControl>
                            <Label htmlFor="bark" className="font-normal flex items-center">
                              <Image src="/assets/icons/bark.png" alt="BARK" width={24} height={24} className="mr-1" />
                              BARK
                            </Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="SOL" id="sol" />
                            </FormControl>
                            <Label htmlFor="sol" className="font-normal flex items-center">
                              <Image src="/assets/icons/sol.png" alt="SOL" width={24} height={24} className="mr-1" />
                              SOL
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="crypto">
                            <div className="flex items-center">
                              <Wallet className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
                              Cryptocurrency
                            </div>
                          </SelectItem>
                          <SelectItem value="card">
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
                              Credit/Debit Card
                            </div>
                          </SelectItem>
                          <SelectItem value="bank">
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
                              Bank Transfer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipient's address or username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {savedRecipients.length > 0 && (
                  <Select onValueChange={(value) => form.setValue('recipient', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a saved recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedRecipients.map((recipient) => (
                        <SelectItem key={recipient} value={recipient}>
                          <div className="flex justify-between items-center w-full">
                            <span>{recipient}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDeleteRecipient(recipient)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormField
                  control={form.control}
                  name="saveRecipient"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Save Recipient
                        </FormLabel>
                        <FormDescription>
                          Save this recipient for future transactions
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
                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Transaction Fee: {transactionFee} {form.getValues('currency')}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Fee breakdown:</p>
                        <p>Merchant Fee: {MERCHANT_FEE_PERCENTAGE}%</p>
                        <p>BARK Protocol Fee: {BARK_PROTOCOL_FEE_PERCENTAGE}%</p>
                        <p>Solana Tx Fee: {SOLANA_TX_FEE} SOL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {form.getValues('currency') !== 'USDC' && (
                  <div className="text-sm text-gray-500">
                    Estimated value: {(parseFloat(form.getValues('amount') || '0') * (exchangeRates[form.getValues('currency')] || 1)).toFixed(2)} USDC
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Send Payment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.currency}</TableCell>
                    <TableCell>{transaction.recipient}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={() => fetchRecentTransactions().then(setRecentTransactions)} variant="outline" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Confirmation</DialogTitle>
            <DialogDescription>
              Your payment has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p>Amount: {form.getValues('amount')} {form.getValues('currency')}</p>
            <p>Recipient: {form.getValues('recipient')}</p>
            <p>Payment Method: {form.getValues('paymentMethod')}</p>
            <p>Transaction Fee: {transactionFee} {form.getValues('currency')}</p>
            <p>Total Amount: {(parseFloat(form.getValues('amount') || '0') + transactionFee).toFixed(2)} {form.getValues('currency')}</p>
          </div>
          {form.getValues('paymentMethod') === 'crypto' && (
            <div className="mt-4">
              <p>Scan this QR code to complete the transaction:</p>
              <QRCode value={`${form.getValues('amount')}-${form.getValues('currency')}-${form.getValues('recipient')}`} size={128} />
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}