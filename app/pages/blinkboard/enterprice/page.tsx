'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Landmark, Store, BarChart2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'
import { DashboardOverview } from "@/components/ui/layout/blinkboard/overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock API calls
const startCrowdfunding = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const createMerchant = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

// Mock data for the chart
const chartData = [
  { name: 'Jan', crowdfunding: 4000, merchants: 2400 },
  { name: 'Feb', crowdfunding: 3000, merchants: 1398 },
  { name: 'Mar', crowdfunding: 2000, merchants: 9800 },
  { name: 'Apr', crowdfunding: 2780, merchants: 3908 },
  { name: 'May', crowdfunding: 1890, merchants: 4800 },
  { name: 'Jun', crowdfunding: 2390, merchants: 3800 },
  { name: 'Jul', crowdfunding: 3490, merchants: 4300 },
];

export default function EnterprisePage() {
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
        case 'crowdfunding':
          result = await startCrowdfunding(data)
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Enterprise Features</h1>
        <Button onClick={() => router.push('/blinkboard')} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to Blinkboard
        </Button>
      </div>

      <Alert className="mb-6">
        <Landmark className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Enterprise Tier Features</AlertTitle>
        <AlertDescription>
          Access advanced features like crowdfunding campaigns and merchant account creation.
        </AlertDescription>
      </Alert>

      <DashboardOverview
        totalTransactions={98765}
        totalVolume={1234567}
        activeUsers={87654}
        blinksCreated={9876}
      />

      <div className="mt-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
            <TabsTrigger value="merchant">Merchant</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Activity Overview</CardTitle>
                <CardDescription>Your enterprise activity for the past 7 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="crowdfunding" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="merchants" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="crowdfunding">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Landmark className="w-5 h-5 mr-2" aria-hidden="true" />
                  Start a Crowdfunding Campaign
                </CardTitle>
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
                  </div>
                  <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Campaign'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="merchant">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="w-5 h-5 mr-2" aria-hidden="true" />
                  Create Merchant Account
                </CardTitle>
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
                  </div>
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
      </div>
    </div>
  )
}