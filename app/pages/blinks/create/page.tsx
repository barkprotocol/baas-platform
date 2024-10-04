'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Zap } from 'lucide-react'

// Initialize Solana connection (replace with your RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com')

export default function CreateBlinkPage() {
  const router = useRouter()
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [blinkName, setBlinkName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleBackToBlinks = () => router.push('/blinks')

  const handleCreateBlink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real application, you would interact with your Blink smart contract here
      // For this example, we'll simulate creating a Blink by sending a small amount of SOL to the user's own wallet
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: LAMPORTS_PER_SOL / 100, // 0.01 SOL
        })
      )

      const { blockhash } = await connection.getRecentBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signed = await signTransaction(transaction)
      const txid = await connection.sendRawTransaction(signed.serialize())

      toast({
        title: "Blink Created",
        description: `Your Blink "${blinkName}" has been created successfully!`,
      })

      // In a real application, you would save the Blink details to your backend here

      router.push('/blinks')
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Zap className="mr-2 h-8 w-8 text-primary" aria-hidden="true" />
          Create New Blink
        </h1>
        <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Back to </span>Blinks
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Create a New Blink</AlertTitle>
        <AlertDescription>
          Fill in the details below to create a new Blink for instant payments on Solana.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Blink Details</CardTitle>
          <CardDescription>Enter the name, amount, and description for your new Blink.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blink-name">Blink Name</Label>
              <Input
                id="blink-name"
                placeholder="Enter Blink name"
                value={blinkName}
                onChange={(e) => setBlinkName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SOL)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">◎</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.000000001"
                  min="0"
                  placeholder="Enter amount in SOL"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description for this Blink"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="pt-4">
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 w-full" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !publicKey}>
              {isLoading ? 'Creating Blink...' : 'Create Blink'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}