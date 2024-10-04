'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Zap, ArrowLeft, BarChart, Plus, Send } from 'lucide-react'

interface BlinkSummary {
  totalBlinks: number
  totalValue: number
  recentActivity: number
}

// Mock API function (replace with actual API call)
const fetchBlinkSummary = async (): Promise<BlinkSummary> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    totalBlinks: 5,
    totalValue: 1000,
    recentActivity: 3,
  }
}

export default function BlinksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [summary, setSummary] = useState<BlinkSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchBlinkSummary()
        setSummary(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load Blink summary. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSummary()
  }, [toast])

  const handleBackToMain = () => router.push('/')

  const navigateTo = (path: string) => router.push(path)

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Blinks</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4 text-primary" aria-hidden="true" /> 
          <span>Back to Main</span>
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4 text-primary" aria-hidden="true" />
        <AlertTitle>Welcome to Blinks!</AlertTitle>
        <AlertDescription>
          Here you can manage your existing Blinks or create new ones.
        </AlertDescription>
      </Alert>
      
      {isLoading ? (
        <p className="text-center">Loading Blink summary...</p>
      ) : summary ? (
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
                <p className="text-2xl font-bold">${summary.totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.recentActivity}</p>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Blink summary. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: 'Create New Blink', description: 'Set up a new Blink for instant payments.', icon: Plus, path: '/blinks/create' },
          { title: 'Blinkboard', description: 'View and manage your Blinks, donations, and payments.', icon: BarChart, path: '/blinks/blinkboard' },
          { title: 'Send a Blink', description: 'Send a Blink payment to someone.', icon: Send, path: '/blinks/send' },
          { title: 'Blink Analytics', description: 'View detailed analytics for your Blinks.', icon: Zap, path: '/blinks/analytics' },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigateTo(item.path)} className="w-full">
                {item.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}