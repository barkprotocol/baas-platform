'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import SalesChart from '@/components/merchant/sales-chart'
import { fetchMerchantData } from '@/lib/merchant/api'
import { MerchantData } from '@/lib/merchant/types'
import Link from 'next/link'

export default function MerchantDashboard() {
  const { publicKey } = useWallet()
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null)

  useEffect(() => {
    if (publicKey) {
      fetchMerchantData(publicKey.toString()).then(setMerchantData)
    }
  }, [publicKey])

  if (!publicKey) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to access the merchant dashboard.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
        <WalletButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your sales performance for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={merchantData?.salesData || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/merchant/products">Manage Products</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/merchant/orders">View Orders</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/merchant/settings">Store Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {merchantData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Store Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Total Products</h3>
              <p className="text-3xl font-bold">{merchantData.totalProducts}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-3xl font-bold">{merchantData.totalOrders}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold">{merchantData.totalRevenue} SOL</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Avg. Order Value</h3>
              <p className="text-3xl font-bold">{merchantData.averageOrderValue} SOL</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}