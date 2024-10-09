'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Zap, Link as LinkIcon, Globe, Lock } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { WalletButton } from "@/components/ui/wallet-button"

export function CreateBlink() {
  const { connected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success",
        description: "Blink created successfully!",
      })
      // Reset form
      e.currentTarget.reset()
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2" aria-hidden="true" />Create a New Blink</CardTitle>
          <CardDescription>Set up your Blink for instant payments and interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {!connected && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to create a Blink.
                <WalletButton className="ml-2" />
              </AlertDescription>
            </Alert>
          )}
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
                <Label htmlFor="blinkCategory">Category</Label>
                <Select name="blinkCategory" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="blinkWebsite">Website (Optional)</Label>
                <div className="flex">
                  <LinkIcon className="w-4 h-4 mr-2 mt-3" />
                  <Input id="blinkWebsite" name="blinkWebsite" placeholder="https://your-blink-website.com" type="url" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <Label htmlFor="isPublic">Make Blink Public</Label>
                <Switch
                  id="isPublic"
                  name="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              {!isPublic && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="accessCode">Access Code</Label>
                  <div className="flex">
                    <Lock className="w-4 h-4 mr-2 mt-3" />
                    <Input id="accessCode" name="accessCode" placeholder="Set an access code for your private Blink" type="password" />
                  </div>
                </div>
              )}
            </div>
            <CardFooter className="flex justify-between mt-6 px-0">
              <Button type="submit" disabled={isLoading || !connected}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Blink'
                )}
              </Button>
              {!connected && (
                <WalletButton />
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}