'use client';

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Check, RefreshCcw, Zap, Coins, CreditCard, PlusCircle, Landmark, Gift, Store, ArrowRightLeft, Gem, Users } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { WalletButton } from "@/components/ui/wallet-button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { Skeleton } from "@/components/ui/skeleton"

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
    features: ["All Basic features", "Mint NFTs", "Airdrop Campaigns", "Governance", "Rewards"],
    price: "$19.99/month"
  },
  {
    name: "Enterprise",
    description: "Full suite for large organizations",
    features: ["All Pro features", "Send Gifts", "Create Merchant Accounts", "Staking", "Membership Programs", "Start Crowdfunding Campaigns", "Treasury Rewards"],
    price: "$29.99/month"
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

  const renderTabIcon = (tab: string) => {
    switch (tab) {
      case 'blink': return <Zap className="w-4 h-4 mr-2" />
      case 'donations': return <Coins className="w-4 h-4 mr-2" />
      case 'payments': return <CreditCard className="w-4 h-4 mr-2" />
      case 'swap': return <ArrowRightLeft className="w-4 h-4 mr-2" />
      case 'nft': return <PlusCircle className="w-4 h-4 mr-2" />
      case 'crowdfunding': return <Landmark className="w-4 h-4 mr-2" />
      case 'staking': return <Gem className="w-4 h-4 mr-2" />
      case 'tieredToken': return <Gem className="w-4 h-4 mr-2" />
      case 'gift': return <Gift className="w-4 h-4 mr-2" />
      case 'merchant': return <Store className="w-4 h-4 mr-2" />
      case 'membership': return <Users className="w-4 h-4 mr-2" />
      default: return null
    }
  }

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
            SOL Price: {isPriceFetching ? <Skeleton className="h-4 w-16" /> : (solPrice ? `$${solPrice.toFixed(2)}` : 'N/A')}
          </div>
          <div className="text-sm font-medium">
            USDC Price: {isPriceFetching ? <Skeleton className="h-4 w-16" /> : (usdcPrice ? `$${usdcPrice.toFixed(2)}` : 'N/A')}
          </div>
        </div>
        <Button onClick={fetchPrices} variant="outline" size="sm" className="flex items-center" disabled={isPriceFetching}>
          <RefreshCcw className="mr-2 h-4 w-4" /> 
          <span className="sr-only">Refresh cryptocurrency prices</span>
          Refresh Prices
        </Button>
      </div>
      
      <Tabs value={activeTab} className="space-y-6" onValueChange={setActiveTab}>
        <TabsContent value="tiers">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
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
        
        <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
          <TabsTrigger value="tiers" className="flex-grow sm:flex-grow-0">Select Tier</TabsTrigger>
          {['blink', 'donations', 'payments', 'swap', 'nft', 'crowdfunding', 'staking', 'tieredToken', 'gift', 'merchant', 'membership'].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className="flex-grow sm:flex-grow-0" 
              disabled={!selectedTier || (selectedTier === "Basic" && ['nft', 'crowdfunding', 'staking', 'tieredToken'].includes(tab)) || (selectedTier !== "Enterprise" && ['gift', 'merchant', 'membership'].includes(tab))}
            >
              {renderTabIcon(tab)}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {activeTab !== 'tiers' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {renderTabIcon(activeTab)}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </CardTitle>
              <CardDescription>
                {activeTab === 'blink' && "Set up your Blink for instant payments."}
                {activeTab === 'donations' && "Receive donations for your cause."}
                {activeTab === 'payments' && "Send payments quickly and securely."}
                {activeTab === 'swap' && "Exchange one token for another quickly and easily."}
                {activeTab === 'nft' && "Create a unique digital asset on the blockchain."}
                {activeTab === 'crowdfunding' && "Raise funds for your project or cause."}
                {activeTab === 'staking' && "Earn rewards by staking your tokens."}
                {activeTab === 'tieredToken' && "Set up a tiered token system for your project."}
                {activeTab === 'gift' && "Spread joy with digital gifts."}
                {activeTab === 'merchant' && "Set up your merchant account to start selling."}
                {activeTab === 'membership' && "Set up a membership program for your organization."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'blink' && <BlinkForm onSubmit={(data) => handleSubmit('blink', data)} isLoading={isLoading} isWalletConnected={connected} />}
              {activeTab === 'donations' && <DonationForm onSubmit={(data) => handleSubmit('donation', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />}
              {activeTab === 'payments' && <PaymentForm onSubmit={(data) => handleSubmit('payment', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />}
              {activeTab === 'swap' && <SwapForm onSubmit={(data) => handleSubmit('swap', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />}
              {activeTab === 'nft' && <NFTForm onSubmit={(data) => handleConfirmation('nft')} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} />}
              {activeTab === 'crowdfunding' && <CrowdfundingForm onSubmit={(data) => handleConfirmation('crowdfunding')} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />}
              {activeTab === 'staking' && <StakingForm onSubmit={(data) => handleSubmit('staking', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} />}
              {activeTab === 'tieredToken' && <TieredTokenForm onSubmit={(data) => handleConfirmation('tieredToken')} isLoading={isLoading} isWalletConnected={connected} />}
              {activeTab === 'gift' && <GiftForm onSubmit={(data) => handleSubmit('gift', data)} isLoading={isLoading} isWalletConnected={connected} solPrice={solPrice} usdcPrice={usdcPrice} />}
              {activeTab === 'merchant' && <MerchantForm onSubmit={(data) => handleConfirmation('merchant')} isLoading={isLoading} isWalletConnected={connected} />}
              {activeTab === 'membership' && <MembershipForm onSubmit={(data) => handleConfirmation('membership')} isLoading={isLoading} isWalletConnected={connected} />}
            </CardContent>
          </Card>
        )}
      </Tabs>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed with this action? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSubmit(confirmationAction, {})}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}