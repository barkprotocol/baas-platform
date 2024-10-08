'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Gift, CreditCard, Coins, PlusCircle, Send, ShoppingBag, Zap, Package, Store, Landmark, ArrowLeft, Download, Github } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ApiResponse {
  success: boolean;
}

// BARK Blinkboard Enterprise API functions (replace these with actual API calls)
const createBlink = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const processDonation = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const makePayment = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const mintNFT = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const startCrowdfunding = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const sendGift = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const createMerchant = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

export default function GetStartedPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('blink')
  const [isLoading, setIsLoading] = useState(false)
  const nftImageRef = useRef<HTMLInputElement>(null)
  const campaignImageRef = useRef<HTMLInputElement>(null)
  const [nftPreview, setNftPreview] = useState<string | null>(null)
  const [campaignPreview, setCampaignPreview] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      let result: ApiResponse;
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
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`,
        })
        // Reset form
        e.currentTarget.reset()
        // Reset previews
        setNftPreview(null)
        setCampaignPreview(null)
      } else {
        throw new Error('Operation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process ${action}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToMain = () => {
    router.push('/')
  }

  const handleImageDownload = (inputRef: React.RefObject<HTMLInputElement>, imageName: string) => {
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
  }

  const handleImagePreview = useCallback((inputRef: React.RefObject<HTMLInputElement>, setPreview: (url: string | null) => void) => {
    const imageUrl = inputRef.current?.value
    if (imageUrl) {
      setPreview(imageUrl)
    } else {
      setPreview(null)
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Get Started with BARK Protocol</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Back to </span>Main
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Welcome to your Blinkboard!</AlertTitle>
        <AlertDescription>
          Here you can create Solana Blinks, process donations, make payments, mint NFTs, start crowdfunding campaigns, send gifts, and set up your merchant account.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="blink" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="blink" className="flex items-center justify-center"><Zap className="w-4 h-4 mr-2" aria-hidden="true" />Blink</TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center justify-center"><Coins className="w-4 h-4 mr-2" aria-hidden="true" />Donations</TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center justify-center"><CreditCard className="w-4 h-4 mr-2" aria-hidden="true" />Payments</TabsTrigger>
          <TabsTrigger value="nft" className="flex items-center justify-center"><PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />Mint NFT</TabsTrigger>
          <TabsTrigger value="crowdfunding" className="flex items-center justify-center"><Landmark className="w-4 h-4 mr-2" aria-hidden="true" />Crowdfunding</TabsTrigger>
          <TabsTrigger value="gift" className="flex items-center justify-center"><Gift className="w-4 h-4 mr-2" aria-hidden="true" />Gift</TabsTrigger>
          <TabsTrigger value="merchant" className="flex items-center justify-center"><Store className="w-4 h-4 mr-2" aria-hidden="true" />Merchant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blink">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2" aria-hidden="true" />Create a New Blink</CardTitle>
              <CardDescription>Set up your Blink for instant payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'blink')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="blinkName">Blink Name</Label>
                    <Input id="blinkName" name="blinkName" placeholder="Enter your Blink name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="blinkDescription">Description</Label>
                    <Textarea id="blinkDescription" name="blinkDescription" placeholder="Describe your Blink" required />
                  </div>
                </div>
                <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Blink'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Coins className="w-5 h-5 mr-2" aria-hidden="true" />Process Donations</CardTitle>
              <CardDescription>Receive donations for your cause.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'donation')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="donationAmount">Donation Amount</Label>
                    <RadioGroup defaultValue="5" name="donationAmount" className="flex space-x-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="r1" />
                        <Label htmlFor="r1">$5</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="r2" />
                        <Label htmlFor="r2">$10</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="25" id="r3" />
                        <Label htmlFor="r3">$25</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="r4" />
                        <Label htmlFor="r4">Custom</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Input id="customAmount" name="customAmount" placeholder="Enter custom amount" type="number" step="0.01" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="donationCurrency">Currency</Label>
                    <Select name="donationCurrency" defaultValue="BARK">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BARK">BARK</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="donorName">Donor Name (Optional)</Label>
                    <Input id="donorName" name="donorName" placeholder="Enter donor's name" />
                  </div>
                </div>
                <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process Donation'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="w-5 h-5 mr-2" aria-hidden="true" />Make a Payment</CardTitle>
              <CardDescription>Send payments quickly and securely.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'payment')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="paymentAmount">Payment Amount</Label>
                    <Input id="paymentAmount" name="paymentAmount" placeholder="Enter payment amount" type="number" step="0.01" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select  name="paymentMethod" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">
                          <div className="flex items-center">
                            <Image src="/icons/usdc.svg" alt="USDC" width={16} height={16} className="mr-2" />
                            USDC
                          </div>
                        </SelectItem>
                        <SelectItem value="bark">
                          <div className="flex items-center">
                            <Image src="/icons/bark.svg" alt="BARK" width={16} height={16} className="mr-2" />
                            BARK
                          </div>
                        </SelectItem>
                        <SelectItem value="sol">
                          <div className="flex items-center">
                            <Image src="/icons/sol.svg" alt="SOL" width={16} height={16} className="mr-2" />
                            SOL
                          </div>
                        </SelectItem>
                        <SelectItem value="stripe">
                          <div className="flex items-center">
                            <Image src="/icons/stripe.svg" alt="Stripe" width={16} height={16} className="mr-2" />
                            Stripe
                          </div>
                        </SelectItem>
                        <SelectItem value="solana_pay">
                          <div className="flex items-center">
                            <Image src="/icons/solana-pay.svg" alt="Solana Pay" width={16} height={16} className="mr-2" />
                            Solana Pay
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="recipientAddress">Recipient Address</Label>
                    <Input id="recipientAddress" name="recipientAddress" placeholder="Enter recipient's address" required />
                  </div>
                </div>
                <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Payment'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nft">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><PlusCircle className="w-5 h-5 mr-2" aria-hidden="true" />Mint an NFT</CardTitle>
              <CardDescription>Create a unique digital asset on the blockchain.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'nft')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftName">NFT Name</Label>
                    <Input id="nftName" name="nftName" placeholder="Enter NFT name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftDescription">NFT Description</Label>
                    <Textarea id="nftDescription" name="nftDescription" placeholder="Describe your NFT" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftImage">NFT Image URL</Label>
                    <Input 
                      id="nftImage" 
                      name="nftImage" 
                      placeholder="Enter image URL" 
                      required 
                      ref={nftImageRef}
                      onChange={() => handleImagePreview(nftImageRef, setNftPreview)}
                    />
                  </div>
                  {nftPreview && (
                    <div className="mt-2">
                      <Image src={nftPreview} alt="NFT Preview" width={200} height={200} className="rounded-lg" />
                    </div>
                  )}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftCollection">Collection</Label>
                    <Select name="nftCollection">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collection1">BARK NFT Collection 1</SelectItem>
                        <SelectItem value="collection2">BARK NFT Collection 2</SelectItem>
                        <SelectItem value="collection3">BARK NFT Collection 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftRoyalty">Royalty Percentage</Label>
                    <Input id="nftRoyalty" name="nftRoyalty" type="number" min="0" max="100" step="0.1" placeholder="Enter royalty percentage" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="nftSoldable" name="nftSoldable" />
                    <Label htmlFor="nftSoldable">List for sale immediately</Label>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftPrice">Price (if listed for sale)</Label>
                    <Input id="nftPrice" name="nftPrice" type="number" step="0.01" placeholder="Enter price" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      'Mint NFT'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleImageDownload(nftImageRef, 'nft-image.png')}>
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    Download Image
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crowdfunding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Landmark className="w-5 h-5 mr-2" aria-hidden="true" />Start a Crowdfunding Campaign</CardTitle>
              <CardDescription>Raise funds for your project or cause.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'crowdfunding')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input id="campaignName" name="campaignName" placeholder="Enter campaign name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="campaignGoal">Funding Goal</Label>
                    <Input id="campaignGoal" name="campaignGoal" placeholder="Enter funding goal" type="number" step="0.01" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="campaignDescription">Campaign Description</Label>
                    <Textarea id="campaignDescription" name="campaignDescription" placeholder="Describe your campaign" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="campaignImage">Campaign Image URL</Label>
                    <Input 
                      id="campaignImage" 
                      name="campaignImage" 
                      placeholder="Enter image URL" 
                      required 
                      ref={campaignImageRef}
                      onChange={() => handleImagePreview(campaignImageRef, setCampaignPreview)}
                    />
                  </div>
                  {campaignPreview && (
                    <div className="mt-2">
                      <Image src={campaignPreview} alt="Campaign Preview" width={200} height={200} className="rounded-lg" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Campaign'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleImageDownload(campaignImageRef, 'campaign-image.png')}>
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    Download Image
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gift">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Gift className="w-5 h-5 mr-2" aria-hidden="true" />Create or Send a Gift</CardTitle>
              <CardDescription>Spread joy with digital gifts.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'gift')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="giftType">Gift Type</Label>
                    <Select name="giftType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gift type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nft">NFT</SelectItem>
                        <SelectItem value="token">Token</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="giftAmount">Gift Amount</Label>
                    <Input id="giftAmount" name="giftAmount" placeholder="Enter gift amount" type="number" step="0.01" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="giftCurrency">Currency</Label>
                    <Select name="giftCurrency" defaultValue="BARK">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BARK">BARK</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input id="recipientEmail" name="recipientEmail" placeholder="Enter recipient's email" type="email" required />
                  </div>
                </div>
                <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Gift'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchant">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Store className="w-5 h-5 mr-2" aria-hidden="true" />Create Merchant Account</CardTitle>
              <CardDescription>Set up your merchant account to start selling.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'merchant')}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="merchantName">Merchant Name</Label>
                    <Input id="merchantName" name="merchantName" placeholder="Enter merchant name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="merchantEmail">Merchant Email</Label>
                    <Input id="merchantEmail" name="merchantEmail" placeholder="Enter merchant email" type="email" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="merchantDescription">Business Description</Label>
                    <Textarea id="merchantDescription" name="merchantDescription" placeholder="Describe your business" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="merchantWallet">Solana Wallet Address</Label>
                    <Input id="merchantWallet" name="merchantWallet" placeholder="Enter your Solana wallet address" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="merchantGithub">GitHub Repository (Optional)</Label>
                    <div className="flex">
                      <Input id="merchantGithub" name="merchantGithub" placeholder="Enter your GitHub repository URL" />
                      <Button type="button" variant="outline" className="ml-2">
                        <Github className="w-4 h-4 mr-2" aria-hidden="true" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <AlertTitle>Merchant Program Fee</AlertTitle>
                  <AlertDescription>
                    There is a one-time fee of 0.15 SOL to create a merchant account.
                  </AlertDescription>
                </Alert>
                <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Merchant Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}