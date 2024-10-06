'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Plus, Search, CreditCard, Gift, Image as ImageIcon } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
const iconColor = "#D0BFB4"

type BlinkType = 'payment' | 'gift' | 'nft'

interface Blink {
  id: string
  name: string
  type: BlinkType
  amount: number
  currency: string
  status: 'active' | 'expired' | 'completed'
  createdAt: string
}

const mockBlinks: Blink[] = [
  { id: '1', name: 'Coffee Payment', type: 'payment', amount: 5, currency: 'SOL', status: 'active', createdAt: '2023-06-01' },
  { id: '2', name: 'Birthday Gift', type: 'gift', amount: 50, currency: 'USDC', status: 'completed', createdAt: '2023-05-15' },
  { id: '3', name: 'Art Collection', type: 'nft', amount: 1, currency: 'SOL', status: 'active', createdAt: '2023-06-10' },
  { id: '4', name: 'Rent Payment', type: 'payment', amount: 1000, currency: 'USDC', status: 'active', createdAt: '2023-06-05' },
  { id: '5', name: 'Graduation Gift', type: 'gift', amount: 100, currency: 'SOL', status: 'expired', createdAt: '2023-04-20' },
]

export default function BlinksPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<BlinkType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchBlinks = async () => {
      setIsLoading(true)
      try {
        // In a real application, you would fetch data from an API here
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API delay
        setBlinks(mockBlinks)
      } catch (error) {
        console.error('Error fetching blinks:', error)
        toast({
          title: "Error",
          description: "Failed to load blinks. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlinks()
  }, [toast])

  const filteredAndSortedBlinks = useMemo(() => {
    return blinks
      .filter(blink => 
        (filterType === 'all' || blink.type === filterType) &&
        (blink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         blink.id.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
        } else if (sortBy === 'createdAt') {
          return sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        }
      })
  }, [blinks, filterType, searchTerm, sortBy, sortOrder])

  const handleCreateBlink = () => router.push('/blinks/create')

  const getBlinkTypeIcon = (type: BlinkType) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4" style={{ color: iconColor }} />
      case 'gift':
        return <Gift className="h-4 w-4" style={{ color: iconColor }} />
      case 'nft':
        return <ImageIcon className="h-4 w-4" style={{ color: iconColor }} />
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Your BLINKs
        </h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button onClick={handleCreateBlink} disabled={!publicKey}>
            <Plus className="mr-2 h-4 w-4" />
            Create Blink
          </Button>
        </div>
      </div>

      {!publicKey && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view and manage your Blinks.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Blinks</CardTitle>
          <CardDescription>View and manage all your created Blinks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Blinks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as BlinkType | 'all')}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'amount' | 'createdAt')}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="createdAt">Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                aria-label={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading your Blinks...</div>
          ) : filteredAndSortedBlinks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedBlinks.map((blink) => (
                  <TableRow key={blink.id}>
                    <TableCell className="font-medium">{blink.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getBlinkTypeIcon(blink.type)}
                        <span className="ml-2 capitalize">{blink.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{blink.amount} {blink.currency}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${blink.status === 'active' ? 'bg-green-100 text-green-800' :
                          blink.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {blink.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(blink.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">No Blinks found. Create your first Blink!</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}