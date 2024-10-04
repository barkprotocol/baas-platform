"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Jupiter, RouteInfo } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowDownUp, RefreshCw, Info, Droplet, Settings, TrendingUp, ChevronDown, ArrowLeft, Copy, Zap, Coins } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const tokenList = [
  { symbol: 'SOL', name: 'Solana', image: '/assets/icons/sol.png', balance: '10.5', price: 20 },
  { symbol: 'USDC', name: 'USD Coin', image: '/assets/icons/usdc.png', balance: '1000.00', price: 1 },
  { symbol: 'BARK', name: 'BARK', image: '/assets/icons/bark.png', balance: '5000.00', price: 0.1 },
  { symbol: 'mSOL', name: 'Marinade staked SOL', image: '/assets/icons/msol.png', balance: '5.25', price: 21 },
]

const poolList = [
  { name: 'SOL-USDC', apy: '5.2%', tvl: '$10.5M', volume24h: '$1.2M' },
  { name: 'BARK-USDC', apy: '12.8%', tvl: '$5.3M', volume24h: '$800K' },
  { name: 'mSOL-SOL', apy: '7.5%', tvl: '$8.7M', volume24h: '$950K' },
]

// Mock market API
const fetchMarketData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
  return {
    SOL: { price: 20 + Math.random() * 2 - 1, change24h: (Math.random() * 10 - 5).toFixed(2) },
    USDC: { price: 1, change24h: 0 },
    BARK: { price: 0.1 + Math.random() * 0.02 - 0.01, change24h: (Math.random() * 20 - 10).toFixed(2) },
    mSOL: { price: 21 + Math.random() * 2 - 1, change24h: (Math.random() * 10 - 5).toFixed(2) },
  }
}

