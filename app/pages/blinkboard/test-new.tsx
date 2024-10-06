'use client';

import { useState, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Gift, CreditCard, Coins, PlusCircle, Send, ShoppingBag, Zap, Package, Store, Landmark, ArrowLeft, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from 'lucide-react'
import { createBlink, processDonation, makePayment, mintNFT, startCrowdfunding, sendGift, createMerchant } from '@/lib/api'

export default function GetStartedPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('blink')
  const [isLoading, setIsLoading] = useState(false)
  const nftImageRef = useRef<HTMLInputElement>(null)
  const campaignImageRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
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
        default:
          throw new Error('Invalid action')
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || `${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`,
        })
        // Reset form
        e.currentTarget.reset()
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
  }, [toast])

  const handleBackToMain = useCallback(() => {
    router.push('/')
  }, [router])

  const handleImageDownload = useCallback((inputRef: React.RefObject<HTMLInputElement>, imageName: string) => {
    const imageUrl = inputRef.current?.value
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "No image URL provided.",
        variant: "destructive",
      })
      return
    }

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = imageName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      }));
  }, [toast])

  const renderForm = useCallback((action: string) => {
    const commonProps = {
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, action),
      className: "space-y-4",
    }

    switch (action) {
      case 'blink':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="blinkName">Blink Name</Label>
              <Input id="blinkName" name="blinkName" placeholder="Enter your Blink name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blinkDescription">Description</Label>
              <Textarea id="blinkDescription" name="blinkDescription" placeholder="Describe your Blink" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Creating...' : 'Create Blink'}
            </Button>
          </form>
        )
      case 'donation':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="donationAmount">Donation Amount</Label>
              <Input id="donationAmount" name="donationAmount" placeholder="Enter donation amount" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donorName">Donor Name</Label>
              <Input id="donorName" name="donorName" placeholder="Enter donor's name" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Processing...' : 'Process Donation'}
            </Button>
          </form>
        )
      case 'payment':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input id="paymentAmount" name="paymentAmount" placeholder="Enter payment amount" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select name="paymentMethod" required>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="bark">BARK</SelectItem>
                  <SelectItem value="sol">SOL</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="solana_pay">Solana Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Input id="recipientAddress" name="recipientAddress" placeholder="Enter recipient's address" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Sending...' : 'Send Payment'}
            </Button>
          </form>
        )
      case 'nft':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="nftName">NFT Name</Label>
              <Input id="nftName" name="nftName" placeholder="Enter NFT name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nftDescription">NFT Description</Label>
              <Textarea id="nftDescription" name="nftDescription" placeholder="Describe your NFT" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nftImage">NFT Image URL</Label>
              <Input id="nftImage" name="nftImage" placeholder="Enter image URL" required ref={nftImageRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nftCollection">Collection</Label>
              <Select name="nftCollection">
                <SelectTrigger id="nftCollection">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collection1">Collection 1</SelectItem>
                  <SelectItem value="collection2">Collection 2</SelectItem>
                  <SelectItem value="collection3">Collection 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nftRoyalty">Royalty Percentage</Label>
              <Input id="nftRoyalty" name="nftRoyalty" type="number" min="0" max="100" step="0.1" placeholder="Enter royalty percentage" required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="nftSoldable" name="nftSoldable" />
              <Label htmlFor="nftSoldable">List for sale immediately</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nftPrice">Price (if listed for sale)</Label>
              <Input id="nftPrice" name="nftPrice" type="number" step="0.01" placeholder="Enter price" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Minting...' : 'Mint NFT'}
              </Button>
              <Button type="button" variant="outline" onClick={() => handleImageDownload(nftImageRef, 'nft-image.png')}>
                <Download className="w-4 h-4 mr-2" aria-hidden="true" style={{color: '#D0BFB4'}} />
                Download Image
              </Button>
            </div>
          </form>
        )
      case 'crowdfunding':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input id="campaignName" name="campaignName" placeholder="Enter campaign name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignGoal">Funding Goal</Label>
              <Input id="campaignGoal" name="campaignGoal" placeholder="Enter funding goal" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignDescription">Campaign Description</Label>
              <Textarea id="campaignDescription" name="campaignDescription" placeholder="Describe your campaign" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignImage">Campaign Image URL</Label>
              <Input id="campaignImage" name="campaignImage" placeholder="Enter image URL" required ref={campaignImageRef} />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Starting...' : 'Start Campaign'}
              </Button>
              <Button type="button" variant="outline" onClick={() => handleImageDownload(campaignImageRef, 'campaign-image.png')}>
                <Download className="w-4 h-4 mr-2" aria-hidden="true" style={{color: '#D0BFB4'}} />
                Download Image
              </Button>
            </div>
          </form>
        )
      case 'gift':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="giftType">Gift Type</Label>
              <Input id="giftType" name="giftType" placeholder="Enter gift type" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="giftAmount">Gift Amount</Label>
              <Input id="giftAmount" name="giftAmount" placeholder="Enter gift amount" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input id="recipientEmail" name="recipientEmail" placeholder="Enter recipient's email" type="email" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Sending...' : 'Send Gift'}
            </Button>
          </form>
        )
      case 'merchant':
        return (
          <form {...commonProps}>
            <div className="space-y-2">
              <Label htmlFor="merchantName">Merchant Name</Label>
              <Input id="merchantName" name="merchantName" placeholder="Enter merchant name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchantEmail">Merchant Email</Label>
              <Input id="merchantEmail" name="merchantEmail" placeholder="Enter merchant email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchantDescription">Business Description</Label>
              <Textarea id="merchantDescription" name="merchantDescription" placeholder="Describe your business" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchantWallet">Solana Wallet Address</Label>
              <Input id="merchantWallet" name="merchantWallet" placeholder="Enter your Solana wallet address" required />
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} />
              <AlertTitle>Merchant Program Fee</AlertTitle>
              <AlertDescription>
                There is a one-time fee of 0.15 SOL to create a merchant account.
              </AlertDescription>
            </Alert>
            <Button type="submit" disabled={isLoading}>
              {isLo

ading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Creating...' : 'Create Merchant Account'}
            </Button>
          </form>
        )
      default:
        return null
    }
  }, [handleSubmit, isLoading, handleImageDownload, nftImageRef, campaignImageRef])

  const tabContent = useMemo(() => [
    { value: 'blink', title: 'Create a New Blink', description: 'Set up your Blink for instant payments.', icon: Zap },
    { value: 'donations', title: 'Process Donations', description: 'Receive donations for your cause.', icon: Coins },
    { value: 'payments', title: 'Make a Payment', description: 'Send payments quickly and securely.', icon: CreditCard },
    { value: 'nft', title: 'Mint an NFT', description: 'Create a unique digital asset on the blockchain.', icon: PlusCircle },
    { value: 'crowdfunding', title: 'Start a Crowdfunding Campaign', description: 'Raise funds for your project or cause.', icon: Landmark },
    { value: 'gift', title: 'Create or Send a Gift', description: 'Spread joy with digital gifts.', icon: Gift },
    { value: 'merchant', title: 'Create Merchant Account', description: 'Set up your merchant account to start selling.', icon: Store },
  ], [])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Get Started with BARK Protocol</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} /> Back to Main
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} />
        <AlertTitle>Welcome to your Blinkboard!</AlertTitle>
        <AlertDescription>
          Here you can create Solana Blinks, process donations, make payments, mint NFTs, start crowdfunding campaigns, send gifts, and set up your merchant account.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="blink" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {tabContent.map(({ value, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="flex items-center justify-center">
              <Icon className="w-4 h-4 mr-2" aria-hidden="true" style={{color: '#D0BFB4'}} />
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabContent.map(({ value, title, description, icon: Icon }) => (
          <TabsContent key={value} value={value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon className="w-5 h-5 mr-2" aria-hidden="true" style={{color: '#D0BFB4'}} />
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderForm(value)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}