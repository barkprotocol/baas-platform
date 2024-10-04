import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, BarChart, TrendingUp, Users, DollarSign } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BlinkAnalytics {
  dailyTransactions: { date: string; count: number }[];
  topRecipients: { name: string; amount: number }[];
  totalValue: number;
  growthRate: number;
}

// Mock API function (replace with actual API call)
const fetchBlinkAnalytics = async (): Promise<BlinkAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    dailyTransactions: [
      { date: '2024-06-01', count: 5 },
      { date: '2024-06-02', count: 7 },
      { date: '2024-06-03', count: 3 },
      { date: '2024-06-04', count: 8 },
      { date: '2024-06-05', count: 12 },
    ],
    topRecipients: [
      { name: 'Tommy', amount: 500 },
      { name: 'Ace', amount: 300 },
      { name: 'Charlie', amount: 200 },
    ],
    totalValue: 2000,
    growthRate: 15,
  };
};

export default function BlinkAnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<BlinkAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchBlinkAnalytics();
        setAnalytics(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load Blink analytics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [toast]);

  const handleBackToBlinks = () => {
    router.push('/blinks')
  }

  return (
    <>
      <Head>
        <title>Blink Analytics | BARK Protocol</title>
        <meta name="description" content="View detailed analytics for your Blinks on The Blockchain As A Service Platform." />
      </Head>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Analytics</h1>
          <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Blinks
          </Button>
        </div>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
          <AlertTitle>Blink Analytics</AlertTitle>
          <AlertDescription>
            View detailed analytics and insights for your Blinks.
          </AlertDescription>
        </Alert>
        
        {isLoading ? (
          <p>Loading Blink analytics...</p>
        ) : analytics && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><DollarSign className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${analytics.totalValue}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.growthRate}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Users className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Top Recipient</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.topRecipients[0].name}</p>
                  <p className="text-sm text-muted-foreground">${analytics.topRecipients[0].amount}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BarChart className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Daily Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.dailyTransactions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#D0BFB4" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Top Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.topRecipients.map((recipient, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{recipient.name}</span>
                      <span className="font-bold">${recipient.amount}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}