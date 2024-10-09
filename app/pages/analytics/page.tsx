'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, TrendingUp, Users, Activity, DollarSign, Download } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type TokenHolder = {
  address: string
  balance: number
  percentage: number
  barkBalance: number
  usdcBalance: number
}

type User = {
  id: number
  username: string
  email: string
  joinDate: string
  solanaAddress: string
}

type Account = {
  id: number
  userId: number
  solBalance: number
  barkBalance: number
  usdcBalance: number
  lastTransaction: string
}

type TokenMetrics = {
  barkTotalSupply: number
  barkCirculatingSupply: number
  barkPrice: number
  barkMarketCap: number
  barkVolume24h: number
}

type AnalyticsData = {
  tokenHolders: TokenHolder[]
  users: User[]
  accounts: Account[]
  tokenMetrics: TokenMetrics
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Component() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/analytics')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data: AnalyticsData = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/v1/analytics/export-csv')
      if (!response.ok) {
        throw new Error('Failed to generate CSV')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'bark_protocol_analytics.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "CSV file has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!analyticsData) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load analytics data. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">BARK Protocol Analytics</h1>
        <div className="flex gap-4">
          <Button onClick={fetchAnalyticsData} variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Supply
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.tokenMetrics.barkTotalSupply.toLocaleString()} BARK</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Circulating Supply
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.tokenMetrics.barkCirculatingSupply.toLocaleString()} BARK</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              BARK Price
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.tokenMetrics.barkPrice.toFixed(4)} USDC</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Cap
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.tokenMetrics.barkMarketCap.toLocaleString()} USDC</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="holders">Top Holders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>
        <TabsContent value="holders">
          <Card>
            <CardHeader>
              <CardTitle>Top BARK Holders</CardTitle>
              <CardDescription>Addresses holding the largest amounts of BARK tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Address</th>
                      <th className="text-right p-2">SOL Balance</th>
                      <th className="text-right p-2">BARK Balance</th>
                      <th className="text-right p-2">USDC Balance</th>
                      <th className="text-right p-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.tokenHolders.map((holder, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{holder.address}</td>
                        <td className="text-right p-2">{holder.balance.toLocaleString()} SOL</td>
                        <td className="text-right p-2">{holder.barkBalance.toLocaleString()} BARK</td>
                        <td className="text-right p-2">{holder.usdcBalance.toLocaleString()} USDC</td>
                        <td className="text-right p-2">{holder.percentage.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>BARK Users</CardTitle>
              <CardDescription>Registered users of the BARK protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Username</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Join Date</th>
                      <th className="text-left p-2">Solana Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.users.map((user, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{user.id}</td>
                        <td className="p-2">{user.username}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.joinDate}</td>
                        <td className="p-2">{user.solanaAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>BARK Accounts</CardTitle>
              <CardDescription>Account balances and transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">User ID</th>
                      <th className="text-right p-2">SOL Balance</th>
                      <th className="text-right p-2">BARK Balance</th>
                      <th className="text-right p-2">USDC Balance</th>
                      <th className="text-left p-2">Last Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.accounts.map((account, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{account.id}</td>
                        <td className="p-2">{account.userId}</td>
                        <td className="text-right p-2">{account.solBalance.toFixed(2)} SOL</td>
                        <td className="text-right p-2">{account.barkBalance.toLocaleString()} BARK</td>
                        <td className="text-right p-2">{account.usdcBalance.toLocaleString()} USDC</td>
                        <td className="p-2">{account.lastTransaction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}