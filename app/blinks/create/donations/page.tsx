'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Plus, Heart, Users, Leaf, AlertTriangle } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { PROGRAM_ID } from '@/lib/constants'
import { IDL } from '@/idl/bark_protocol'
import { Progress } from "@/components/ui/progress"

const DONATION_TYPES = [
  { value: 'charity', label: 'Charity' },
  { value: 'personal', label: 'Personal' },
  { value: 'project', label: 'Project' },
  { value: 'emergency', label: 'Emergency Relief' },
]

interface Donation {
  id: string
  name: string
  description: string
  amount: number
  donationType: string
  recipientAddress: string
  isRecurring: boolean
  recurringFrequency?: string
  createdAt: string
  goalAmount?: number
  currentAmount?: number
}

const FEATURED_DONATIONS: Donation[] = [
  {
    id: 'featured1',
    name: 'Save the Rainforest',
    description: 'Help us protect and restore vital rainforest ecosystems',
    amount: 1000,
    donationType: 'charity',
    recipientAddress: 'RAIN...FOREST',
    isRecurring: false,
    createdAt: '2024-05-01',
    goalAmount: 10000,
    currentAmount: 7500,
  },
  {
    id: 'featured2',
    name: 'Clean Water Initiative',
    description: 'Provide clean water to communities in need',
    amount: 500,
    donationType: 'project',
    recipientAddress: 'WATER...LIFE',
    isRecurring: true,
    recurringFrequency: 'monthly',
    createdAt: '2024-04-15',
    goalAmount: 5000,
    currentAmount: 3200,
  },
  {
    id: 'featured3',
    name: 'Education for All',
    description: 'Support education programs for underprivileged children',
    amount: 250,
    donationType: 'charity',
    recipientAddress: 'EDU...FUTURE',
    isRecurring: false,
    createdAt: '2024-05-10',
    goalAmount: 7500,
    currentAmount: 4100,
  },
]

