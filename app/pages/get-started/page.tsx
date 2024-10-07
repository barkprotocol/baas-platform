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
import { NFTForm } from '@/components/get-started/nft-form'
import { CrowdfundingForm } from '@/components/get-started/crowdfunding-form'
import { GiftForm } from '@/components/get-started/gift-form'
import { MerchantForm } from '@/components/get-started/merchant-form'
import { SwapForm } from '@/components/get-started/swap-form'
import { StakingForm } from '@/components/get-started/staking-form'
import { MembershipForm } from '@/components/get-started/membership-form'
import { TieredTokenForm } from '@/components/get-started/tiered-token-form'
import { createBlink, processDonation, makePayment, mintNFT, startCrowdfunding, sendGift, createMerchant, performSwap, stakeTokens, createMembership, createTieredToken } from '@/app/actions/solana/solana'

interface Tier {
  name: string;
  description: string;
  features: string[];
  price: string;
}

const tiers: Tier[] = [
  {
    name: "Basic",
    description: "Essential features for individuals",
    features: ["Create Blinks", "Process Donations", "Make Payments", "Token Swaps"],
    price: "Free"
  },
  {
    name: "Pro",
    description: "Advanced features for small businesses",
    features: ["All Basic features", "Mint NFTs", "Start Crowdfunding Campaigns", "Staking", "Tiered Tokens"],
    price: "$19.99/month"
  },
  {
    name: "Enterprise",
    description: "Full suite for large organizations",
    features: ["All Pro features", "Send Gifts", "Create Merchant Accounts", "Membership Programs", "Priority Support"],
    price: "Custom pricing"
  }
];

