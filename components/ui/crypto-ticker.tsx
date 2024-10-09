'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export default function CryptoTicker() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: 'bitcoin,ethereum,solana,bark',
            order: 'market_cap_desc',
            per_page: 4,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        })
        setCoins(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch cryptocurrency data')
        setLoading(false)
      }
    }

    fetchCoinData()
    const interval = setInterval(fetchCoinData, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading cryptocurrency data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {coins.map((coin) => (
        <Card key={coin.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {coin.name} ({coin.symbol.toUpperCase()})
            </CardTitle>
            <img src={coin.image} alt={coin.name} className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${coin.current_price.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              24h Change:
              <Badge
                variant={coin.price_change_percentage_24h > 0 ? "success" : "destructive"}
                className="ml-2"
              >
                {coin.price_change_percentage_24h > 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </Badge>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}