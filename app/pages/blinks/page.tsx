'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Zap, Send, BarChart3, Plus } from 'lucide-react'

interface BlinkSummary {
  totalBlinks: number
  totalValue: number
  recentActivity: number
}

const fetchBlinkSummary = async (): Promise<BlinkSummary> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    totalBlinks: 5,
    totalValue: 1000,
    recentActivity: 3,
  }
}

const blinkActions = [
  { title: 'Create New Blink', description: 'Set up a new Blink for instant payments', icon: Plus, path: '/blinks/create' },
  { title: 'Blinkboard', description: 'View and manage your Blinks', icon: BarChart3, path: '/blinks/blinkboard' },
  { title: 'Send a Blink', description: 'Send a Blink payment to someone', icon: Send, path: '/blinks/send' },
  { title: 'Blink Analytics', description: 'View detailed analytics for your Blinks', icon: Zap, path: '/blinks/analytics' },
]

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
        console.error('Failed to load Blink summary:', error)
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

  const renderSummaryContent = () => {
    if (isLoading) {
      return Array(3).fill(null).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-8 w-24 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      ))
    }

    if (!summary) {
      return (
        <div className="col-span-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load Blink summary. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <>
        <SummaryItem title="Total Blinks" value={summary.totalBlinks} />
        <SummaryItem title="Total Value" value={`$${summary.totalValue.toLocaleString()}`} />
        <SummaryItem title="Recent Activity" value={summary.recentActivity} />
      </>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Blinks</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> 
          <span className="sr-only">Back to </span>Main
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Welcome to Blinks!</AlertTitle>
        <AlertDescription>
          Here you can manage your existing Blinks or create new ones for instant payments on Solana.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Blink Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {renderSummaryContent()}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {blinkActions.map((action, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <action.icon className="w-5 h-5 mr-2" aria-hidden="true" />
                {action.title}
              </CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigateTo(action.path)} className="w-full">
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const SummaryItem = ({ title, value }: { title: string; value: string | number }) => (
  <div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{title}</p>
  </div>
)