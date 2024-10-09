'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Gift, Wallet, Loader2 } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { useToast } from "@/components/ui/use-toast"

export default function CreateGiftBlinkPage() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('SOL')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [expiration, setExpiration] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/blinks/gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, recipient, message, expiration }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Gift Blink Created",
          description: "Your Gift Blink has been successfully created.",
        })
        router.push('/blinks')
      } else {
        throw new Error(data.error || 'Failed to create Gift Blink')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while creating the Gift Blink",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  const isFormValid = amount && recipient && expiration

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 sm:mb-0">Create Gift Blink</h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button asChild variant="outline">
            <Link href="/blinks/create">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {!publicKey ? (
          <Alert className="mb-6">
            <Wallet className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to create a Gift Blink. You need a connected wallet to interact with the Solana blockchain.
            </AlertDescription>
          </Alert>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create a Gift Blink</CardTitle>
                <CardDescription>Fill in the details to create your Gift Blink</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) =>   setAmount(e.target.value)}
                      placeholder="Enter gift amount"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="BARK">BARK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address or Username</Label>
                    <Input
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Enter recipient's address or username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Gift Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter a message for the gift recipient"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiration">Expiration Date</Label>
                    <Input
                      id="expiration"
                      type="date"
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
                    <Gift className="mr-2 h-4 w-4" />
                    Create Gift Blink
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Gift Blink Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this Gift Blink? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button onClick={handleConfirmedSubmit} disabled={isLoading}>
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