export default function SwapPage() {
  const router = useRouter()
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('swap')
  const [inputToken, setInputToken] = useState(tokenList[0])
  const [outputToken, setOutputToken] = useState(tokenList[1])
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [autoRouting, setAutoRouting] = useState(true)
  const [referralLink, setReferralLink] = useState('')
  const [marketData, setMarketData] = useState<Record<string, { price: number, change24h: string }>>({})

  useEffect(() => {
    if (inputToken && outputToken && inputAmount) {
      fetchRoutes()
    }
    setReferralLink(`https://barkprotocol.com/ref/${Math.random().toString(36).substring(7)}`)
    updateMarketData()
  }, [inputToken, outputToken, inputAmount, slippage, autoRouting])

  const updateMarketData = async () => {
    const data = await fetchMarketData()
    setMarketData(data)
  }

  const fetchRoutes = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const inputValue = parseFloat(inputAmount) * inputToken.price
      const outputValue = inputValue / outputToken.price
      const mockRoutes: RouteInfo[] = [
        {
          inAmount: parseFloat(inputAmount),
          outAmount: outputValue,
          priceImpactPct: 0.1,
          marketInfos: [
            { label: 'Jupiter', percent: 70 },
            { label: 'Raydium', percent: 30 },
          ],
          amount: parseFloat(inputAmount),
          slippageBps: slippage * 100,
          otherAmountThreshold: '0',
          swapMode: 'ExactIn',
        },
        {
          inAmount: parseFloat(inputAmount),
          outAmount: outputValue * 0.99,
          priceImpactPct: 0.2,
          marketInfos: [
            { label: 'Orca', percent: 100 },
          ],
          amount: parseFloat(inputAmount),
          slippageBps: slippage * 100,
          otherAmountThreshold: '0',
          swapMode: 'ExactIn',
        }
      ]
      setRoutes(mockRoutes)
      setSelectedRoute(mockRoutes[0])
      setOutputAmount(mockRoutes[0].outAmount.toFixed(6))
    } catch (error) {
      console.error('Error fetching routes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch swap routes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !selectedRoute) {
      toast({
        title: "Error",
        description: "Please connect your wallet and select a route.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Success",
        description: `Swapped ${inputAmount} ${inputToken.symbol} for ${outputAmount} ${outputToken.symbol}`,
      })
      setInputAmount('')
      setOutputAmount('')
    } catch (error) {
      console.error('Error performing swap:', error)
      toast({
        title: "Error",
        description: "Failed to perform swap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSwitch = () => {
    const tempToken = inputToken
    setInputToken(outputToken)
    setOutputToken(tempToken)
    setInputAmount(outputAmount)
    setOutputAmount(inputAmount)
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    })
  }

  return (
    <div className="container mx-auto py-8 bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8">
      <Button 
        variant="outline" 
        onClick={() => router.push('/')} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" style={{ color: '#D0BFB4' }} />
        Back to Dashboard
      </Button>
      <Card className="max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">BARK DEX</CardTitle>
              <CardDescription>Fast, Secure, Decentralized</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4" style={{ color: '#D0BFB4' }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize your trading preferences
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slippage">Slippage Tolerance</Label>
                      <Input
                        id="slippage"
                        type="number"
                        value={slippage}
                        onChange={(e) => setSlippage(parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-routing"
                        checked={autoRouting}
                        onCheckedChange={setAutoRouting}
                      />
                      <Label htmlFor="auto-routing">Auto Routing</Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="swap" className="text-sm sm:text-base">
                <Zap className="w-4 h-4 mr-2" style={{ color: '#D0BFB4' }} />
                Swap
              </TabsTrigger>
              <TabsTrigger value="pool" className="text-sm sm:text-base">
                <Droplet className="w-4 h-4 mr-2" style={{ color: '#D0BFB4' }} />
                Pool
              </TabsTrigger>
              <TabsTrigger value="rewards" className="text-sm sm:text-base">
                <Coins className="w-4 h-4 mr-2" style={{ color: '#D0BFB4' }} />
                Rewards
              </TabsTrigger>
            </TabsList>
            <TabsContent value="swap">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <Label htmlFor="inputToken" className="text-lg font-semibold mb-2 block">From</Label>
                  <div className="flex items-center space-x-2">
                    <Select value={inputToken.symbol} onValueChange={(value) => setInputToken(tokenList.find(t => t.symbol === value)!)}>
                      <SelectTrigger className="w-[120px] sm:w-[180px]">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokenList.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center">
                              <Image src={token.image} alt={token.name} width={24} height={24} className="mr-2" />
                              <div>
                                <div>{token.symbol}</div>
                                <div className="text-xs text-muted-foreground">Balance: {token.balance}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="inputAmount"
                      type="number"
                      placeholder="0.00"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="flex-grow text-right text-xl"
                    />
                  </div>
                  {marketData[inputToken.symbol] && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Price: ${marketData[inputToken.symbol].price.toFixed(2)} 
                      <span className={marketData[inputToken.symbol].change24h.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                        {' '}({marketData[inputToken.symbol].change24h}%)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="icon" onClick={handleTokenSwitch} className="rounded-full">
                    <ArrowDownUp className="h-4 w-4" style={{ color: '#D0BFB4' }} />
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <Label htmlFor="outputToken" className="text-lg font-semibold mb-2 block">To</Label>
                  <div className="flex items-center space-x-2">
                    <Select value={outputToken.symbol} onValueChange={(value) => setOutputToken(tokenList.find(t => t.symbol === value)!)}>
                      <SelectTrigger className="w-[120px] sm:w-[180px]">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokenList.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center">
                              <Image src={token.image} alt={token.name} width={24} height={24} className="mr-2" />
                              <div>
                                <div>{token.symbol}</div>
                                <div className="text-xs text-muted-foreground">Balance: {token.balance}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="outputAmount"
                      type="number"
                      placeholder="0.00"
                      value={outputAmount}
                      readOnly
                      className="flex-grow text-right text-xl"
                    />
                  </div>
                  {marketData[outputToken.symbol] && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Price: ${marketData[outputToken.symbol].price.toFixed(2)} 
                      <span className={marketData[outputToken.symbol].change24h.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                        {' '}({marketData[outputToken.symbol].change24h}%)
                      </span>
                    </div>
                  )}
                </div>
                {selectedRoute && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price:</span>
                      <span>1 {inputToken.symbol} = {(selectedRoute.outAmount / selectedRoute.inAmount).toFixed(6)} {outputToken.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price Impact:</span>
                      <span className={selectedRoute.priceImpactPct > 1 ? 'text-red-500' : 'text-green-500'}>
                        {selectedRoute.priceImpactPct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Minimum Received:</span>
                      <span>{(parseFloat(outputAmount) * (1 - slippage / 100)).toFixed(6)} {outputToken.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Route:</span>
                      <div className="flex space-x-1">
                        {selectedRoute.marketInfos.map((market, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {market.label} {market.percent}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <Button className="w-full text-lg py-6" onClick={handleSwap} disabled={isLoading || !selectedRoute}>
                  {isLoading ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" style={{ color: '#D0BFB4' }} /> : null}
                  {isLoading ? 'Processing...' : 'Swap'}
                </Button>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Powered by Jupiter</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="link" className="h-auto p-0">
                          <TrendingUp className="h-4 w-4 mr-1" style={{ color: '#D0BFB4' }} />
                          View all routes
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-2">
                          {routes.map((route, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{route.marketInfos.map(m => m.label).join(' > ')}</span>
                              <span>{route.outAmount.toFixed(6)} {outputToken.symbol}</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pool">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-muted-foreground">
                  <div>Pool</div>
                  <div>APY</div>
                  <div>TVL</div>
                  <div>24h Volume</div>
                </div>
                {poolList.map((pool) => (
                  <div key={pool.name} className="grid grid-cols-4 gap-4 text-sm border-b border-gray-200 pb-2">
                    <div>{pool.name}</div>
                    <div className="text-green-600">{pool.apy}</div>
                    <div>{pool.tvl}</div>
                    <div>{pool.volume24h}</div>
                  </div>
                ))}
                <Button className="w-full text-lg py-6">
                  <Droplet className="mr-2 h-5 w-5" style={{ color: '#D0BFB4' }} />
                  Add Liquidity
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="rewards">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Refer Friends, Earn Rewards</h3>
                <p className="text-muted-foreground">Share your referral link and earn BARK tokens for each new user</p>
                <div className="flex items-center space-x-2">
                  <Input value={referralLink} readOnly className="flex-grow" />
                  <Button onClick={copyReferralLink}>
                    <Copy className="h-4 w-4 mr-2" style={{ color: '#D0BFB4' }} />
                    Copy
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Your Rewards</h4>
                  <p className="text-2xl font-bold">500 BARK</p>
                  <p className="text-sm text-muted-foreground">≈ $75.00 USD</p>
                </div>
                <Button className="w-full">Claim Rewards</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <div className="flex justify-center items-center space-x-2">
          <Image src="/assets/icons/jupiter.png" alt="Jupiter" width={24} height={24} />
          <span>Powered by Jupiter</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="mt-2 inline-flex items-center">
              <Info className="h-4 w-4 mr-1" style={{ color: '#D0BFB4' }} />
              Learn more about BARK Protocol
            </TooltipTrigger>
            <TooltipContent>
              <p>BARK Protocol leverages Jupiter for optimal swap routes</p>
              <p>and Mercury Finance for liquidity pools</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}