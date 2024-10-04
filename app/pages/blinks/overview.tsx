'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Umbrella, Palmtree, Waves, Sunset, ArrowLeft } from 'lucide-react'
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
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-[#F5E6D3]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#8B4513]">BARK Blinks</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center text-[#8B4513] border-[#8B4513] hover:bg-[#E6C9A8]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>
      </div>
      <Alert className="mb-6 bg-[#E6C9A8] border-[#C19A6B]">
        <Umbrella className="h-4 w-4 text-[#8B4513]" />
        <AlertTitle className="text-[#8B4513]">Welcome to BARK Blinks!</AlertTitle>
        <AlertDescription className="text-[#8B4513]">
          Here you can manage your existing Blinks or create new ones.
        </AlertDescription>
      </Alert>
      
      {isLoading ? (
        <Card className="mb-6 bg-[#E6C9A8] border-[#C19A6B]">
          <CardContent className="p-6">
            <p className="text-center text-[#8B4513]">Loading Blink summary...</p>
          </CardContent>
        </Card>
      ) : summary && (
        <Card className="mb-6 bg-[#E6C9A8] border-[#C19A6B]">
          <CardHeader>
            <CardTitle className="text-[#8B4513]">Blink Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#8B4513]">{summary.totalBlinks}</p>
                <p className="text-sm text-[#A67B5B]">Total Blinks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B4513]">${summary.totalValue}</p>
                <p className="text-sm text-[#A67B5B]">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B4513]">{summary.recentActivity}</p>
                <p className="text-sm text-[#A67B5B]">Recent Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#E6C9A8] border-[#C19A6B]">
          <CardHeader>
            <CardTitle className="flex items-center text-[#8B4513]"><Palmtree className="w-5 h-5 mr-2 text-[#8B4513]" />Create New Blink</CardTitle>
            <CardDescription className="text-[#A67B5B]">Set up a new Blink for instant payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('/blinks/create')} className="w-full bg-[#C19A6B] hover:bg-[#A67B5B] text-[#F5E6D3]">
              Create New Blink
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#E6C9A8] border-[#C19A6B]">
          <CardHeader>
            <CardTitle className="flex items-center text-[#8B4513]"><Waves className="w-5 h-5 mr-2 text-[#8B4513]" />Blinkboard</CardTitle>
            <CardDescription className="text-[#A67B5B]">View and manage your Blinks, donations, and payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('/blinks/blinkboard')} className="w-full bg-[#C19A6B] hover:bg-[#A67B5B] text-[#F5E6D3]">
              Go to Blinkboard
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#E6C9A8] border-[#C19A6B]">
          <CardHeader>
            <CardTitle className="flex items-center text-[#8B4513]"><Sunset className="w-5 h-5 mr-2 text-[#8B4513]" />Send a Blink</CardTitle>
            <CardDescription className="text-[#A67B5B]">Send a Blink payment to someone.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('/blinks/send')} className="w-full bg-[#C19A6B] hover:bg-[#A67B5B] text-[#F5E6D3]">
              Send a Blink
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#E6C9A8] border-[#C19A6B]">
          <CardHeader>
            <CardTitle className="flex items-center text-[#8B4513]"><Umbrella className="w-5 h-5 mr-2 text-[#8B4513]" />Blink Analytics</CardTitle>
            <CardDescription className="text-[#A67B5B]">View detailed analytics for your Blinks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('/blinks/analytics')} className="w-full bg-[#C19A6B] hover:bg-[#A67B5B] text-[#F5E6D3]">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}