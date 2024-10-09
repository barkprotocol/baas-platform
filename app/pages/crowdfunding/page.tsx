'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, AlertCircle, Users, Rocket, Search, ChevronLeft, ChevronRight, Copy, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'

// Mock Solana connection (replace with actual connection in production)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

// Define the Campaign type
interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  image: string;
  programId: string;
  escrowAddress: string;
}

// Mock API functions (replace with actual API calls)
const fetchCampaigns = async (): Promise<Campaign[]> => new Promise(resolve => setTimeout(() => resolve([
  { id: 1, title: 'Community Garden Project', description: 'Help us create a sustainable community garden', goal: 10000, raised: 7500, backers: 150, daysLeft: 15, image: '/placeholder.svg?height=200&width=400', programId: 'Program1111111111111111111111111111111111111', escrowAddress: 'Escrow11111111111111111111111111111111111111' },
  { id: 2, title: 'Tech Education for Kids', description: 'Provide coding classes for underprivileged children', goal: 15000, raised: 9000, backers: 200, daysLeft: 20, image: '/placeholder.svg?height=200&width=400', programId: 'Program2222222222222222222222222222222222222', escrowAddress: 'Escrow22222222222222222222222222222222222222' },
  { id: 3, title: 'Clean Energy Initiative', description: 'Fund solar panel installations in rural areas', goal: 25000, raised: 18000, backers: 300, daysLeft: 10, image: '/placeholder.svg?height=200&width=400', programId: 'Program3333333333333333333333333333333333333', escrowAddress: 'Escrow33333333333333333333333333333333333333' },
  { id: 4, title: 'Art Therapy Program', description: 'Support mental health through art therapy sessions', goal: 8000, raised: 6000, backers: 120, daysLeft: 5, image: '/placeholder.svg?height=200&width=400', programId: 'Program4444444444444444444444444444444444444', escrowAddress: 'Escrow44444444444444444444444444444444444444' },
  { id: 5, title: 'Wildlife Conservation Project', description: 'Protect endangered species in their natural habitats', goal: 20000, raised: 12000, backers: 250, daysLeft: 25, image: '/placeholder.svg?height=200&width=400', programId: 'Program5555555555555555555555555555555555555', escrowAddress: 'Escrow55555555555555555555555555555555555555' },
  { id: 6, title: 'Urban Farming Initiative', description: 'Transform vacant lots into productive urban farms', goal: 12000, raised: 8000, backers: 180, daysLeft: 12, image: '/placeholder.svg?height=200&width=400', programId: 'Program6666666666666666666666666666666666666', escrowAddress: 'Escrow66666666666666666666666666666666666666' },
  { id: 7, title: 'Youth Sports Program', description: 'Provide sports equipment and coaching for underprivileged youth', goal: 18000, raised: 10000, backers: 220, daysLeft: 18, image: '/placeholder.svg?height=200&width=400', programId: 'Program7777777777777777777777777777777777777', escrowAddress: 'Escrow77777777777777777777777777777777777777' },
  { id: 8, title: 'Elderly Care Technology', description: 'Develop smart home technology for senior citizens', goal: 30000, raised: 22000, backers: 400, daysLeft: 8, image: '/placeholder.svg?height=200&width=400', programId: 'Program8888888888888888888888888888888888888', escrowAddress: 'Escrow88888888888888888888888888888888888888' },
]), 1000));