const DISASTER_RELIEF_DONATIONS: Donation[] = [
  {
    id: 'disaster1',
    name: 'Earthquake Relief Fund',
    description: 'Urgent support needed for victims of the recent earthquake',
    amount: 500,
    donationType: 'emergency',
    recipientAddress: 'QUAKE...HELP',
    isRecurring: false,
    createdAt: '2024-06-05',
    goalAmount: 100000,
    currentAmount: 75000,
  },
  {
    id: 'disaster2',
    name: 'Hurricane Recovery Effort',
    description: 'Help rebuild communities devastated by the recent hurricane',
    amount: 1000,
    donationType: 'emergency',
    recipientAddress: 'STORM...AID',
    isRecurring: false,
    createdAt: '2024-06-10',
    goalAmount: 200000,
    currentAmount: 150000,
  },
  {
    id: 'disaster3',
    name: 'Wildfire Relief Initiative',
    description: 'Support those affected by the ongoing wildfires',
    amount: 750,
    donationType: 'emergency',
    recipientAddress: 'FIRE...HELP',
    isRecurring: false,
    createdAt: '2024-06-15',
    goalAmount: 150000,
    currentAmount: 100000,
  },
]

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newDonation, setNewDonation] = useState({
    name: '',
    description: '',
    amount: '',
    donationType: DONATION_TYPES[0].value,
    recipientAddress: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
  })

  const { publicKey, signTransaction } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would be an API call
      const mockDonations: Donation[] = [
        {
          id: '1',
          name: 'Help Local Animal Shelter',
          description: 'Support our local animal shelter with much-needed supplies',
          amount: 100,
          donationType: 'charity',
          recipientAddress: 'ABC123...XYZ',
          isRecurring: true,
          recurringFrequency: 'monthly',
          createdAt: '2024-06-01',
          goalAmount: 1000,
          currentAmount: 450,
        },
        {
          id: '2',
          name: 'Community Garden Project',
          description: 'Fund our neighborhood community garden initiative',
          amount: 50,
          donationType: 'project',
          recipientAddress: 'DEF456...UVW',
          isRecurring: false,
          createdAt: '2024-06-15',
          goalAmount: 500,
          currentAmount: 200,
        },
      ]
      setDonations([...mockDonations, ...DISASTER_RELIEF_DONATIONS])
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch donations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !signTransaction) {
      toast({
        title: "Error",
        description: "Please connect your wallet to create a donation.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const connection = new Connection('https://api.devnet.solana.com')
      const provider = new anchor.AnchorProvider(
        connection,
        { publicKey, signTransaction },
        { commitment: 'processed' }
      )
      const program = new Program(IDL, PROGRAM_ID, provider)

      const donationAccount = anchor.web3.Keypair.generate()

      const tx = await program.methods.createDonationBlink(
        newDonation.name,
        newDonation.description,
        new anchor.BN(parseFloat(newDonation.amount) * 1e9), // Convert to lamports
        newDonation.donationType,
        new PublicKey(newDonation.recipientAddress),
        newDonation.isRecurring,
        newDonation.recurringFrequency
      )
      .accounts({
        donationBlink: donationAccount.publicKey,
        user: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([donationAccount])
      .rpc()

      toast({
        title: "Success",
        description: `Donation "${newDonation.name}" created successfully!`,
      })

      // Reset form and refresh donations
      setNewDonation({
        name: '',
        description: '',
        amount: '',
        donationType: DONATION_TYPES[0].value,
        recipientAddress: '',
        isRecurring: false,
        recurringFrequency: 'monthly',
      })
      fetchDonations()
    } catch (error) {
      console.error('Error creating donation:', error)
      toast({
        title: "Error",
        description: "Failed to create donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const renderDonationCard = (donation: Donation, isEmergency: boolean = false) => (
    <Card key={donation.id} className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2 mb-1">
          {isEmergency ? (
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
          ) : donation.donationType === 'charity' ? (
            <Heart className="h-5 w-5 flex-shrink-0 text-red-500" />
          ) : donation.donationType === 'project' ? (
            <Users className="h-5 w-5 flex-shrink-0 text-blue-500" />
          ) : (
            <Leaf className="h-5 w-5 flex-shrink-0 text-green-500" />
          )}
          <CardTitle className="text-lg sm:text-xl font-bold truncate">
            {donation.name}
          </CardTitle>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {donation.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Goal:</span>
            <span>{donation.goalAmount} BARK</span>
          </div>
          <Progress value={(donation.currentAmount / donation.goalAmount) * 100} className="w-full" />
          <div className="flex justify-between items-center text-xs">
            <span>{donation.currentAmount} BARK raised</span>
            <span>{((donation.currentAmount / donation.goalAmount) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Type:</span>
            <span>{DONATION_TYPES.find(t => t.value === donation.donationType)?.label}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Recurring:</span>
            <span>{donation.isRecurring ? `Yes (${donation.recurringFrequency})` : 'No'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full space-y-2">
          <Button className="w-full" size="sm">Donate Now</Button>
          <p className="text-xs text-center text-muted-foreground">
            Created: {new Date(donation.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Button
        onClick={() => router.push('/blinks')}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blinks
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Donations</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a New Donation</DialogTitle>
              <DialogDescription>
                Set up a new donation campaign on BARK Protocol
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDonation}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDonation.name}
                    onChange={(e) => setNewDonation({ ...newDonation, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newDonation.description}
                    onChange={(e) => setNewDonation({ ...newDonation, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000000001"
                    min="0"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="donationType" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newDonation.donationType}
                    onValueChange={(value) => setNewDonation({ ...newDonation, donationType: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select donation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DONATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientAddress" className="text-right">
                    Recipient
                  </Label>
                  <Input
                    id="recipientAddress"
                    value={newDonation.recipientAddress}
                    onChange={(e) => setNewDonation({ ...newDonation, recipientAddress: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isRecurring" className="text-right">
                    Recurring
                  </Label>
                  <Switch
                    id="isRecurring"
                    checked={newDonation.isRecurring}
                    onCheckedChange={(checked) => setNewDonation({ ...newDonation, isRecurring: checked })}
                  />
                </div>
                {newDonation.isRecurring && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recurringFrequency" className="text-right">
                      Frequency
                    </Label>
                    <Select
                      value={newDonation.recurringFrequency}
                      onValueChange={(value) => setNewDonation({ ...newDonation, recurringFrequency: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Donation'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Disaster Relief Donations</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DISASTER_RELIEF_DONATIONS.map((donation) => renderDonationCard(donation, true))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Donations</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_DONATIONS.map((donation) => renderDonationCard(donation))}
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="active">Active Donations</TabsTrigger>
          <TabsTrigger value="completed">Completed Donations</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : donations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation) => renderDonationCard(donation))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Donations Found</CardTitle>
                <CardDescription>Start by creating your first donation campaign.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>No Completed Donations</CardTitle>
              <CardDescription>Completed donations will appear here.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}