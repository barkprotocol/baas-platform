'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Gift, Coins, Trophy, Star, Check } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.1 } }
}

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  total: number;
  claimed: boolean;
}

const initialRewardsData: Record<string, Reward[]> = {
  daily: [
    { id: 'd1', title: "Daily Login", description: "Log in every day to earn BARK tokens", icon: Gift, progress: 5, total: 7, claimed: false },
    { id: 'd2', title: "Complete a Transaction", description: "Perform a blockchain transaction", icon: Coins, progress: 1, total: 1, claimed: false },
  ],
  weekly: [
    { id: 'w1', title: "Weekly Challenge", description: "Complete the weekly blockchain challenge", icon: Trophy, progress: 2, total: 3, claimed: false },
    { id: 'w2', title: "Invite Friends", description: "Invite 5 friends to join BARK Protocol", icon: Star, progress: 3, total: 5, claimed: false },
  ],
  monthly: [
    { id: 'm1', title: "Staking Milestone", description: "Stake BARK tokens for 30 days", icon: Coins, progress: 15, total: 30, claimed: false },
    { id: 'm2', title: "Community Contribution", description: "Contribute to the BARK community", icon: Star, progress: 4, total: 5, claimed: false },
  ],
}

const RewardCard = ({ reward, onClaim }: { reward: Reward; onClaim: (id: string) => void }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <reward.icon className="w-6 h-6 text-primary" />
        <span>{reward.title}</span>
      </CardTitle>
      <CardDescription>{reward.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Progress value={(reward.progress / reward.total) * 100} className="w-full" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {reward.progress} / {reward.total} completed
      </p>
    </CardContent>
    <CardFooter>
      <Button 
        variant={reward.claimed ? "outline" : "default"} 
        className="w-full" 
        onClick={() => onClaim(reward.id)}
        disabled={reward.claimed || reward.progress < reward.total}
      >
        {reward.claimed ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Claimed
          </>
        ) : (
          reward.progress >= reward.total ? "Claim Reward" : "In Progress"
        )}
      </Button>
    </CardFooter>
  </Card>
)

export default function RewardsPage() {
  const { toast } = useToast()
  const [rewards, setRewards] = useState(initialRewardsData)
  const [totalClaimable, setTotalClaimable] = useState(0)

  useEffect(() => {
    const claimable = Object.values(rewards).flat().filter(reward => 
      reward.progress >= reward.total && !reward.claimed
    ).length
    setTotalClaimable(claimable)
  }, [rewards])

  const handleClaim = (id: string) => {
    setRewards(prevRewards => {
      const newRewards = { ...prevRewards }
      Object.keys(newRewards).forEach(period => {
        newRewards[period] = newRewards[period].map(reward => 
          reward.id === id ? { ...reward, claimed: true } : reward
        )
      })
      return newRewards
    })

    toast({
      title: "Reward Claimed",
      description: "Your reward has been successfully claimed!",
      duration: 3000,
    })
  }

  const handleClaimAll = () => {
    setRewards(prevRewards => {
      const newRewards = { ...prevRewards }
      Object.keys(newRewards).forEach(period => {
        newRewards[period] = newRewards[period].map(reward => 
          reward.progress >= reward.total ? { ...reward, claimed: true } : reward
        )
      })
      return newRewards
    })

    toast({
      title: "All Rewards Claimed",
      description: `Successfully claimed ${totalClaimable} rewards!`,
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-sand-900 dark:text-sand-100">BARK Rewards</h1>
        <p className="text-xl text-sand-700 dark:text-sand-300 max-w-2xl mx-auto">
          Earn rewards for your active participation in the BARK Protocol ecosystem.
        </p>
      </motion.div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          {Object.entries(rewards).map(([period, periodRewards]) => (
            <TabsContent key={period} value={period}>
              <motion.div
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid gap-6 md:grid-cols-2"
              >
                {periodRewards.map((reward) => (
                  <motion.div key={reward.id} variants={fadeInUp}>
                    <RewardCard reward={reward} onClaim={handleClaim} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>

      <motion.div
        variants={fadeInUp}
        className="mt-12 text-center"
      >
        <Button 
          size="lg" 
          onClick={handleClaimAll} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={totalClaimable === 0}
        >
          Claim All Available Rewards ({totalClaimable})
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}