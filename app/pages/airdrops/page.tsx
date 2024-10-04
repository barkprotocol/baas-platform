'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, Gift, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Airdrop = {
  id: string
  name: string
  status: 'ongoing' | 'completed' | 'upcoming'
  totalAmount: number
  claimedAmount: number
  startDate: string
  endDate: string
  description: string
  eligibilityCriteria: string
}

type AirdropsData = {
  ongoingAirdrops: Airdrop[]
  pastAirdrops: Airdrop[]
  upcomingAirdrops: Airdrop[]
  userEligibleAirdrops: string[]
}

export default function AirdropsPage() {
  const [airdropsData, setAirdropsData] = useState<AirdropsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [claimAmount, setClaimAmount] = useState('')
  const { toast } = useToast()

  const fetchAirdropsData = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would be an API call
      const response = await fetch('/api/airdrops')
      const data = await response.json()
      setAirdropsData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch airdrops data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAirdropsData()
  }, [])

  const handleClaimAirdrop = async (airdropId: string) => {
    try {
      // In a real application, this would be an API call to claim the airdrop
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: `Claimed ${claimAmount} BARK from airdrop ${airdropId}`,
      })
      setClaimAmount('')
      fetchAirdropsData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim airdrop. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!airdropsData) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load airdrops data. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    )
  }

  const renderAirdropCard = (airdrop: Airdrop) => (
    <Card key={airdrop.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{airdrop.name}</span>
          {airdrop.status === 'ongoing' && <Gift className="h-5 w-5 text-green-500" />}
          {airdrop.status === 'completed' && <CheckCircle className="h-5 w-5 text-blue-500" />}
          {airdrop.status === 'upcoming' && <Clock className="h-5 w-5 text-yellow-500" />}
        </CardTitle>
        <CardDescription>{airdrop.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-bold">{airdrop.totalAmount.toLocaleString()} BARK</span>
          </div>
          <div className="flex justify-between">
            <span>Claimed Amount:</span>
            <span className="font-bold">{airdrop.claimedAmount.toLocaleString()} BARK</span>
          </div>
          <div className="flex justify-between">
            <span>Start Date:</span>
            <span>{new Date(airdrop.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>End Date:</span>
            <span>{new Date(airdrop.endDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="font-semibold">Eligibility Criteria:</span>
            <p className="text-sm mt-1">{airdrop.eligibilityCriteria}</p>
          </div>
          <Progress value={(airdrop.claimedAmount / airdrop.totalAmount) * 100} className="mt-2" />
          {airdrop.status === 'ongoing' && airdropsData.userEligibleAirdrops.includes(airdrop.id) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-2">Claim Airdrop</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Claim Airdrop</DialogTitle>
                  <DialogDescription>
                    Enter the amount of BARK you want to claim from this airdrop.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claim-amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="claim-amount"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => handleClaimAirdrop(airdrop.id)}>Claim BARK</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">BARK Protocol Airdrops</h1>
        <Button onClick={fetchAirdropsData} variant="outline" className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="ongoing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing Airdrops</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Airdrops</TabsTrigger>
          <TabsTrigger value="past">Past Airdrops</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing">
          <div className="space-y-4">
            {airdropsData.ongoingAirdrops.length > 0 ? (
              airdropsData.ongoingAirdrops.map(renderAirdropCard)
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Ongoing Airdrops</AlertTitle>
                <AlertDescription>
                  There are currently no ongoing airdrops. Check back later for new opportunities!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
        <TabsContent value="upcoming">
          <div className="space-y-4">
            {airdropsData.upcomingAirdrops.length > 0 ? (
              airdropsData.upcomingAirdrops.map(renderAirdropCard)
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Upcoming Airdrops</AlertTitle>
                <AlertDescription>
                  There are currently no upcoming airdrops scheduled. Stay tuned for future announcements!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="space-y-4">
            {airdropsData.pastAirdrops.length > 0 ? (
              airdropsData.pastAirdrops.map(renderAirdropCard)
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Past Airdrops</AlertTitle>
                <AlertDescription>
                  There are no past airdrops to display at this time.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}