'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import QRCode from 'qrcode'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { ErrorBoundary } from '@/components/error-boundary'

// Initialize Solana connection (replace with your RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com')

const iconColor = "#D0BFB4"
const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

type RecurringFrequency = 'daily' | 'weekly' | 'monthly'
type TokenType = keyof typeof tokenIcons

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
  description: z.string().optional(),
  expirationDays: z.number().min(1).max(30),
  isRecurring: z.boolean(),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly']),
  selectedToken: z.enum(['SOL', 'USDC', 'BARK']),
  recipientEmail: z.string().email().optional().or(z.literal('')),
})

type FormData = z.infer<typeof formSchema>

export default function CreatePaymentBlinkPage() {
  const router = useRouter()
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isBlinkVisible, setIsBlinkVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [image, setImage] = useState<File | null>(null)

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: '',
      description: '',
      expirationDays: 7,
      isRecurring: false,
      recurringFrequency: 'monthly',
      selectedToken: 'SOL',
      recipientEmail: '',
    },
  })

  const watchName = watch('name')
  const watchAmount = watch('amount')
  const watchSelectedToken = watch('selectedToken')

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
  }, [watchName, watchAmount, watchSelectedToken])

  const handleBackToBlinks = useCallback(() => router.push('/blinks'), [router])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageUploading(true)
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(file)
        setIsImageUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const generateQRCode = useCallback(async () => {
    if (watchName && watchAmount && watchSelectedToken) {
      const blinkUrl = `https://blinks.barkprotocol.com/payment/${watchName}?amount=${watchAmount}&token=${watchSelectedToken}`
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(blinkUrl)
        setQrCodeUrl(qrCodeDataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
  }, [watchName, watchAmount, watchSelectedToken])

  const onSubmit = useCallback((data: FormData) => {
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

      // Create the transaction
      const tx = await program.methods.createPaymentBlink(
        watchName,
        watch('description'),
        new anchor.BN(parseFloat(watchAmount) * LAMPORTS_PER_SOL),
        watchSelectedToken,
        watch('expirationDays'),
        watch('isRecurring'),
        watch('recurringFrequency')
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
        description: `Your Payment Blink "${watchName}" has been created successfully!`,
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
  }, [publicKey, signTransaction, watchName, watchAmount, watchSelectedToken, watch, router, toast])

  const handleSendBlink = useCallback(async () => {
    const recipientEmail = watch('recipientEmail')
    if (!recipientEmail) {
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
        description: `Your Payment Blink has been sent to ${recipientEmail}`,
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
  }, [watch, toast])

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem('paymentBlinkDraft', JSON.stringify(watch()))
    toast({
      title: "Draft Saved",
      description: "Your Payment Blink draft has been saved.",
    })
  }, [watch, toast])

  const loadDraft = useCallback(() => {
    const draft = localStorage.getItem('paymentBlinkDraft')
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      Object.entries(parsedDraft).forEach(([key, value]) => {
        setValue(key as keyof FormData, value)
      })
      toast({
        title: "Draft Loaded",
        description: "Your saved Payment Blink draft has been loaded.",
      })
    }
  }, [setValue, toast])

  const creationFee = useMemo(() => {
    return parseFloat(watchAmount || '0') * 0.002 + 0.000005
  }, [watchAmount])

  return (
    <ErrorBoundary>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Blink Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter Payment Blink name"
                      {...field}
                      aria-invalid={!!errors.name}
                    />
                  )}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="amount"
                          type="number"
                          step="0.000000001"
                          min="0"
                          placeholder={`Enter amount in ${watchSelectedToken}`}
                          className="pl-10"
                          {...field}
                          aria-invalid={!!errors.amount}
                        />
                      )}
                    />
                    <Image
                      src={tokenIcons[watchSelectedToken]}
                      alt={`${watchSelectedToken} icon`}
                      width={24}
                      height={24}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    />
                  </div>
                  <Controller
                    name="selectedToken"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[100px]">
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
                    )}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>
              <div  className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      placeholder="Enter a brief description for this Payment Blink"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Blink Image (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
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
                  {image && <span className="text-sm">{image.name}</span>}
                </div>
              </div>
              {image && qrCodeUrl && (
                <div className="space-y-2">
                  <Label>Preview with QR Code</Label>
                  <div className="relative w-full h-64">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Blink preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                    <div className="absolute top-2 right-2 w-1/4 h-1/4">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="expirationDays">Expiration</Label>
                <Controller
                  name="expirationDays"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={30}
                        step={1}
                        className="flex-grow"
                      />
                      <span className="w-12 text-right">{field.value} days</span>
                    </div>
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isRecurring"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isRecurring"
                    />
                  )}
                />
                <Label htmlFor="isRecurring">Recurring Payment</Label>
              </div>
              {watch('isRecurring') && (
                <div className="space-y-2">
                  <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
                  <Controller
                    name="recurringFrequency"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="recurringFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email (Optional)</Label>
                <Controller
                  name="recipientEmail"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="Enter recipient's email"
                      {...field}
                      aria-invalid={!!errors.recipientEmail}
                    />
                  )}
                />
                {errors.recipientEmail && <p className="text-sm text-red-500">{errors.recipientEmail.message}</p>}
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
                  disabled={isLoading || !publicKey}
                >
                  {isLoading ? 'Creating Payment Blink...' : 'Create Payment Blink'}
                </Button>
                <Button 
                  type="button" 
                  className="flex-1" 
                  onClick={handleSendBlink}
                  disabled={isLoading || !watch('recipientEmail')}
                >
                  <Send className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  Send Blink
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                >
                  <Save className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadDraft}
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
                https://blinks.barkprotocol.app/payment/{watchName || 'your-payment-blink-name'}
              </code>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`https://blinks.barkprotocol.app/payment/${watchName || 'your-payment-blink-name'}`)
                  toast({
                    title: "Link Copied",
                    description: "The Payment Blink link has been copied to your clipboard.",
                  })
                }}
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
    </ErrorBoundary>
  )
}