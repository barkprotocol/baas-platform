'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createQR, encodeURL, TransferRequestURLFields, findReference, validateTransfer, FindReferenceError, ValidateTransferError } from "@solana/pay"
import { PublicKey, Keypair } from "@solana/web3.js"
import { useConnection } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Heart, DollarSign, AlertCircle, Copy, CheckCircle, RefreshCw, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
const DONATION_ADDRESSES: Record<string, string> = {
  'Disaster Relief Fund': process.env.NEXT_PUBLIC_DISASTER_RELIEF_ADDRESS || 'BARK_DISASTER_RELIEF_ADDRESS',
  'Education for All': process.env.NEXT_PUBLIC_EDUCATION_ADDRESS || 'BARK_EDUCATION_ADDRESS',
  'Clean Water Initiative': process.env.NEXT_PUBLIC_CLEAN_WATER_ADDRESS || 'BARK_CLEAN_WATER_ADDRESS',
  'Support BARK Protocol': process.env.NEXT_PUBLIC_BARK_PROTOCOL_ADDRESS || 'BARK_PROTOCOL_ADDRESS',
};

// Donation goal
const DONATION_GOAL = 100000;

// Currency icons
const CURRENCY_ICONS: Record<string, string> = {
  BARK: '/assets/icons/bark.png',
  SOL: '/assets/icons/sol.png',
  USDC: '/assets/icons/usdc.png',
};

interface Donation {
  id: number;
  amount: number;
  currency: string;
  donor: string;
  date: string;
  recipient: string;
}

