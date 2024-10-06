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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, CreditCard, Gift, Image as ImageIcon, Repeat } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
const iconColor = "#D0BFB4"

interface BlinkType {
  type: string
  name: string
}

interface BlinkFormData {
  name: string
  type: string
  amount: string
  currency: string
  description: string
}

const initialFormData: BlinkFormData = {
  name: '',
  type: 'payment',
  amount: '',
  currency: 'SOL',
  description: '',
}

export default function CreateBlinkPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [formData, setFormData] = useState<BlinkFormData>(initialFormData)
  const [blinkTypes, setBlinkTypes] = useState<BlinkType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBlinkTypes = async () => {
      try {
        const response = await fetch('/api/blinks/create')
        if (!response.ok) {
          throw new Error('Failed to fetch Blink types')
        }
        const data = await response.json()
        setBlinkTypes(data.blinkTypes)
      } catch (error) {
        console.error('Error fetching Blink types:', error)
        toast({
          title: "Error",
          description: "Failed to load Blink types. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchBlinkTypes()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/blinks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create Blink')
      }

      const newBlink = await response.json()
      toast({
        title: "Success",
        description: `Your ${formData.type} Blink "${formData.name}" has been created!`,
      })
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

  const handleBackToBlinks = () => router.push('/blinks')

  const getBlinkTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4" style={{ color: iconColor }} />
      case 'gift':
        return <Gift className="h-4 w-4" style={{ color: iconColor }} />
      case 'nft':
        return <ImageIcon className="h-4 w-4" style={{ color: iconColor }} />
      case 'subscription':
        return <Repeat className="h-4 w-4" style={{ color: iconColor }} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Create Blink
        </h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
            <span className="sr-only">Back to </span>Blinks
          </Button>
        </div>
      </div>

      {!publicKey && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to create a Blink. You need a connected wallet to interact with the Solana blockchain.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create a New Blink</CardTitle>
          <CardDescription>Fill in the details to create your new Blink</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Blink Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Blink name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Blink Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Blink type" />
                </SelectTrigger>
                <SelectContent>
                  {blinkTypes.map((blinkType) => (
                    <SelectItem key={blinkType.type} value={blinkType.type}>
                      <div className="flex items-center">
                        {getBlinkTypeIcon(blinkType.type)}
                        <span className="ml-2">{blinkType.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
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
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Blink description"
                rows={3}
              />
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