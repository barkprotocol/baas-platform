'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Zap, Plus, Link as LinkIcon, Upload } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { tokenIcons, PROGRAM_ID, IDL } from '@/lib/constants'

// Initialize Solana connection (replace with your RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com')

const iconColor = "#D0BFB4"
const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

export default function CreateBlinkPage() {
  const router = useRouter()
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [blinkName, setBlinkName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [blinkType, setBlinkType] = useState('payment')
  const [expirationDays, setExpirationDays] = useState(7)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState('monthly')
  const [selectedToken, setSelectedToken] = useState('SOL')
  const [blinkImage, setBlinkImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isBlinkVisible, setIsBlinkVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinkVisible(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleBackToBlinks = useCallback(() => router.push('/blinks'), [router])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageUploading(true)
      // Simulate image upload delay
      setTimeout(() => {
        setBlinkImage(e.target.files![0])
        setIsImageUploading(false)
      }, 1000)
    }
  }, [])

  const handleCreateBlink = useCallback(async (e: React.FormEvent) => {
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
      // Initialize the BARK Blink program
      const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions())
      const program = new anchor.Program(IDL, PROGRAM_ID, provider)

      // Create a new account for the Blink
      const blinkAccount = anchor.web3.Keypair.generate()

      // Calculate the creation fee (0.2% + Solana fee)
      const creationFee = parseFloat(amount) * 0.002 + 0.000005 // Assuming 0.000005 SOL as Solana fee

      // Create the transaction
      const tx = await program.methods.createBlink(
        blinkName,
        description,
        new anchor.BN(parseFloat(amount) * LAMPORTS_PER_SOL),
        selectedToken,
        blinkType,
        expirationDays,
        isRecurring,
        recurringFrequency
      )
      .accounts({
        blink: blinkAccount.publicKey,
        user: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([blinkAccount])
      .rpc()

      toast({
        title: "Blink Created",
        description: `Your Blink "${blinkName}" has been created successfully!`,
      })

      router.push('/blinks')
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, signTransaction, blinkName, description, amount, selectedToken, blinkType, expirationDays, isRecurring, recurringFrequency, router, toast])

  const isFormValid = useMemo(() => {
    return blinkName.trim() !== '' && parseFloat(amount) > 0
  }, [blinkName, amount])

  const creationFee = useMemo(() => {
    return parseFloat(amount) * 0.002 + 0.000005
  }, [amount])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Create New 
          <span className={`ml-2 transition-opacity duration-300 ${isBlinkVisible ? 'opacity-100' : 'opacity-30'}`}>
            BLINK
          </span>
        </h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
            <span className="sr-only">Back to </span>Blinks
          </Button>
        </div>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
        <AlertTitle>Create a New Blink</AlertTitle>
        <AlertDescription>
          Fill in the details below to create a new Blink for instant payments or actions on Solana.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Blink Details</CardTitle>
          <CardDescription>Configure your new Blink with the options below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="blink-name">Blink Name</Label>
              <Input
                id="blink-name"
                placeholder="Enter Blink name"
                value={blinkName}
                onChange={(e) => setBlinkName(e.target.value)}
                required
                aria-label="Blink Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blink-type">Blink Type</Label>
              <Select value={blinkType} onValueChange={setBlinkType}>
                <SelectTrigger id="blink-type" aria-label="Blink Type">
                  <SelectValue placeholder="Select Blink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="nft">NFT Mint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Input
                    id="amount"
                    type="number"
                    step="0.000000001"
                    min="0"
                    placeholder={`Enter amount in ${selectedToken}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                    aria-label={`Amount in ${selectedToken}`}
                  />
                  <Image
                    src={tokenIcons[selectedToken as keyof typeof tokenIcons]}
                    alt={`${selectedToken} icon`}
                    width={24}
                    height={24}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                </div>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-[100px]" aria-label="Select Token">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tokenIcons).map(([token, iconUrl]) => (
                      <SelectItem key={token} value={token}>
                        <div className="flex items-center">
                          <Image src={iconUrl} alt={`${token} icon`} width={16} height={16} className="mr-2" />
                          {token}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                aria-label="Blink Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blink-image">Blink Image (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="blink-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload Blink Image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('blink-image')?.click()}
                  disabled={isImageUploading}
                >
                  {isImageUploading ? (
                    <Zap className="mr-2 h-4 w-4 animate-spin" style={{ color: iconColor }} />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  )}
                  {isImageUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                {blinkImage && <span className="text-sm">{blinkImage.name}</span>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration">Expiration</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="expiration"
                  value={[expirationDays]}
                  onValueChange={(value) => setExpirationDays(value[0])}
                  max={30}
                  step={1}
                  className="flex-grow"
                  aria-label="Expiration Days"
                />
                <span className="w-12 text-right">{expirationDays} days</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
                aria-label="Recurring Blink"
              />
              <Label htmlFor="recurring">Recurring Blink</Label>
            </div>
            {isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurring-frequency">Recurring Frequency</Label>
                <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                  <SelectTrigger id="recurring-frequency" aria-label="Recurring Frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Creation Fee: {creationFee.toFixed(6)} SOL
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !publicKey || !isFormValid}
              aria-label="Create Blink"
            >
              {isLoading ? 'Creating Blink...' : 'Create Blink'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview Blink Link</CardTitle>
          <CardDescription>This is how your Blink link will look once created.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md flex items-center justify-between">
            <code className="text-sm">
              https://blinks.barkprotocol.com/{blinkName || 'your-blink-name'}
            </code>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`https://blinks.barkprotocol.com/${blinkName || 'your-blink-name'}`)
                toast({
                  title: "Link Copied",
                  description: "The Blink link has been copied to your clipboard.",
                })
              }}
              aria-label="Copy Blink Link"
            >
              <LinkIcon className="h-4 w-4 mr-2" style={{ color: iconColor }} />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}