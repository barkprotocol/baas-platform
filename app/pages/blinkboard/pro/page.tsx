'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CreditCard, Gift, PlusCircle, BarChart2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from 'lucide-react'
import { DashboardOverview } from "@/components/ui/layout/blinkboard/overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock API calls
const makePayment = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const mintNFT = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const sendGift = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

// Mock data for the chart
const chartData = [
  { name: 'Jan', payments: 400, nfts: 240, gifts: 240 },
  { name: 'Feb', payments: 300, nfts: 139, gifts: 221 },
  { name: 'Mar', payments: 200, nfts: 980, gifts: 229 },
  { name: 'Apr', payments: 278, nfts: 390, gifts: 200 },
  { name: 'May', payments: 189, nfts: 480, gifts: 218 },
  { name: 'Jun', payments: 239, nfts: 380, gifts: 250 },
  { name: 'Jul', payments: 349, nfts: 430, gifts: 210 },
];

export default function ProPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      let result;
      switch (action) {
        case 'payment':
          result = await makePayment(data)
          break
        case 'nft':
          result = await mintNFT(data)
          break
        case 'gift':
          result = await sendGift(data)
          break
        default:
          throw new Error('Invalid action')
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`,
        })
        e.currentTarget.reset()
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

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Pro Features</h1>
        <Button onClick={() => router.push('/blinkboard')} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to Blinkboard
        </Button>
      </div>

      <Alert className="mb-6">
        <CreditCard className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Pro Tier Features</AlertTitle>
        <AlertDescription>
          Access advanced features like payments, NFT minting, and gifting.
        </AlertDescription>
      </Alert>

      <DashboardOverview
        totalTransactions={5678}
        totalVolume={98765}
        activeUsers={4321}
        blinksCreated={543}
      />

      <div className="mt-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="gifts">Gifts</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your activity history for the past 7 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="payments" fill="#8884d8" />
                    <Bar dataKey="nfts" fill="#82ca9d" />
                    <Bar dataKey="gifts" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" aria-hidden="true" />
                  Make a Payment
                </CardTitle>
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
                      <Select name="paymentMethod" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usdc">USDC</SelectItem>
                          <SelectItem value="bark">BARK</SelectItem>
                          <SelectItem value="sol">SOL</SelectItem>
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
          <TabsContent value="nfts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                  Mint an NFT
                </CardTitle>
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
                      <Input id="nftImage" name="nftImage" placeholder="Enter image URL" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="nftSoldable" name="nftSoldable" />
                      <Label htmlFor="nftSoldable">List for sale immediately</Label>
                    </div>
                  </div>
                  <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      'Mint NFT'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gifts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" aria-hidden="true" />
                  Send a Gift
                </CardTitle>
                <CardDescription>Spread joy with digital gifts.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'gift')}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="giftType">Gift Type</Label>
                      <Input id="giftType" name="giftType" placeholder="Enter gift type" required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="giftAmount">Gift Amount</Label>
                      <Input id="giftAmount" name="giftAmount" placeholder="Enter gift amount" type="number" step="0.01" required />
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
        </Tabs>
      </div>
    </div>
  )
}