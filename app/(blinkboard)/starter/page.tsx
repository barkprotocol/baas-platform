'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Zap, ArrowLeft, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface ApiResponse {
  success: boolean;
}

// Mock API function (replace with actual API call)
const createBlink = async (data: any): Promise<ApiResponse> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

export default function BlinkboardStarterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const result = await createBlink(data)

      if (result.success) {
        toast({
          title: "Success",
          description: "Blink created successfully.",
        })
        // Reset form
        e.currentTarget.reset()
      } else {
        throw new Error('Operation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToMain = () => {
    router.push('/')
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">BARK Blinkboard - Starter</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} /> Back to Main
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" aria-hidden="true" style={{color: '#D0BFB4'}} />
        <AlertTitle>Welcome to your Starter Blinkboard!</AlertTitle>
        <AlertDescription>
          Here you can create up to 5 Solana Blinks per month. Upgrade to Pro or Enterprise for more features and higher limits.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2" aria-hidden="true" style={{color: '#D0BFB4'}} />Create a New Blink</CardTitle>
          <CardDescription>Set up your Blink for instant payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="blinkName">Blink Name</Label>
                <Input id="blinkName" name="blinkName" placeholder="Enter your Blink name" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="blinkDescription">Description</Label>
                <Textarea id="blinkDescription" name="blinkDescription" placeholder="Describe your Blink" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="blinkAmount">Amount (SOL)</Label>
                <Input id="blinkAmount" name="blinkAmount" type="number" step="0.01" placeholder="Enter amount in SOL" required />
              </div>
            </div>
            <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Blink'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Blinks</h2>
        <p className="text-muted-foreground">You have created 0 out of 5 available Blinks this month.</p>
        {/* Add a list or grid of created Blinks here */}
      </div>
    </div>
  )
}