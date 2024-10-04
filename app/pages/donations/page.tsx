'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Heart, DollarSign, AlertCircle, Copy, CheckCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock API functions (replace with actual API calls)
const submitDonation = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true, transactionId: 'mock-tx-id' }), 1000));
const fetchRecentDonations = async (page: number) => new Promise(resolve => setTimeout(() => resolve({
  donations: [
    { id: page * 5 + 1, amount: 50, currency: 'USDC', donor: 'Anonymous', date: '2024-06-01', recipient: 'Disaster Relief Fund' },
    { id: page * 5 + 2, amount: 100, currency: 'BARK', donor: 'John Doe', date: '2024-05-30', recipient: 'Support BARK Protocol' },
    { id: page * 5 + 3, amount: 25, currency: 'SOL', donor: 'Jane Smith', date: '2024-05-29', recipient: 'Education for All' },
    { id: page * 5 + 4, amount: 75, currency: 'USDC', donor: 'Anonymous', date: '2024-05-28', recipient: 'Clean Water Initiative' },
    { id: page * 5 + 5, amount: 200, currency: 'BARK', donor: 'Alice Johnson', date: '2024-05-27', recipient: 'Support BARK Protocol' },
  ],
  hasMore: page < 2
}), 1000));

// Example donation addresses (use environment variables in a real application)
const DONATION_ADDRESSES = {
  'Disaster Relief Fund': process.env.NEXT_PUBLIC_DISASTER_RELIEF_ADDRESS || 'BARK_DISASTER_RELIEF_ADDRESS',
  'Education for All': process.env.NEXT_PUBLIC_EDUCATION_ADDRESS || 'BARK_EDUCATION_ADDRESS',
  'Clean Water Initiative': process.env.NEXT_PUBLIC_CLEAN_WATER_ADDRESS || 'BARK_CLEAN_WATER_ADDRESS',
  'Support BARK Protocol': process.env.NEXT_PUBLIC_BARK_PROTOCOL_ADDRESS || 'BARK_PROTOCOL_ADDRESS',
};

// Donation goal
const DONATION_GOAL = 100000;

export default function DonationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [selectedRecipient, setSelectedRecipient] = useState('Disaster Relief Fund')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [recentDonations, setRecentDonations] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalDonations, setTotalDonations] = useState(0)
  const [isRecurring, setIsRecurring] = useState(false)

  useEffect(() => {
    loadMoreDonations()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitDonation({ 
        amount: donationAmount, 
        currency: selectedCurrency, 
        recurring: isRecurring,
        recipient: selectedRecipient
      })
      if (result.success) {
        toast({
          title: "Donation Successful",
          description: `Thank you for your ${isRecurring ? 'recurring ' : ''}donation of ${donationAmount} ${selectedCurrency} to ${selectedRecipient}. Transaction ID: ${result.transactionId}`,
        })
        setDonationAmount('')
        setSelectedCurrency('')
        setIsRecurring(false)
        setTotalDonations(prev => prev + parseFloat(donationAmount))
        loadMoreDonations(true)
      } else {
        throw new Error('Donation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToMain = () => {
    router.push('/')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(DONATION_ADDRESSES[selectedRecipient]).then(() => {
      setCopiedAddress(true)
      toast({
        title: "Address Copied",
        description: `The donation address for ${selectedRecipient} has been copied to your clipboard.`,
      })
      setTimeout(() => setCopiedAddress(false), 3000)
    })
  }

  const loadMoreDonations = async (refresh = false) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const result = await fetchRecentDonations(refresh ? 0 : currentPage)
      setRecentDonations(prev => refresh ? result.donations : [...prev, ...result.donations])
      setCurrentPage(prev => refresh ? 1 : prev + 1)
      setHasMore(result.hasMore)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recent donations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Donations</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Main
        </Button>
      </div>

      <Alert className="mb-6">
        <Heart className="h-4 w-4" style={{color: '#D0BFB4'}} />
        <AlertTitle>Support Our Causes</AlertTitle>
        <AlertDescription>
          Your donations help us make a difference in various charitable causes and support the BARK Protocol. Thank you for your generosity!
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />
              Make a Donation
            </CardTitle>
            <CardDescription>Choose your donation method, amount, and cause.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Donation Form</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="form">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Donation Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="BARK">BARK</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Donation Recipient</Label>
                    <RadioGroup defaultValue="Disaster Relief Fund" onValueChange={setSelectedRecipient}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Disaster Relief Fund" id="disaster-relief" />
                        <Label htmlFor="disaster-relief">Disaster Relief Fund</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Education for All" id="education" />
                        <Label htmlFor="education">Education for All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Clean Water Initiative" id="clean-water" />
                        <Label htmlFor="clean-water">Clean Water Initiative</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Support BARK Protocol" id="bark-protocol" />
                        <Label htmlFor="bark-protocol">Support BARK Protocol</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                    <Label htmlFor="recurring">Make this a monthly recurring donation</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Donate'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="address">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Donation Recipient</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(DONATION_ADDRESSES).map((recipient) => (
                          <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Donation Address</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={DONATION_ADDRESSES[selectedRecipient]} readOnly />
                      <Button variant="outline" size="icon" onClick={copyToClipboard}>
                        <span className="sr-only">Copy donation address</span>
                        {copiedAddress ? <CheckCircle className="h-4 w-4" style={{color: '#D0BFB4'}} /> : <Copy className="h-4 w-4" style={{color: '#D0BFB4'}} />}
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
                    <AlertDescription>
                      Send your donations directly to this address. Make sure to use the correct network for your transaction.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Label>Progress Towards Our Goal</Label>
              <Progress value={(totalDonations / DONATION_GOAL) * 100} className="w-full" />
              <p className="text-sm text-gray-500">
                ${totalDonations.toLocaleString()} raised of ${DONATION_GOAL.toLocaleString()} goal
              </p>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Thank you to our recent supporters!</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.amount}</TableCell>
                    <TableCell>{donation.currency}</TableCell>
                    <TableCell>{donation.donor}</TableCell>
                    <TableCell>{donation.recipient}</TableCell>
                    <TableCell>{donation.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => loadMoreDonations(true)}>
              <RefreshCw className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
              Refresh
            </Button>
            {hasMore && (
              <Button variant="outline" onClick={() => loadMoreDonations()} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
        <AlertTitle>Donation Information</AlertTitle>
        <AlertDescription>
          All donations are processed securely using blockchain technology. Your support helps us make a difference in various charitable causes and maintain the BARK Protocol. For large donations or special arrangements, please contact our team directly.
        </AlertDescription>
      </Alert>
    </div>
  )
}