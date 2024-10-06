'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, BarChart, PieChart, TrendingUp } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
const iconColor = "#D0BFB4"

interface AnalyticsData {
  totalBlinks: number
  activeBlinks: number
  totalVolume: number
  topBlinkTypes: { type: string; count: number }[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/blinks/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (publicKey) {
      fetchAnalytics()
    }
  }, [publicKey, toast])

  const handleBackToBlinks = () => router.push('/blinks')

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
          <Image src={titleIconUrl} alt="BARK BLINKS icon" width={32} height={32} className="mr-2" />
          Blinks Analytics
        </h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button onClick={handleBackToBlinks} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
            <span className="sr-only">Back to </span>Blinks
          </Button>
        </div>
      </div>

      {!publicKey ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your Blinks analytics.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="text-center py-4">Loading analytics data...</div>
      ) : analyticsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  Total Blinks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analyticsData.totalBlinks}</p>
                <p className="text-sm text-muted-foreground">
                  Active: {analyticsData.activeBlinks} ({((analyticsData.activeBlinks / analyticsData.totalBlinks) * 100).toFixed(1)}%)
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  Total Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${analyticsData.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  Across all Blinks
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                  Top Blink Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analyticsData.topBlinkTypes.map((type, index) => (
                    <li key={type.type} className="flex justify-between items-center">
                      <span className="capitalize">{type.type}</span>
                      <span className="font-semibold">{type.count}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" style={{ color: iconColor }} />
          <AlertTitle>No data available</AlertTitle>
          <AlertDescription>
            We couldn't retrieve your analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}