import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Zap, Coins, CreditCard, ArrowLeft, Plus, Send, Share2, Filter } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Blink {
  id: string;
  name: string;
  type: string;
  amount: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: 'donation' | 'payment' | 'blink';
  amount: number;
  date: string;
  recipient?: string;
  message?: string;
}

// Mock API functions (replace with actual API calls)
const fetchBlinks = async (): Promise<Blink[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', name: 'Personal Blink', type: 'personal', amount: 50, createdAt: '2023-06-01' },
    { id: '2', name: 'Business Blink', type: 'business', amount: 100, createdAt: '2023-06-02' },
    { id: '3', name: 'Charity Blink', type: 'charity', amount: 75, createdAt: '2023-06-03' },
  ];
};

const fetchTransactions = async (): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', type: 'donation', amount: 25, date: '2023-06-01' },
    { id: '2', type: 'payment', amount: 75, date: '2023-06-02' },
    { id: '3', type: 'blink', amount: 50, date: '2023-06-03', recipient: 'Alice', message: 'Thanks for lunch!' },
    { id: '4', type: 'blink', amount: 100, date: '2023-06-04', recipient: 'Bob', message: 'Happy birthday!' },
  ];
};

// Mock function to share on social media (replace with actual social media API integrations)
const shareOnSocialMedia = async (platform: 'twitter' | 'facebook', message: string): Promise<void> => {
  console.log(`Sharing on ${platform}: ${message}`);
  // In a real implementation, this would use the respective social media API to post the message
};

export default function BlinkboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('blinks')
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [blinksData, transactionsData] = await Promise.all([
          fetchBlinks(),
          fetchTransactions()
        ]);
        setBlinks(blinksData);
        setTransactions(transactionsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleBackToMain = () => {
    router.push('/blinks')
  }

  const handleSendBlink = () => {
    router.push('/blinks/send')
  }

  const handleShareBlink = async (transaction: Transaction) => {
    const shareMessage = `I just sent a Blink of ${transaction.amount} BARK to ${transaction.recipient}! ${transaction.message ? `Message: ${transaction.message}` : ''} #BARKBaaS`;
    
    if (window.confirm('Would you like to share this Blink on Twitter?')) {
      await shareOnSocialMedia('twitter', shareMessage);
      toast({
        title: "Shared",
        description: "Your Blink has been shared on Twitter!",
      });
    }
  }

  const filteredBlinks = blinks.filter(blink => 
    blink.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || blink.type === filterType)
  );

  const filteredTransactions = transactions.filter(transaction =>
    (transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     transaction.message?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || transaction.type === filterType)
  );

  return (
    <>
      <Head>
        <title>Blinkboard | BARK BaaS Platform</title>
        <meta name="description" content="Manage your Blinks, donations, and payments on the BARK BaaS Platform." />
      </Head>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Blinkboard</h1>
          <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Blinks
          </Button>
        </div>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
          <AlertTitle>Welcome to your Blinkboard!</AlertTitle>
          <AlertDescription>
            Here you can manage your Blinks, process donations, and make payments.
          </AlertDescription>
        </Alert>
        
        <div className="mb-6 flex items-center space-x-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="donation">Donation</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="blink">Blink</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="blinks" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 gap-2">
            <TabsTrigger value="blinks" className="flex items-center justify-center"><Zap className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />Blinks</TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center justify-center"><Coins className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />Donations</TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center justify-center"><CreditCard className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />Payments</TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center justify-center"><Share2 className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />Recent Blinks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blinks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Your Blinks</CardTitle>
                <CardDescription>Manage your existing Blinks or create a new one.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading Blinks...</p>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBlinks.map((blink) => (
                          <TableRow key={blink.id}>
                            <TableCell>{blink.name}</TableCell>
                            <TableCell>{blink.type}</TableCell>
                            <TableCell>${blink.amount}</TableCell>
                            <TableCell>{new Date(blink.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">View Details</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{blink.name}</DialogTitle>
                                    <DialogDescription>
                                      <p>Type: {blink.type}</p>
                                      <p>Amount: ${blink.amount}</p>
                                      <p>Created: {new Date(blink.createdAt).toLocaleString()}</p>
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between mt-4">
                      <Button onClick={() => router.push('/blinks')}>
                        <Plus className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
                        Create New Blink
                      </Button>
                      <Button onClick={handleSendBlink}>
                        <Send className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
                        Send a Blink
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Coins className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Donations</CardTitle>
                <CardDescription>View and manage your donations.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading Donations...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.filter(t => t.type === 'donation').map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                          <TableCell>${donation.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CreditCard className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Payments</CardTitle>
                <CardDescription>View and manage your payments.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading Payments...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.filter(t => t.type === 'payment').map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>${payment.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Share2 className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Recent Blinks</CardTitle>
                <CardDescription>View and share your recent Blinks.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading Recent Blinks...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.filter(t => t.type === 'blink').map((blink) => (
                        <TableRow key={blink.id}>
                          <TableCell>{new Date(blink.date).toLocaleDateString()}</TableCell>
                          <TableCell>{blink.recipient}</TableCell>
                          <TableCell>${blink.amount}</TableCell>
                          <TableCell>{blink.message}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleShareBlink(blink)} size="sm">
                              <Share2 className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
                              Share
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}