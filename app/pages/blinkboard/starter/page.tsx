'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Zap, Coins, BarChart2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'
import { DashboardOverview } from "@/components/ui/layout/blinkboard/overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock API calls
const createBlink = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const processDonation = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

// Mock data for the chart
const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 349 },
];

export default function StarterPage() {
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
      if (action === 'blink') {
        result = await createBlink(data)
      } else if (action === 'donation') {
        result = await processDonation(data)
      } else {
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">Starter Features</h1>
        <Button onClick={() => router.push('/blinkboard')} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to Blinkboard
        </Button>
      </div>

      <Alert className="mb-6">
        <Zap className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Starter Tier Features</AlertTitle>
        <AlertDescription>
          Create Blinks, process basic donations, and view your dashboard with BARK Protocol.
        </AlertDescription>
      </Alert>

      <DashboardOverview
        totalTransactions={1234}
        totalVolume={5678}
        activeUsers={910}
        blinksCreated={111}
      />

      <div className="mt-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blinks">Blinks</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
                <CardDescription>Your transaction history for the past 7 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="blinks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
                  Create a New Blink
                </CardTitle>
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
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2" aria-hidden="true" />
                  Process Donations
                </CardTitle>
                <CardDescription>Receive donations for your cause.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'donation')}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="donationAmount">Donation Amount</Label>
                      <Input id="donationAmount" name="donationAmount" placeholder="Enter donation amount" type="number" step="0.01" required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="donorName">Donor Name</Label>
                      <Input id="donorName" name="donorName" placeholder="Enter donor's name" required />
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
        </Tabs>
      </div>
    </div>
  )
}