export default function CrowdfundingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const wallet = useWallet()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showProgramDetails, setShowProgramDetails] = useState<{ [key: number]: boolean }>({})
  const campaignsPerPage = 4

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setIsLoading(true)
    try {
      const data = await fetchCampaigns()
      setCampaigns(data)
      setShowProgramDetails(data.reduce((acc: { [key: number]: boolean }, campaign) => {
        acc[campaign.id] = false;
        return acc;
      }, {}))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContribute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCampaign || !wallet.publicKey) return

    setIsSubmitting(true)
    try {
      const amount = parseFloat(contributionAmount)
      const lamports = amount * LAMPORTS_PER_SOL

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(selectedCampaign.escrowAddress),
          lamports,
        })
      )

      const signature = await wallet.sendTransaction(transaction, connection)
      const result = await connection.confirmTransaction(signature, 'confirmed')

      if (result.value.err === null) {
        toast({
          title: "Contribution Successful",
          description: `Thank you for your contribution of ${contributionAmount} SOL to ${selectedCampaign.title}. Transaction ID: ${signature}`,
        })
        setContributionAmount('')
        setSelectedCampaign(null)
        loadCampaigns()
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your contribution. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToMain = () => {
    router.push('/')
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCampaign = currentPage * campaignsPerPage
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign)

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage)

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Address Copied",
        description: "The address has been copied to your clipboard.",
      })
    })
  }

  const toggleProgramDetails = (campaignId: number) => {
    setShowProgramDetails(prev => ({
      ...prev,
      [campaignId]: !prev[campaignId]
    }))
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Crowdfunding Campaigns</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" /> Back to Main
        </Button>
      </div>

      <Alert className="mb-6">
        <Rocket className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
        <AlertTitle>Support Innovative Projects</AlertTitle>
        <AlertDescription>
          Browse and contribute to exciting crowdfunding campaigns. Your support can make a difference!
        </AlertDescription>
      </Alert>

      <div className="mb-6">
        <Label htmlFor="search">Search Campaigns</Label>
        <div className="flex items-center">
          <Input
            id="search"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button onClick={loadCampaigns} variant="outline">
            <Search className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading campaigns...</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {currentCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={(campaign.raised / campaign.goal) * 100} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>${campaign.goal.toLocaleString()} goal</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span><Users className="inline mr-1 h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />{campaign.backers} backers</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleProgramDetails(campaign.id)}
                      className="w-full mt-2"
                    >
                      {showProgramDetails[campaign.id] ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" style={{color: '#D0BFB4'}} aria-hidden="true" />
                          Hide Program Details
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" style={{color: '#D0BFB4'}} aria-hidden="true" />
                          Show Program Details
                        </>
                      )}
                    </Button>
                    {showProgramDetails[campaign.id] && (
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-semibold">Program ID: </span>
                          <span className="truncate">{campaign.programId}</span>
                          <Button variant="ghost" size="sm" className="ml-2" onClick={() => copyToClipboard(campaign.programId)}>
                            <Copy className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
                          </Button>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Escrow Address: </span>
                          <span className="truncate">{campaign.escrowAddress}</span>
                          <Button variant="ghost" size="sm" className="ml-2" onClick={() => copyToClipboard(campaign.escrowAddress)}>
                            <Copy className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedCampaign(campaign)}>Contribute</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contribute to {selectedCampaign?.title}</DialogTitle>
                        <DialogDescription>
                          Your contribution helps bring this project to life. Thank you for your support!
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleContribute}>
                        <div className="grid gap-4  py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Amount (SOL)</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={contributionAmount}
                              onChange={(e) => setContributionAmount(e.target.value)}
                              className="col-span-3"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting || !wallet.connected}>
                            {isSubmitting ? 'Processing...' : (wallet.connected ? 'Contribute' : 'Connect Wallet to Contribute')}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Button onClick={prevPage} disabled={currentPage === 1} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button onClick={nextPage} disabled={currentPage === totalPages} variant="outline">
              Next
              <ChevronRight className="ml-2 h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
            </Button>
          </div>
        </>
      )}

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
        <AlertTitle>Crowdfunding Information</AlertTitle>
        <AlertDescription>
          All contributions are processed securely using Solana blockchain technology. Each campaign has its own Solana program and escrow address. Funds are only released to project creators when funding goals are met. For large contributions or special arrangements, please contact our team directly.
        </AlertDescription>
      </Alert>
    </div>
  )
}