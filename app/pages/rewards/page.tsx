"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gift, ArrowRight } from 'lucide-react'

// Mock function to fetch user rewards data
const fetchRewardsData = async () => new Promise(resolve => setTimeout(() => resolve({
  totalPoints: 1250,
  currentTier: 'Silver',
  nextTier: 'Gold',
  pointsToNextTier: 750,
  recentRewards: [
    { id: 1, description: 'Transaction Bonus', points: 50, date: '2024-10-01' },
    { id: 2, description: 'Referral Reward', points: 100, date: '2024-10-03' },
    { id: 3, description: 'Daily Login Streak', points: 25, date: '2024-10-05' },
  ],
  availableRewards: [
    { id: 1, name: '$5 USDC Voucher', cost: 500 },
    { id: 2, name: 'NFT Minting Discount', cost: 1000 },
    { id: 3, name: 'Premium Feature Access', cost: 2000 },
  ]
}), 500));

export default function RewardsPage() {
  const [rewardsData, setRewardsData] = useState<any>(null)

  useEffect(() => {
    const loadRewardsData = async () => {
      const data = await fetchRewardsData()
      setRewardsData(data)
    }
    loadRewardsData()
  }, [])

  if (!rewardsData) {
    return <div>Loading...</div>
  }

  const progressPercentage = (rewardsData.totalPoints / (rewardsData.totalPoints + rewardsData.pointsToNextTier)) * 100

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">BARK Rewards</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Rewards Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{rewardsData.totalPoints} Points</div>
            <div className="text-sm text-muted-foreground mb-4">Current Tier: {rewardsData.currentTier}</div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{rewardsData.currentTier}</span>
                <span>{rewardsData.nextTier}</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
            <div className="text-sm text-muted-foreground">
              {rewardsData.pointsToNextTier} points to next tier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardsData.recentRewards.map((reward: any) => (
                  <TableRow key={reward.id}>
                    <TableCell>{reward.description}</TableCell>
                    <TableCell>{reward.points}</TableCell>
                    <TableCell>{reward.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Redeem your points for these exciting rewards!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewardsData.availableRewards.map((reward: any) => (
              <Card key={reward.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">{reward.cost} Points</p>
                  <Button className="w-full">
                    Redeem
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}