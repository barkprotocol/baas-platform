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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Gift, RefreshCw } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import QRCode from 'qrcode.react'

const giftSchema = z.object({
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  currency: z.enum(["USDC", "BARK", "SOL"]),
  recipient: z.string().min(1, "Recipient is required"),
  message: z.string().max(500, "Message must be 500 characters or less").optional(),
})

type GiftForm = z.infer<typeof giftSchema>

// Mock API calls
const submitGift = async (data: GiftForm): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, transactionId: Math.random().toString(36).substring(2, 15) })
    }, 2000)
  })
}

const fetchGiftHistory = async (): Promise<Array<{ id: string; amount: string; currency: string; recipient: string; date: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', amount: '25', currency: 'USDC', recipient: 'Alice', date: '2024-10-01' },
        { id: '2', amount: '50', currency: 'BARK', recipient: 'Bob', date: '2024-10-02' },
        { id: '3', amount: '0.1', currency: 'SOL', recipient: 'Charlie', date: '2024-10-03' },
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

export default function GiftPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [giftHistory, setGiftHistory] = useState<Array<{ id: string; amount: string; currency: string; recipient: string; date: string }>>([])
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  const form = useForm<GiftForm>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      amount: "",
      currency: "USDC",
      recipient: "",
      message: "",
    },
  })

  useEffect(() => {
    fetchGiftHistory().then(setGiftHistory)
    fetchExchangeRates().then(setExchangeRates)
  }, [])

  const onSubmit = async (data: GiftForm) => {
    setIsSubmitting(true)
    try {
      const result = await submitGift(data)
      if (result.success) {
        setShowConfirmation(true)
        form.reset()
      } else {
        throw new Error("Gift sending failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your gift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRefreshGiftHistory = async () => {
    try {
      const updatedHistory = await fetchGiftHistory()
      setGiftHistory(updatedHistory)
      toast({
        title: "Success",
        description: "Gift history has been refreshed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh gift history. Please try again.",
        variant: "destructive",
      })
    }
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
              <Gift className="mr-2 h-6 w-6 text-purple-500" />
              Send a Gift
            </CardTitle>
            <CardDescription>Surprise someone with a crypto gift</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gift Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the amount you wish to gift
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
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gift Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a personal message to your gift"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Max 500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.getValues('currency') !== 'USDC' && (
                  <div className="text-sm text-gray-500">
                    Estimated value: {(parseFloat(form.getValues('amount') || '0') * (exchangeRates[form.getValues('currency')] || 1)).toFixed(2)} USDC
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Gift"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Gift History</CardTitle>
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
                {giftHistory.map((gift) => (
                  <TableRow key={gift.id}>
                    <TableCell>{gift.amount}</TableCell>
                    <TableCell>{gift.currency}</TableCell>
                    <TableCell>{gift.recipient}</TableCell>
                    <TableCell>{gift.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={handleRefreshGiftHistory} variant="outline" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gift Sent Successfully</DialogTitle>
            <DialogDescription>
              Your gift has been sent to the recipient.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p>Amount: {form.getValues('amount')} {form.getValues('currency')}</p>
            <p>Recipient: {form.getValues('recipient')}</p>
            <p>Message: {form.getValues('message') || 'No message provided'}</p>
          </div>
          <div className="mt-4">
            <p>Scan this QR code to view gift details:</p>
            <QRCode value={`${form.getValues('amount')}-${form.getValues('currency')}-${form.getValues('recipient')}-gift`} size={128} />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}