export default function DonationsPage() {
  const router = useRouter()
  const { connection } = useConnection()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [selectedRecipient, setSelectedRecipient] = useState('Disaster Relief Fund')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [recentDonations, setRecentDonations] = useState<Donation[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalDonations, setTotalDonations] = useState(0)
  const [isRecurring, setIsRecurring] = useState(false)
  const [anonymousDonation, setAnonymousDonation] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)

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
        recipient: selectedRecipient,
        anonymous: anonymousDonation
      })
      if (result.success) {
        toast({
          title: "Donation Successful",
          description: `Thank you for your ${isRecurring ? 'recurring ' : ''}donation of ${donationAmount} ${selectedCurrency} to ${selectedRecipient}. Transaction ID: ${result.transactionId}`,
        })
        setDonationAmount('')
        setSelectedCurrency('')
        setIsRecurring(false)
        setAnonymousDonation(false)
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

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(DONATION_ADDRESSES[selectedRecipient]).then(() => {
      setCopiedAddress(true)
      toast({
        title: "Address Copied",
        description: `The donation address for ${selectedRecipient} has been copied to your clipboard.`,
      })
      setTimeout(() => setCopiedAddress(false), 3000)
    })
  }, [selectedRecipient, toast])

  const loadMoreDonations = useCallback(async (refresh = false) => {
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
  }, [currentPage, isLoading, toast])

  const generateQrCode = useCallback(async () => {
    if (!selectedRecipient || !donationAmount) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter an amount.",
        variant: "destructive",
      })
      return
    }

    const recipientAddress = new PublicKey(DONATION_ADDRESSES[selectedRecipient])
    const amount = Number(donationAmount)
    const reference = new Keypair().publicKey
    const label = `Donation to ${selectedRecipient}`
    const message = `Thank you for your donation of ${amount} SOL to ${selectedRecipient}`

    const urlParams: TransferRequestURLFields = {
      recipient: recipientAddress,
      amount,
      splToken: undefined,
      reference,
      label,
      message,
    }

    const url = encodeURL(urlParams)
    const qr = createQR(url)
    const qrCodeDataUrl = await qr.getRawData('svg')
    setQrCode(qrCodeDataUrl as string)

    // Start checking for transaction
    checkForTransaction(reference, amount, recipientAddress)
  }, [selectedRecipient, donationAmount, toast])

  const checkForTransaction = useCallback(async (reference: PublicKey, amount: number, recipient: PublicKey) => {
    try {
      const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient,
          amount,
          splToken: undefined,
          reference,
        },
        { commitment: 'confirmed' }
      )
      toast({
        title: "Donation Successful",
        description: `Thank you for your donation of ${amount} SOL. Transaction signature: ${signatureInfo.signature}`,
      })
      setQrCode(null)
      loadMoreDonations(true)
    } catch (error) {
      if (error instanceof FindReferenceError) {
        // No transaction found yet, try again
        setTimeout(() => checkForTransaction(reference, amount, recipient), 5000)
      } else if (error instanceof ValidateTransferError) {
        toast({
          title: "Error",
          description: "Transfer could not be validated. Please try again.",
          variant: "destructive",
        })
      } else {
        console.error(error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [connection, toast, loadMoreDonations])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Donations</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" /> Back to Main
        </Button>
      </div>

      <Alert className="mb-6">
        <Heart className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
        <AlertTitle>Support Our Causes</AlertTitle>
        <AlertDescription>
          Your donations help us make a difference in various charitable causes and support the BARK Protocol. Thank you for your generosity!
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} aria-hidden="true" />
              Make a Donation
            </CardTitle>
            <CardDescription>Choose your donation method, amount, and cause.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="form">Donation Form</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
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
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CURRENCY_ICONS).map(([currency, iconPath]) => (
                          <SelectItem key={currency} value={currency}>
                            <div className="flex items-center">
                              <Image src={iconPath} alt={`${currency} icon`} width={24} height={24} className="mr-2" />
                              {currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Donation Recipient</Label>
                    <RadioGroup defaultValue="Disaster Relief Fund" onValueChange={setSelectedRecipient}>
                      {Object.keys(DONATION_ADDRESSES).map((recipient) => (
                        <div key={recipient} className="flex items-center space-x-2">
                          <RadioGroupItem value={recipient} id={recipient.toLowerCase().replace(/\s+/g, '-')} />
                          <Label htmlFor={recipient.toLowerCase().replace(/\s+/g, '-')}>{recipient}</Label>
                        </div>
                      ))}
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymous"
                      checked={anonymousDonation}
                      onCheckedChange={setAnonymousDonation}
                    />
                    <Label htmlFor="anonymous">Make this an anonymous donation</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' :  'Donate'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="address">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-select">Select Donation Recipient</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                      <SelectTrigger id="recipient-select">
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
                    <Label htmlFor="donation-address">Donation Address</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="donation-address" value={DONATION_ADDRESSES[selectedRecipient]} readOnly />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy donation address">
                              {copiedAddress ? <CheckCircle className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" /> : <Copy className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copiedAddress ? 'Copied!' : 'Copy address'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
                    <AlertDescription>
                      Send your donations directly to this address. Make sure to use the correct network for your transaction.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              <TabsContent value="qr">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-amount">Donation Amount (SOL)</Label>
                    <Input
                      id="qr-amount"
                      type="number"
                      placeholder="Enter amount in SOL"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qr-recipient">Select Donation Recipient</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                      <SelectTrigger id="qr-recipient">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(DONATION_ADDRESSES).map((recipient) => (
                          <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateQrCode} className="w-full">Generate QR Code</Button>
                  {qrCode && (
                    <div className="mt-4">
                      <Image src={qrCode} alt="Donation QR Code" width={200} height={200} />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Label htmlFor="donation-progress">Progress Towards Our Goal</Label>
              <Progress id="donation-progress" value={(totalDonations / DONATION_GOAL) * 100} className="w-full" />
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
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Donor</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image src={CURRENCY_ICONS[donation.currency]} alt={`${donation.currency} icon`} width={24} height={24} className="mr-2" />
                        {donation.currency}
                      </div>
                    </TableCell>
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
              <RefreshCw className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
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
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} aria-hidden="true" />
        <AlertTitle>Donation Information</AlertTitle>
        <AlertDescription>
          All donations are processed securely using blockchain technology. Your support helps us make a difference in various charitable causes and maintain the BARK Protocol. For large donations or special arrangements, please contact our team directly.
        </AlertDescription>
      </Alert>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} aria-hidden="true" />
            Donation FAQ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How are my donations used?</h3>
              <p>Your donations directly support our various charitable initiatives and the maintenance of the BARK Protocol.</p>
            </div>
            <div>
              <h3 className="font-semibold">Are my donations tax-deductible?</h3>
              <p>Please consult with a tax professional regarding the tax-deductibility of your donations.</p>
            </div>
            <div>
              <h3 className="font-semibold">Can I cancel a recurring donation?</h3>
              <p>Yes, you can cancel a recurring donation at any time by contacting our support team.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}