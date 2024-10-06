'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Plus, CreditCard } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
const iconColor = "#D0BFB4"

interface ExampleBlink {
  id: string
  name: string
  type: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export default function ExampleBlinkPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [exampleBlink, setExampleBlink] = useState<ExampleBlink | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newBlinkName, setNewBlinkName] = useState('')

  useEffect(() => {
    const fetchExampleBlink = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/blinks/example')
        if (!response.ok) {
          throw new Error('Failed to fetch example blink')
        }
        const data = await response.json()
        setExampleBlink(data)
      } catch (error) {
        console.error('Error fetching example blink:', error)
        toast({
          title: "Error",
          description: "Failed to load example blink. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (publicKey) {
      fetchExampleBlink()
    }
  }, [publicKey, toast])

  const handleBackToBlinks = () => router.push('/blinks')

  const handleCreateNewBlink = async () => {
    if (!newBlinkName) {
      toast({
        title: "Error",
        description: "Please enter a name for the new blink.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/blinks/example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBlinkName,
          type: 'payment',
          amount: 100,
          currency: 'SOL',
          status: 'active',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create new blink')
      }

      const newBlink = await response.json()
      setExampleBlink(newBlink)
      setNewBlinkName('')
      toast({
        title: "Success",
        description: "New blink created successfully!",
      })
    } catch (error) {
      console.error('Error creating new blink:', error)
      toast({
        title: "Error",
        description: "Failed to create new blink. Please try again.",
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
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Example Blink
        </h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
            <span className="sr-only">Back to </span>Blinks
          </Button>
        </div>
      </div>

      {!publicKey ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view and create example blinks.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="text-center py-4">Loading example blink...</div>
      ) : exampleBlink ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                {exampleBlink.name}
              </CardTitle>
              <CardDescription>Example Blink Details</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{exampleBlink.id}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{exampleBlink.type}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">{exampleBlink.amount} {exampleBlink.currency}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{exampleBlink.status}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(exampleBlink.createdAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
          <AlertTitle>No example blink available</AlertTitle>
          <AlertDescription>
            We couldn't retrieve an example blink. You can create a new one below.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Create New Example Blink</CardTitle>
          <CardDescription>Enter a name to create a new example blink</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="newBlinkName" className="sr-only">
                New Blink Name
              </Label>
              <Input
                id="newBlinkName"
                placeholder="Enter new blink name"
                value={newBlinkName}
                onChange={(e) => setNewBlinkName(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateNewBlink} disabled={isLoading || !newBlinkName}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}