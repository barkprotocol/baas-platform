import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Zap, ArrowLeft, Share2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const sendBlinkSchema = z.object({
  recipient: z.string().min(1, 'Recipient is required'),
  amount: z.number().min(0.01, 'Amount must be at least 0.01'),
  message: z.string().max(280, 'Message must be 280 characters or less').optional(),
})

type SendBlinkFormData = z.infer<typeof sendBlinkSchema>

interface ApiResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
}

// Mock API function (replace with actual API call)
const sendBlink = async (data: SendBlinkFormData): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() > 0.1) {
    return { 
      success: true, 
      message: "Blink sent successfully", 
      transactionId: "tx_" + Math.random().toString(36).substr(2, 9) 
    };
  } else {
    throw new Error("Failed to send Blink");
  }
};

// Mock function to share on social media (replace with actual social media API integrations)
const shareOnSocialMedia = async (platform: 'twitter' | 'facebook', message: string): Promise<void> => {
  console.log(`Sharing on ${platform}: ${message}`);
  // In a real implementation, this would use the respective social media API to post the message
};

export default function SendBlinkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SendBlinkFormData>({
    resolver: zodResolver(sendBlinkSchema),
  })

  const watchAmount = watch('amount')
  const watchMessage = watch('message')

  const onSubmit = async (data: SendBlinkFormData) => {
    setIsLoading(true)

    try {
      if (!publicKey || !signTransaction) {
        throw new Error("Please connect your wallet to send a Blink")
      }

      const result = await sendBlink(data)

      if (result.success) {
        toast({
          title: "Success",
          description: `${result.message} Transaction ID: ${result.transactionId}`,
        })

        // Generate share message
        const shareMessage = `I just sent a Blink of ${data.amount} BARK! ${data.message ? `Message: ${data.message}` : ''} #BARKBaaS`

        // Offer to share on social media
        if (window.confirm('Would you like to share this Blink on Twitter?')) {
          await shareOnSocialMedia('twitter', shareMessage)
        }

        router.push('/blinks/blinkboard')
      } else {
        throw new Error(result.message || 'Operation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToBlinkboard = () => {
    router.push('/blinks/blinkboard')
  }

  return (
    <>
      <Head>
        <title>Send a Blink | BARK BaaS Platform</title>
        <meta name="description" content="Send a Blink for instant payments on the BARK BaaS Platform." />
      </Head>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Send a Blink</h1>
          <Button onClick={handleBackToBlinkboard} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Blinkboard
          </Button>
        </div>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
          <AlertTitle>Send a Blink!</AlertTitle>
          <AlertDescription>
            Send instant payments using Blinks on the BARK Protocol.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Send a Blink</CardTitle>
            <CardDescription>Send a Blink payment instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input id="recipient" {...register('recipient')} placeholder="Enter recipient's address or username" />
                  {errors.recipient && <p className="text-red-500 text-sm">{errors.recipient.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="amount">Amount (BARK)</Label>
                  <Input id="amount" {...register('amount', { valueAsNumber: true })} type="number" step="0.01" placeholder="Enter amount to send" />
                  {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Input id="message" {...register('message')} placeholder="Add a message to your Blink" />
                  {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
                  <p className="text-sm text-gray-500">{watchMessage?.length || 0}/280 characters</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <WalletMultiButton />
                <Button className="w-full sm:w-auto ml-4" type="submit" disabled={isLoading || !publicKey}>
                  {isLoading ? 'Sending...' : 'Send Blink'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center"><Share2 className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Share Preview</CardTitle>
            <CardDescription>Preview how your Blink will look when shared on social media.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="font-bold">I just sent a Blink of {watchAmount || '0'} BARK!</p>
              {watchMessage && <p className="mt-2">{watchMessage}</p>}
              <p className="mt-2 text-blue-500">#BARKBaaS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}