export default function GetStartedPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { publicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState('tiers')
  const [selectedTier, setSelectedTier] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedTier') || null
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isPriceFetching, setIsPriceFetching] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState('')
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

  useEffect(() => {
    if (selectedTier) {
      localStorage.setItem('selectedTier', selectedTier)
    }
  }, [selectedTier])

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

      if (!selectedTier) {
        throw new Error("Please select a tier before proceeding")
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
        case 'nft':
          result = await mintNFT(data)
          break
        case 'crowdfunding':
          result = await startCrowdfunding(data)
          break
        case 'gift':
          result = await sendGift(data)
          break
        case 'merchant':
          result = await createMerchant(data)
          break
        case 'swap':
          result = await performSwap(data)
          break
        case 'staking':
          result = await stakeTokens(data)
          break
        case 'membership':
          result = await createMembership(data)
          break
        case 'tieredToken':
          result = await createTieredToken(data)
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
      setConfirmationOpen(false)
    }
  }, [connected, toast, selectedTier])

  const handleBackToMain = useCallback(() => {
    router.push('/')
  }, [router])

  const handleConfirmation = useCallback((action: string) => {
    setConfirmationAction(action)
    setConfirmationOpen(true)
  }, [])

  const handleTierSelection = useCallback((tierName: string) => {
    setSelectedTier(tierName)
    setActiveTab('blink') // Move to the first feature tab after selecting a tier
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Get Started with BARK Protocol</h1>
        <div className="flex space-x-4">
          <WalletButton />
          <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> 
            <span className="sr-only">Navigate back to main page</span>
            Back to Main
          </Button>
        </div>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Welcome to your Blinkboard!</AlertTitle>
        <AlertDescription>
          Here you can create Solana Blinks, process donations, make payments, mint NFTs, start crowdfunding campaigns, swap tokens, stake, create memberships, and more.
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
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="tiers">Select Tier</TabsTrigger>
          <TabsTrigger value="blink" disabled={!selectedTier}>Blink</TabsTrigger>
          <TabsTrigger value="donations" disabled={!selectedTier}>Donations</TabsTrigger>
          <TabsTrigger value="payments" disabled={!selectedTier}>Payments</TabsTrigger>
          <TabsTrigger value="swap" disabled={!selectedTier}>Swap</TabsTrigger>
          <TabsTrigger value="nft" disabled={!selectedTier || selectedTier === "Basic"}>Mint NFT</TabsTrigger>
          <TabsTrigger value="crowdfunding" disabled={!selectedTier || selectedTier === "Basic"}>Crowdfunding</TabsTrigger>
          <TabsTrigger value="staking" disabled={!selectedTier || selectedTier === "Basic"}>Staking</TabsTrigger>
          <TabsTrigger value="tieredToken" disabled={!selectedTier || selectedTier === "Basic"}>Tiered Tokens</TabsTrigger>
          <TabsTrigger value="gift" disabled={!selectedTier || selectedTier !== "Enterprise"}>Gift</TabsTrigger>
          <TabsTrigger value="merchant" disabled={!selectedTier || selectedTier !== "Enterprise"}>Merchant</TabsTrigger>
          <TabsTrigger value="membership" disabled={!selectedTier || selectedTier !== "Enterprise"}>Membership</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tiers">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.name} className={`flex flex-col ${selectedTier === tier.name ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardContent>
                  <p className="text-2xl font-bold">{tier.price}</p>
                  <Button 
                    className="mt-4 w-full" 
                    onClick={() => handleTierSelection(tier.name)}
                    variant={selectedTier === tier.name ? "secondary" : "default"}
                  >
                    {selectedTier === tier.name ? "Selected" : "Select Tier"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
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
        
        <TabsContent value="swap">
          <Card>
            <CardHeader>
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>Exchange one token for another quickly and easily.</CardDescription>
            </CardHeader>
            <CardContent>
              <SwapForm onSubmit={(data) => handleSubmit('swap', data)} is

Loading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nft">
          <Card>
            <CardHeader>
              <CardTitle>Mint an NFT</CardTitle>
              <CardDescription>Create a unique digital asset on the blockchain.</CardDescription>
            </CardHeader>
            <CardContent>
              <NFTForm onSubmit={(data) => handleConfirmation('nft')} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crowdfunding">
          <Card>
            <CardHeader>
              <CardTitle>Start a Crowdfunding Campaign</CardTitle>
              <CardDescription>Raise funds for your project or cause.</CardDescription>
            </CardHeader>
            <CardContent>
              <CrowdfundingForm onSubmit={(data) => handleConfirmation('crowdfunding')} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staking">
          <Card>
            <CardHeader>
              <CardTitle>Stake Tokens</CardTitle>
              <CardDescription>Earn rewards by staking your tokens.</CardDescription>
            </CardHeader>
            <CardContent>
              <StakingForm onSubmit={(data) => handleSubmit('staking', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tieredToken">
          <Card>
            <CardHeader>
              <CardTitle>Create Tiered Tokens</CardTitle>
              <CardDescription>Set up a tiered token system for your project.</CardDescription>
            </CardHeader>
            <CardContent>
              <TieredTokenForm onSubmit={(data) => handleConfirmation('tieredToken')} isLoading={isLoading} isWalletConnected={connected} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gift">
          <Card>
            <CardHeader>
              <CardTitle>Create or Send a Gift</CardTitle>
              <CardDescription>Spread joy with digital gifts.</CardDescription>
            </CardHeader>
            <CardContent>
              <GiftForm onSubmit={(data) => handleSubmit('gift', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchant">
          <Card>
            <CardHeader>
              <CardTitle>Create Merchant Account</CardTitle>
              <CardDescription>Set up your merchant account to start selling.</CardDescription>
            </CardHeader>
            <CardContent>
              <MerchantForm onSubmit={(data) => handleConfirmation('merchant')} isLoading={isLoading} isWalletConnected={connected} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle>Create Membership Program</CardTitle>
              <CardDescription>Set up a membership program for your organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <MembershipForm onSubmit={(data) => handleConfirmation('membership')} isLoading={isLoading} isWalletConnected={connected} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed with this action? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSubmit(confirmationAction, {})}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}