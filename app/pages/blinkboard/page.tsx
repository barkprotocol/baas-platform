'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Plus, Search, CreditCard, Gift, Image as ImageIcon, ArrowLeft, BarChart, PieChart, Activity, Edit, Trash2, PawPrint } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Badge } from "@/components/ui/badge"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BlinkboardSidebar } from '@/components/ui/layout/blinkboard/sidebar'

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
const iconColor = "#BBA597"

type BlinkType = 'image' | 'text' | 'link'
type BlinkStatus = 'active' | 'completed' | 'expired'

interface Blink {
  id: string
  name: string
  type: BlinkType
  amount: number
  status: BlinkStatus
  createdAt: Date
}

const mockBlinks: Blink[] = [
  { id: '1', name: 'Summer Campaign', type: 'image', amount: 100, status: 'active', createdAt: new Date('2023-06-01') },
  { id: '2', name: 'Product Launch', type: 'text', amount: 50, status: 'completed', createdAt: new Date('2023-05-15') },
  { id: '3', name: 'Newsletter Signup', type: 'link', amount: 25, status: 'active', createdAt: new Date('2023-06-10') },
  { id: '4', name: 'Holiday Special', type: 'image', amount: 75, status: 'expired', createdAt: new Date('2023-04-01') },
  { id: '5', name: 'Customer Survey', type: 'link', amount: 30, status: 'active', createdAt: new Date('2023-06-05') },
]

const activityData = [
  { name: 'Week 1', blinks: 4, interactions: 120 },
  { name: 'Week 2', blinks: 6, interactions: 200 },
  { name: 'Week 3', blinks: 5, interactions: 180 },
  { name: 'Week 4', blinks: 8, interactions: 250 },
]

export default function BlinkboardBasicPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [blinks, setBlinks] = useState<Blink[]>(mockBlinks)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<BlinkType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'expired'>('all')

  useEffect(() => {
    // Simulating API call
    const timer = setTimeout(() => {
      setBlinks(mockBlinks)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredBlinks = useMemo(() => {
    return blinks
      .filter(blink => 
        blink.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === 'all' || blink.type === filterType) &&
        (activeTab === 'all' || blink.status === activeTab)
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
        } else {
          return sortOrder === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()
        }
      })
  }, [blinks, searchTerm, filterType, sortBy, sortOrder, activeTab])

  const handleCreateBlink = () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }
    // Implement Blink creation logic here
    console.log("Creating new Blink")
  }

  const handleEditBlink = (id: string) => {
    // Implement edit logic
    console.log(`Editing Blink with id: ${id}`)
  }

  const handleDeleteBlink = (id: string) => {
    // Implement delete logic
    console.log(`Deleting Blink with id: ${id}`)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-sand-50">
      <BlinkboardSidebar />
      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-4">
              <Image src={titleIconUrl} alt="BARK BLINKS icon" width={48} height={48} className="rounded-full" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-sand-900">Blinkboard</h1>
                <div className="flex items-center mt-1">
                  <Badge variant="secondary" className="bg-sand-200 text-sand-800 mr-2">Basic</Badge>
                  <PawPrint className="h-5 w-5" style={{ color: iconColor }} />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button onClick={() => router.push('/blinkboard/tiers')} variant="outline" className="flex items-center w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" style={{color: iconColor}} />
                Back to Tiers
              </Button>
              <WalletButton />
              <Button onClick={handleCreateBlink} disabled={!publicKey} className="w-full sm:w-auto bg-sand-600 hover:bg-sand-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Blink
              </Button>
            </div>
          </div>

          <Alert className="bg-sand-100 border-sand-300 text-sand-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sand-900 font-semibold">Basic Tier</AlertTitle>
            <AlertDescription>
              You are using the Basic tier of Blinkboard. Enjoy essential features for individuals and small teams.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-sand-800">Total Blinks</CardTitle>
                <BarChart className="h-5 w-5 text-sand-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-sand-900">{blinks.length}</div>
                <p className="text-sm text-sand-600">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-sand-800">Total Value</CardTitle>
                <PieChart className="h-5 w-5 text-sand-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-sand-900">
                  {blinks.reduce((sum, blink) => sum + blink.amount, 0)} SOL
                </div>
                <p className="text-sm text-sand-600">+10.5% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-sand-800">Active Blinks</CardTitle>
                <Activity className="h-5 w-5 text-sand-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-sand-900">
                  {blinks.filter(blink => blink.status === 'active').length}
                </div>
                <p className="text-sm text-sand-600">+5.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-sand-900">Blink Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis yAxisId="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="blinks" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="interactions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-sand-900">Your Blinks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sand-400" />
                    <Input
                      placeholder="Search Blinks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 bg-sand-50 border-sand-200 focus:border-sand-400 focus:ring-sand-400"
                    />
                  </div>
                  <Select value={filterType} onValueChange={(value: BlinkType | 'all') => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-sand-50 border-sand-200">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                  <Select value={sortBy} onValueChange={(value: 'name' | 'amount' | 'createdAt') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-sand-50 border-sand-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="w-full sm:w-auto bg-sand-50 border-sand-200 text-sand-800 hover:bg-sand-100">
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={(value: 'all' | 'active' | 'completed' | 'expired') => setActiveTab(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-sand-100">
                  <TabsTrigger value="all" className="data-[state=active]:bg-sand-200 data-[state=active]:text-sand-900">All</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-sand-200 data-[state=active]:text-sand-900">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-sand-200 data-[state=active]:text-sand-900">Completed</TabsTrigger>
                  <TabsTrigger value="expired" className="data-[state=active]:bg-sand-200 data-[state=active]:text-sand-900">Expired</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sand-100">
                      <TableHead className="text-sand-800">Name</TableHead>
                      <TableHead className="text-sand-800">Type</TableHead>
                      <TableHead className="text-sand-800">Amount</TableHead>
                      <TableHead className="text-sand-800">Status</TableHead>
                      <TableHead className="text-sand-800">Created At</TableHead>
                      <TableHead className="text-sand-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sand-600"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredBlinks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-sand-600">No Blinks found</TableCell>
                      </TableRow>
                    ) : (
                      filteredBlinks.map((blink) => (
                        <TableRow key={blink.id} className="hover:bg-sand-50">
                          <TableCell className="font-medium text-sand-900">{blink.name}</TableCell>
                          <TableCell>{blink.type}</TableCell>
                          <TableCell>{blink.amount} SOL</TableCell>
                          <TableCell>
                            <Badge variant={blink.status === 'active' ? 'default' : blink.status === 'completed' ? 'secondary' : 'destructive'} className="text-xs">
                              {blink.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{blink.createdAt.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => handleEditBlink(blink.id)} className="bg-sand-50 border-sand-200 hover:bg-sand-100">
                                      <Edit className="h-4 w-4 text-sand-600" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Blink</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => handleDeleteBlink(blink.id)} className="bg-sand-50 border-sand-200 hover:bg-sand-100">
                                      <Trash2 className="h-4 w-4 text-sand-600" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Blink</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}