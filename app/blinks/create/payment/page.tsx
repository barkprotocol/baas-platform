'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import QRCode from 'qrcode'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Zap, Plus, Link as LinkIcon, Upload, Info, Send, Save } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { tokenIcons, PROGRAM_ID, IDL } from '@/lib/constants'

// Initialize Solana connection (replace with your RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com')

const iconColor = "#D0BFB4"
const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

type RecurringFrequency = 'daily' | 'weekly' | 'monthly'
type TokenType = keyof typeof tokenIcons

interface PaymentBlinkFormData {
  name: string
  amount: string
  description: string
  expirationDays: number
  isRecurring: boolean
  recurringFrequency: RecurringFrequency
  selectedToken: TokenType
  image: File | null
  recipientEmail: string
}

const initialFormData: PaymentBlinkFormData = {
  name: '',
  amount: '',
  description: '',
  expirationDays: 7,
  isRecurring: false,
  recurringFrequency: 'monthly',
  selectedToken: 'SOL',
  image: null,
  recipientEmail: '',
}

export default function CreatePaymentBlinkPage() {
  const router = useRouter()
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [formData, setFormData] = useState<PaymentBlinkFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isBlinkVisible, setIsBlinkVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<PaymentBlinkFormData>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinkVisible(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer)
            return 100
          }
          const diff = Math.random() * 10
          return Math.min(oldProgress + diff, 100)
        })
      }, 500)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isLoading])

  useEffect(() => {
    generateQRCode()
  }, [formData.name, formData.amount, formData.selectedToken])

  const handleBackToBlinks = useCallback(() => router.push('/blinks'), [router])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }, [])

  const handleSwitchChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, isRecurring: checked }))
  }, [])

  const handleSliderChange = useCallback((value: number[]) => {
    setFormData(prev => ({ ...prev, expirationDays: value[0] }))
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageUploading(true)
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: file }))
        setIsImageUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const generateQRCode = useCallback(async () => {
    if (formData.name && formData.amount && formData.selectedToken) {
      const blinkUrl = `https://blinks.barkprotocol.com/payment/${formData.name}?amount=${formData.amount}&token=${formData.selectedToken}`
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(blinkUrl)
        setQrCodeUrl(qrCodeDataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
  }, [formData.name, formData.amount, formData.selectedToken])

  const validateField = useCallback((name: string, value: string) => {
    let errors = { ...formErrors }
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required'
        } else {
          delete errors.name
        }
        break
      case 'amount':
        if (!value || parseFloat(value) <= 0) {
          errors.amount = 'Amount must be greater than 0'
        } else {
          delete errors.amount
        }
        break
      case 'recipientEmail':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          errors.recipientEmail = 'Invalid email address'
        } else {
          delete errors.recipientEmail
        }
        break
      default:
        break
    }
    setFormErrors(errors)
  }, [formErrors])

  const handleCreateBlink = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmDialogOpen(true)
  }, [])

  const confirmCreateBlink = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Payment Blink.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setProgress(0)
    try {
      // Initialize the BARK Blink program
      const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions())
      const program = new anchor.Program(IDL, PROGRAM_ID, provider)

      // Create a new account for the Blink
      const blinkAccount = anchor.web3.Keypair.generate()

      // Calculate the creation fee (0.2% + Solana fee)
      const creationFee = parseFloat(formData.amount) * 0.002 + 0.000005 // Assuming 0.000005 SOL as Solana fee

      // Create the transaction
      const tx = await program.methods.createPaymentBlink(
        formData.name,
        formData.description,
        new anchor.BN(parseFloat(formData.amount) * LAMPORTS_PER_SOL),
        formData.selectedToken,
        formData.expirationDays,
        formData.isRecurring,
        formData.recurringFrequency
      )
      .accounts({
        blink: blinkAccount.publicKey,
        user: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([blinkAccount])
      .rpc()

      toast({
        title: "Payment Blink Created",
        description: `Your Payment Blink "${formData.name}" has been created successfully!`,
      })

      router.push('/blinks')
    } catch (error) {
      console.error('Error creating Payment Blink:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create Payment Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setProgress(100)
      setIsConfirmDialogOpen(false)
    }
  }, [publicKey, signTransaction, formData, router, toast])

  const handleSendBlink = useCallback(async () => {
    if (!formData.recipientEmail) {
      toast({
        title: "Recipient Email Required",
        description: "Please enter a recipient email address to send the Payment Blink.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate sending the Blink (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Payment Blink Sent",
        description: `Your Payment Blink has been sent to ${formData.recipientEmail}`,
      })
    } catch (error) {
      console.error('Error sending Payment Blink:', error)
      toast({
        title: "Error",
        description: "Failed to send Payment Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData.recipientEmail, toast])

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem('paymentBlinkDraft', JSON.stringify(formData))
    toast({
      title: "Draft Saved",
      description: "Your Payment Blink draft has been saved.",
    })
  }, [formData, toast])

  const loadDraft = useCallback(() => {
    const draft = localStorage.getItem('paymentBlinkDraft')
    if (draft) {
      setFormData(JSON.parse(draft))
      toast({
        title: "Draft Loaded",
        description: "Your saved Payment Blink draft has been loaded.",
      })
    }
  }, [toast])

  const isFormValid = useMemo(() => {
    return formData.name.trim() !== '' && parseFloat(formData.amount) > 0 && Object.keys(formErrors).length === 0
  }, [formData.name, formData.amount, formErrors])

  const creationFee = useMemo(() => {
    return parseFloat(formData.amount) * 0.002 + 0.000005
  }, [formData.amount])

  useEffect(() => {
    if (canvasRef.current && formData.image && qrCodeUrl) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          const qrImg = new Image()
          qrImg.onload = () => {
            const qrSize = Math.min(canvas.width, canvas.height) / 4
            ctx.drawImage(qrImg, canvas.width - qrSize - 10, 10, qrSize, qrSize)
          }
          qrImg.src = qrCodeUrl
        }
        img.src = URL.createObjectURL(formData.image)
      }
    }
  }, [formData.image, qrCodeUrl])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Create Payment 
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
        <AlertTitle>Create a New Payment Blink</AlertTitle>
        <AlertDescription>
          Fill in the details below to create a new Payment Blink for instant transactions on Solana.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Payment Blink Details</CardTitle>
          <CardDescription>Configure your new Payment Blink with the options below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Blink Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Payment Blink name"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-label="Payment Blink Name"
                aria-invalid={!!formErrors.name}
                aria-describedby="name-error"
              />
              {formErrors.name && <p id="name-error" className="text-sm text-red-500">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.000000001"
                    min="0"
                    placeholder={`Enter amount in ${formData.selectedToken}`}
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    aria-label={`Amount in ${formData.selectedToken}`}
                    aria-invalid={!!formErrors.amount}
                    aria-describedby="amount-error"
                  />
                  <Image
                    src={tokenIcons[formData.selectedToken]}
                    alt={`${formData.selectedToken} icon`}
                    width={24}
                    height={24}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                </div>
                <Select value={formData.selectedToken} onValueChange={(value) => handleSelectChange('selectedToken', value)}>
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
              {formErrors.amount && <p id="amount-error" className="text-sm text-red-500">{formErrors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a brief description for this Payment Blink"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                aria-label="Payment Blink Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Blink Image (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload Payment Blink Image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  disabled={isImageUploading}
                >
                  {isImageUploading ? (
                    <Zap className="mr-2 h-4 w-4 animate-spin" style={{ color: iconColor }} />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  )}
                  {isImageUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                {formData.image && <span className="text-sm">{formData.image.name}</span>}
              </div>
            </div>
            {formData.image && qrCodeUrl && (
              <div className="space-y-2">
                <Label>Preview with QR Code</Label>
                <canvas ref={canvasRef} className="w-full h-auto" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="expirationDays">Expiration</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="expirationDays"
                  value={[formData.expirationDays]}
                  onValueChange={handleSliderChange}
                  max={30}
                  step={1}
                  className="flex-grow"
                  aria-label="Expiration Days"
                />
                <span className="w-12 text-right">{formData.expirationDays} days</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={handleSwitchChange}
                aria-label="Recurring Payment Blink"
              />
              <Label htmlFor="isRecurring">Recurring Payment</Label>
            </div>
            {formData.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
                <Select value={formData.recurringFrequency} onValueChange={(value) => handleSelectChange('recurringFrequency', value)}>
                  <SelectTrigger id="recurringFrequency" aria-label="Recurring Frequency">
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
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email (Optional)</Label>
              <Input
                id="recipientEmail"
                name="recipientEmail"
                type="email"
                placeholder="Enter recipient's email"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                aria-label="Recipient Email"
                aria-invalid={!!formErrors.recipientEmail}
                aria-describedby="email-error"
              />
              {formErrors.recipientEmail && <p id="email-error" className="text-sm text-red-500">{formErrors.recipientEmail}</p>}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              Creation Fee: {creationFee.toFixed(6)} SOL
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 cursor-pointer" style={{ color: iconColor }} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The creation fee includes a 0.2% platform fee and Solana network fees.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading || !publicKey || !isFormValid}
                aria-label="Create Payment Blink"
              >
                {isLoading ? 'Creating Payment Blink...' : 'Create Payment Blink'}
              </Button>
              <Button 
                type="button" 
                className="flex-1" 
                onClick={handleSendBlink}
                disabled={isLoading || !isFormValid || !formData.recipientEmail}
                aria-label="Send Payment Blink"
              >
                <Send className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                Send Blink
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                aria-label="Save Draft"
              >
                <Save className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                Save Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={loadDraft}
                aria-label="Load Draft"
              >
                <Upload className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                Load Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview Payment Blink Link</CardTitle>
          <CardDescription>This is how your Payment Blink link will look once created.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md flex items-center justify-between">
            <code className="text-sm">
              https://blinks.barkprotocol.com/payment/{formData.name || 'your-payment-blink-name'}
            </code>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`https://blinks.barkprotocol.com/payment/${formData.name || 'your-payment-blink-name'}`)
                toast({
                  title: "Link Copied",
                  description: "The Payment Blink link has been copied to your clipboard.",
                })
              }}
              aria-label="Copy Payment Blink Link"
            >
              <LinkIcon className="h-4 w-4 mr-2" style={{ color: iconColor }} />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment Blink Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this Payment Blink? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmCreateBlink}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}