import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Zap, ArrowLeft, BarChart, Plus, Send } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface BlinkSummary {
  totalBlinks: number;
  totalValue: number;
  recentActivity: number;
}

// Mock API function (replace with actual API call)
const fetchBlinkSummary = async (): Promise<BlinkSummary> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalBlinks: 5,
    totalValue: 1000,
    recentActivity: 3,
  };
};

export default function BlinksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [summary, setSummary] = useState<BlinkSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchBlinkSummary();
        setSummary(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load Blink summary. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [toast]);

  const handleBackToMain = () => {
    router.push('/')
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <>
      <Head>
        <title>Blinks | BARK BaaS Platform</title>
        <meta name="description" content="Manage your Blinks on the BARK BaaS Platform." />
      </Head>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Blinks</h1>
          <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Main
          </Button>
        </div>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
          <AlertTitle>Welcome to Blinks!</AlertTitle>
          <AlertDescription>
            Here you can manage your existing Blinks or create new ones.
          </AlertDescription>
        </Alert>
        
        {isLoading ? (
          <p>Loading Blink summary...</p>
        ) : summary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Blink Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{summary.totalBlinks}</p>
                  <p className="text-sm text-muted-foreground">Total Blinks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">${summary.totalValue}</p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{summary.recentActivity}</p>
                  <p className="text-sm text-muted-foreground">Recent Activity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Plus className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Create New Blink</CardTitle>
              <CardDescription>Set up a new Blink for instant payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigateTo('/blinks/create')} className="w-full">
                Create New Blink
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BarChart className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Blinkboard</CardTitle>
              <CardDescription>View and manage your Blinks, donations, and payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigateTo('/blinks/blinkboard')} className="w-full">
                Go to Blinkboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Send className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Send a Blink</CardTitle>
              <CardDescription>Send a Blink payment to someone.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigateTo('/blinks/send')} className="w-full">
                Send a Blink
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Blink Analytics</CardTitle>
              <CardDescription>View detailed analytics for your Blinks.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigateTo('/blinks/analytics')} className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}