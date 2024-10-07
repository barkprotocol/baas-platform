'use client';

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Check, RefreshCcw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { WalletButton } from "@/components/ui/wallet-button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BlinkForm } from '@/components/get-started/blink-form'
import { DonationForm } from '@/components/get-started/donation-form'
import { PaymentForm } from '@/components/get-started/payment-form'
import { SwapForm } from '@/components/get-started/swap-form'
import { createBlink, processDonation, makePayment, performSwap } from '@/app/actions/solana/solana'
import { ErrorBoundary } from '@/components/error-boundary'

export default function BasicBlinkboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { publicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState('blink')
  const [isLoading, setIsLoading] = useState(false)
  const [isPriceFetching, setIsPriceFetching] = useState(false)
  const [solPrice, setSolPrice] = useState<number | null>(null)
  const [usdcPrice, setUsdcPrice] = useState<number | null>(null)

  useEffect(() => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to use all features.",
        variant: "destructive",
      })
    }
    fetchPrices()
  }, [connected, toast])

  const fetchPrices = useCallback(async () => {
    setIsPriceFetching(true)
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd')
      const data = await response.json()
      setSolPrice(data.solana.usd)
      setUsdcPrice(data['usd-coin'].usd)
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      toast({
        title: "Error",
        description: "Failed to fetch current prices. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsPriceFetching(false)
    }
  }, [toast])

  const handleSubmit = useCallback(async (action: string, data: any) => {
    setIsLoading(true)

    try {
      if (!connected) {
        throw new Error("Wallet not connected")
      }

      let result;
      switch (action) {
        case 'blink':
          result = await createBlink(data)
          break
        case 'donation':
          result = await processDonation(data)
          break
        case 'payment':
          result = await makePayment(data)
          break
        case 'swap':
          result = await performSwap(data)
          break
        default:
          throw new Error('Invalid action')
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || `${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`,
        })
      } else {
        throw new Error(result.message || 'Operation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to process ${action}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [connected, toast])

  const handleBackToMain = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Basic Blinkboard</h1>
        <div className="flex space-x-4">
          <WalletButton />
          <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} /> 
            <span className="sr-only">Navigate back to main page</span>
            Back to Main
          </Button>
        </div>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} />
        <AlertTitle>Welcome to your Basic Blinkboard!</AlertTitle>
        <AlertDescription>
          Here you can create Solana Blinks, process donations, make payments, and swap tokens.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="text-sm font-medium">
            SOL Price: {isPriceFetching ? 'Fetching...' : (solPrice ? `$${solPrice.toFixed(2)}` : 'N/A')}
          </div>
          <div className="text-sm font-medium">
            USDC Price: {isPriceFetching ? 'Fetching...' : (usdcPrice ? `$${usdcPrice.toFixed(2)}` : 'N/A')}
          </div>
        </div>
        <Button onClick={fetchPrices} variant="outline" size="sm" className="flex items-center" disabled={isPriceFetching}>
          <RefreshCcw className="mr-2 h-4 w-4" /> 
          <span className="sr-only">Refresh cryptocurrency prices</span>
          Refresh Prices
        </Button>
      </div>
      
      <Tabs value={activeTab} className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger value="blink">Blink</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
        </TabsList>
        
        <ErrorBoundary>
          <TabsContent value="blink">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Blink</CardTitle>
                <CardDescription>Set up your Blink for instant payments.</CardDescription>
              </CardHeader>
              <CardContent>
                <BlinkForm onSubmit={(data) => handleSubmit('blink', data)} isLoading={isLoading} isWalletConnected={connected} />
              </CardContent>
            </Card>
          </TabsContent>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Process Donations</CardTitle>
                <CardDescription>Receive donations for your cause.</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationForm onSubmit={(data) => handleSubmit('donation', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />
              </CardContent>
            </Card>
          </TabsContent>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Send payments quickly and securely.</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentForm onSubmit={(data) => handleSubmit('payment', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />
              </CardContent>
            </Card>
          </TabsContent>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <TabsContent value="swap">
            <Card>
              <CardHeader>
                <CardTitle>Swap Tokens</CardTitle>
                <CardDescription>Exchange one token for another quickly and easily.</CardDescription>
              </CardHeader>
              <CardContent>
                <SwapForm onSubmit={(data) => handleSubmit('swap', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />
              </CardContent>
            </Card>
          </TabsContent>
        </ErrorBoundary>
      </Tabs>
    </div>
  )
}