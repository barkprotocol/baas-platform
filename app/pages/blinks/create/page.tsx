'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, Timer } from 'lucide-react'

export default function CreateBlinkPage() {
  const router = useRouter()
  const [blinkName, setBlinkName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleBackToBlinks = () => router.push('/blinks')

  const handleCreateBlink = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Creating Blink:', { blinkName, amount, description })
    // After successful creation, you might want to redirect or show a success message
    router.push('/blinks')
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Timer className="mr-2 h-8 w-8 text-primary" aria-hidden="true" />
          Create New Blink
        </h1>
        <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
          <span>Back to Blinks</span>
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4 text-primary" aria-hidden="true" />
        <AlertTitle>Create a New Blink</AlertTitle>
        <AlertDescription>
          Fill in the details below to create a new Blink for instant payments. Think of it as creating a small timer of value.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Timer className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
            Blink Details
          </CardTitle>
          <CardDescription>Enter the name, amount, and description for your new Blink.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blink-name">Blink Name</Label>
              <Input
                id="blink-name"
                placeholder="Enter Blink name"
                value={blinkName}
                onChange={(e) => setBlinkName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description for this Blink"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full flex items-center justify-center">
              <Timer className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Blink
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}