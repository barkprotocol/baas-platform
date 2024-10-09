'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { WalletButton } from "@/components/ui/wallet-button"
import { Gift, ImageIcon, Coins, DollarSign, Plus, Search, ArrowUpDown, Loader2, RefreshCcw } from 'lucide-react'
import CreateBlinkCard from '@/components/blink/create-blink-card'

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

interface Blink {
  id: string
  type: 'gift' | 'nft' | 'donation' | 'payment'
  name: string
  amount: number
  currency: string
  createdAt: string
  status: 'active' | 'completed' | 'expired'
}

const blinkTypes = {
  gift: { icon: Gift, name: 'Gift Blink' },
  donation: { icon: Coins, name: 'Donation Blink' },
  payment: { icon: DollarSign, name: 'Payment Blink' },
  nft: { icon: ImageIcon, name: 'NFT Blink' },
}

export default function BlinksPage() {
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Blink>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState('all')
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const fetchBlinks = async () => {
    if (!publicKey) return
    
    setIsLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockBlinks: Blink[] = [
        { id: '1', type: 'gift', name: 'Birthday Gift', amount: 50, currency: 'SOL', createdAt: '2024-06-01', status: 'active' },
        { id: '2', type: 'nft', name: 'BARK NFT', amount: 1, currency: 'SOL', createdAt: '2024-09-02', status: 'completed' },
        { id: '3', type: 'donation', name: 'Charity Fund', amount: 100, currency: 'USDC', createdAt: '2024-08-03', status: 'active' },
        { id: '4', type: 'payment', name: 'Freelance Work', amount: 200, currency: 'USDC', createdAt: '2024-08-04', status: 'completed' },
        { id: '5', type: 'gift', name: 'Wedding Gift', amount: 75, currency: 'SOL', createdAt: '2024-07-05', status: 'active' },
      ]
      setBlinks(mockBlinks)
    } catch (error) {
      console.error('Error fetching blinks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch BARK Blinks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlinks()
  }, [publicKey])

  const filteredAndSortedBlinks = useMemo(() => {
    return blinks
      .filter(blink => 
        (activeTab === 'all' || blink.type === activeTab) &&
        (blink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         blink.amount.toString().includes(searchTerm) ||
         blink.currency.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [blinks, activeTab, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof Blink) => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc')
    setSortField(field)
  }

  const getBlinkTypeIcon = (type: Blink['type']) => {
    switch (type) {
      case 'gift': return <Gift className="h-4 w-4" />
      case 'nft': return <ImageIcon className="h-4 w-4" />
      case 'donation': return <Coins className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 sm:mb-0 flex items-center">
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Your Blinks
        </h1>
        <WalletButton />
      </header>

      <main>
        {!publicKey ? (
          <Alert className="mb-6">
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to view and create Blinks.
            </AlertDescription>
          </Alert>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CreateBlinkCard className="mb-8" />

            <Card>
              <CardHeader>
                <CardTitle>Generate Blinks</CardTitle>
                <CardDescription>Generate, manage and view all your created Blinks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search Blinks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                    <Select value={activeTab} onValueChange={setActiveTab}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="gift">Gifts</SelectItem>
                        <SelectItem value="nft">NFTs</SelectItem>
                        <SelectItem value="donation">Donations</SelectItem>
                        <SelectItem value="payment">Payments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={fetchBlinks} variant="outline" className="w-full sm:w-auto">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : filteredAndSortedBlinks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('name')}>
                            Name <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('amount')}>
                            Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                            Created At <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredAndSortedBlinks.map((blink) => (
                          <motion.tr
                            key={blink.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TableCell>{getBlinkTypeIcon(blink.type)}</TableCell>
                            <TableCell>{blink.name}</TableCell>
                            <TableCell>{blink.amount} {blink.currency}</TableCell>
                            <TableCell>{new Date(blink.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                blink.status === 'active' ? 'bg-green-100 text-green-800' :
                                blink.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {blink.status}
                              </span>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg font-semibold mb-2">No Blinks found</p>
                    <p className="text-gray-500 mb-4">Create your first Blink to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}