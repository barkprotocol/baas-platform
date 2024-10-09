'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Zap, Coins, FileText, Send, Repeat, PlusCircle, AlertCircle, ArrowLeft, Info, Moon, Sun, Vote, Gift, BookOpen, ShoppingBag, GiftIcon, TrendingUp, Droplet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'
import Image from 'next/image'

interface Action {
  name: string;
  icon: React.ElementType;
  description: string;
}

interface RecentAction {
  id: number;
  action: string;
  status: string;
  timestamp: string;
}

interface Currency {
  name: string;
  symbol: string;
  icon: string;
}

interface GovernanceProposal {
  id: number;
  title: string;
  description: string;
  votes: number;
  status: 'Active' | 'Passed' | 'Rejected';
}

const actions: Action[] = [
  { name: 'Transfer SPL Tokens', icon: Send, description: 'Send SPL tokens to another wallet' },
  { name: 'Create SPL Token', icon: Coins, description: 'Create a new SPL token' },
  { name: 'Governance', icon: Vote, description: 'Participate in BARK governance using Solana Realms' },
  { name: 'Swap Tokens', icon: Repeat, description: 'Swap tokens using Jupiter or Meteora' },
  { name: 'Stake', icon: Zap, description: 'Stake your BARK tokens for rewards' },
  { name: 'Mint NFT', icon: PlusCircle, description: 'Mint a new NFT' },
  { name: 'Donate', icon: Gift, description: 'Donate BARK tokens to the ecosystem' },
  { name: 'Claim Rewards', icon: GiftIcon, description: 'Claim rewards from governance treasury' },
  { name: 'View Analytics', icon: TrendingUp, description: 'View BARK ecosystem analytics' },
  { name: 'Liquidity Provision', icon: Droplet, description: 'Provide liquidity to decentralized exchanges' },
]

const currencies: Currency[] = [
  { name: 'Solana', symbol: 'SOL', icon: 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png' },
  { name: 'USD Coin', symbol: 'USDC', icon: 'https://ucarecdn.com/67e17a97-f3bd-46c0-8627-e13b8b939d26/usdc.png' },
  { name: 'BARK', symbol: 'BARK', icon: 'https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png' },
]

export default function ActionsPage() {
  const [selectedAction, setSelectedAction] = useState<string>(actions[0].name)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const [isSimulation, setIsSimulation] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [memo, setMemo] = useState<string>('')
  const [barkBalance, setBarkBalance] = useState<number>(0)
  const [governanceProposals, setGovernanceProposals] = useState<GovernanceProposal[]>([])
  const [claimableRewards, setClaimableRewards] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    // Loading recent actions, BARK balance, governance proposals, and claimable rewards
    const timer = setTimeout(() => {
      setIsLoading(false)
      setRecentActions([
        { id: 1, action: 'Transfer SPL Tokens', status: 'Completed', timestamp: new Date().toISOString() },
        { id: 2, action: 'Create SPL Token', status: 'Pending', timestamp: new Date().toISOString() },
      ])
      // Simulating fetching BARK balance
      setBarkBalance(750000)
      // Simulating fetching governance proposals
      setGovernanceProposals([
        { id: 1, title: 'Increase Staking Rewards', description: 'Proposal to increase staking rewards by 2%', votes: 1500000, status: 'Active' },
        { id: 2, title: 'New Partnership', description: 'Establish partnership with DEX aggregator', votes: 2000000, status: 'Passed' },
      ])
      // Simulating fetching claimable rewards
      setClaimableRewards(5000)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    // Set currency to BARK for Governance action
    if (selectedAction === 'Governance') {
      setSelectedCurrency(currencies.find(c => c.symbol === 'BARK') || currencies[0])
    }
  }, [selectedAction])

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const actionMessage = isSimulation ? "simulated" : "submitted"
    
    let result
    switch (selectedAction) {
      case 'Transfer SPL Tokens':
        result = await handleTransfer()
        break
      case 'Create SPL Token':
        result = await handleCreateToken()
        break
      case 'Governance':
        result = await handleGovernance()
        break
      case 'Swap Tokens':
        result = await handleSwap()
        break
      case 'Stake':
        result = await handleStake()
        break
      case 'Mint NFT':
        result = await handleMintNFT()
        break
      case 'Donate':
        result = await handleDonate()
        break
      case 'Claim Rewards':
        result = await handleClaimRewards()
        break
      case 'View Analytics':
        result = await handleViewAnalytics()
        break
      case 'Liquidity Provision':
        result = await handleLiquidityProvision()
        break
      default:
        result = { success: false, message: 'Invalid action selected.' }
    }

    toast({
      title: result.success ? `Action ${actionMessage}` : 'Action Failed',
      description: result.message,
      duration: 5000,
    })

    if (result.success) {
      setRecentActions(prev => [{
        id: prev.length + 1,
        action: `${selectedAction} ${selectedCurrency.symbol}`,
        status: isSimulation ? 'Simulated' : 'Pending',
        timestamp: new Date().toISOString()
      }, ...prev])
    }
  }

  const handleTransfer = async () => {
    try {
      const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value)
      const recipient = (document.getElementById('recipient') as HTMLInputElement).value
      if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Please enter a valid amount.' }
      }
      if (!recipient) {
        return { success: false, message: 'Please enter a recipient address.' }
      }
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: selectedCurrency.symbol, recipient, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Transfer failed. Please try again.' }
    }
  }

  const handleCreateToken = async () => {
    try {
      const tokenName = (document.getElementById('tokenName') as HTMLInputElement).value
      const tokenSymbol = (document.getElementById('tokenSymbol') as HTMLInputElement).value
      const tokenSupply = parseFloat((document.getElementById('tokenSupply') as HTMLInputElement).value)
      if (!tokenName || !tokenSymbol || isNaN(tokenSupply) || tokenSupply <= 0) {
        return { success: false, message: 'Please fill in all token details correctly.' }
      }
      const response = await fetch('/api/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenName, tokenSymbol, tokenSupply, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Token creation failed. Please try again.' }
    }
  }

  const handleGovernance = async () => {
    try {
      if (barkBalance < 500000) {
        return { success: false, message: 'You need at least 500,000 BARK tokens to participate in governance.' }
      }
      const proposal = (document.getElementById('proposal') as HTMLTextAreaElement).value
      const proposalType = (document.getElementById('proposalType') as HTMLSelectElement).value
      if (!proposal || !proposalType) {
        return { success: false, message: 'Please enter a governance proposal and select a proposal type.' }
      }
      const response = await fetch('/api/governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal, proposalType, barkBalance, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Governance action failed. Please try again.' }
    }
  }

  const handleSwap = async () => {
    try {
      const fromAmount = parseFloat((document.getElementById('fromAmount') as HTMLInputElement).value)
      const toAmount = parseFloat((document.getElementById('toAmount') as HTMLInputElement).value)
      const swapProvider = (document.getElementById('swapProvider') as HTMLSelectElement).value
      if (isNaN(fromAmount) || fromAmount <= 0 || isNaN(toAmount) || toAmount <= 0) {
        return { success: false, message: 'Please enter valid amounts for the swap.' }
      }
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAmount, fromCurrency: selectedCurrency.symbol, toAmount, toCurrency: selectedCurrency.symbol, swapProvider, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Swap failed. Please try again.' }
    }
  }

  const handleStake = async () => {
    try {
      const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value)
      if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Please enter a valid amount to stake.' }
      }
      const response = await fetch('/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: selectedCurrency.symbol, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Staking failed. Please try again.' }
    }
  }

  const handleMintNFT = async () => {
    try {
      const nftName = (document.getElementById('nftName') as HTMLInputElement).value
      const nftDescription = (document.getElementById('nftDescription') as HTMLTextAreaElement).value
      if (!nftName || !nftDescription) {
        return { success: false, message: 'Please provide both a name and description for your NFT.' }
      }
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nftName, nftDescription, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'NFT minting failed. Please try again.' }
    }
  }

  const handleDonate = async () => {
    try {
      const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value)
      if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Please enter a valid amount to donate.' }
      }
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: selectedCurrency.symbol, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Donation failed. Please try again.' }
    }
  }

  const handleClaimRewards = async () => {
    try {
      const response = await fetch('/api/claim-rewards', {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo })
      })
      const data = await response.json()
      if (data.success) {
        setClaimableRewards(0)
      }
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Claiming rewards failed. Please try again.' }
    }
  }

  const handleViewAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      return { success: true, message: 'Analytics data fetched successfully.', data: data }
    } catch (error) {
      return { success: false, message: 'Failed to fetch analytics data. Please try again.' }
    }
  }

  const handleLiquidityProvision = async () => {
    try {
      const amount1 = parseFloat((document.getElementById('amount1') as HTMLInputElement).value)
      const amount2 = parseFloat((document.getElementById('amount2') as HTMLInputElement).value)
      const pool = (document.getElementById('pool') as HTMLSelectElement).value
      if (isNaN(amount1) || amount1 <= 0 || isNaN(amount2) || amount2 <= 0) {
        return { success: false, message: 'Please enter valid amounts for both tokens.' }
      }
      if (!pool) {
        return { success: false, message: 'Please select a liquidity pool.' }
      }
      const response = await fetch('/api/provide-liquidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount1, amount2, pool, memo })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: 'Liquidity provision failed. Please try again.' }
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const renderActionInputs = () => {
    switch (selectedAction) {
      case 'Transfer SPL Tokens':
        return (
          <>
            <div>
              <Label htmlFor="amount" className={isDarkMode ? 'text-gray-300' : ''}>Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.000001"
                min="0"
                placeholder={`Enter amount in ${selectedCurrency.symbol}`} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="recipient" className={isDarkMode ? 'text-gray-300' : ''}>Recipient Address</Label>
              <Input 
                id="recipient" 
                placeholder={`Enter recipient's ${selectedCurrency.name} address`} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
          </>
        )
      case 'Create SPL Token':
        return (
          <>
            <div>
              <Label htmlFor="tokenName" className={isDarkMode ? 'text-gray-300' : ''}>Token Name</Label>
              <Input 
                id="tokenName" 
                placeholder="Enter token name" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol" className={isDarkMode ? 'text-gray-300' : ''}>Token Symbol</Label>
              <Input 
                id="tokenSymbol" 
                placeholder="Enter token symbol" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="tokenSupply" className={isDarkMode ? 'text-gray-300' : ''}>Initial Supply</Label>
              <Input 
                id="tokenSupply" 
                type="number"
                min="0"
                placeholder="Enter initial token supply" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
          </>
        )
      case 'Governance':
        return (
          <>
            <div>
              <Label htmlFor="proposalType" className={isDarkMode ? 'text-gray-300' : ''}>Proposal Type</Label>
              <Select>
                <SelectTrigger id="proposalType" className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                  <SelectValue placeholder="Select proposal type" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="text">Text Proposal</SelectItem>
                  <SelectItem value="program">Program Upgrade</SelectItem>
                  <SelectItem value="mint">Mint Tokens</SelectItem>
                  <SelectItem value="transfer">Transfer Tokens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="proposal" className={isDarkMode ? 'text-gray-300' : ''}>Proposal</Label>
              <Textarea 
                id="proposal" 
                placeholder="Enter your governance proposal" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                rows={4}
              />
            </div>
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Your BARK Balance</Label>
              <p className={isDarkMode ? 'text-white' : ''}>{barkBalance.toLocaleString()} BARK</p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Active Proposals</h3>
              {governanceProposals.map(proposal => (
                <div key={proposal.id} className="mb-4">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>{proposal.title}</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{proposal.description}</p>
                  <div className="flex items-center mt-2">
                    <Progress value={(proposal.votes / 5000000) * 100} className="flex-grow mr-2" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{proposal.votes.toLocaleString()} votes</span>
                  </div>
                  <Badge variant={proposal.status === 'Active' ? 'default' : proposal.status === 'Passed' ? 'success' : 'destructive'}>
                    {proposal.status}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )
      case 'Swap Tokens':
        return (
          <>
            <div>
              <Label htmlFor="fromAmount" className={isDarkMode ? 'text-gray-300' : ''}>From Amount</Label>
              <Input 
                id="fromAmount" 
                type="number"
                step="0.000001"
                min="0"
                placeholder={`Enter amount in ${selectedCurrency.symbol}`} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="toAmount" className={isDarkMode ? 'text-gray-300' : ''}>To Amount</Label>
              <Input 
                id="toAmount" 
                type="number"
                step="0.000001"
                min="0"
                placeholder="Enter amount to receive" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="swapProvider" className={isDarkMode ? 'text-gray-300' : ''}>Swap Provider</Label>
              <Select>
                <SelectTrigger id="swapProvider" className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                  <SelectValue placeholder="Select swap provider" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="jupiter">Jupiter</SelectItem>
                  <SelectItem value="meteora">Meteora</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case 'Stake':
      case 'Donate':
        return (
          <div>
            <Label htmlFor="amount" className={isDarkMode ? 'text-gray-300' : ''}>Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.000001"
              min="0"
              placeholder={`Enter amount in ${selectedCurrency.symbol}`} 
              className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
            />
          </div>
        )
      case 'Mint NFT':
        return (
          <>
            <div>
              <Label htmlFor="nftName" className={isDarkMode ? 'text-gray-300' : ''}>NFT Name</Label>
              <Input 
                id="nftName" 
                placeholder="Enter NFT name" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="nftDescription" className={isDarkMode ? 'text-gray-300' : ''}>NFT Description</Label>
              <Textarea 
                id="nftDescription" 
                placeholder="Enter NFT description" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                rows={3}
              />
            </div>
          </>
        )
      case 'Claim Rewards':
        return (
          <div>
            <Label className={isDarkMode ? 'text-gray-300' : ''}>Claimable Rewards</Label>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : ''}`}>{claimableRewards.toLocaleString()} BARK</p>
          </div>
        )
      case 'View Analytics':
        return (
          <div>
            <p className={isDarkMode ? 'text-gray-300' : ''}>Click the button below to view BARK ecosystem analytics.</p>
          </div>
        )
      case 'Liquidity Provision':
        return (
          <>
            <div>
              <Label htmlFor="amount1" className={isDarkMode ? 'text-gray-300' : ''}>Amount (Token 1)</Label>
              <Input 
                id="amount1" 
                type="number" 
                step="0.000001"
                min="0"
                placeholder="Enter amount for first token" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="amount2" className={isDarkMode ? 'text-gray-300' : ''}>Amount (Token 2)</Label>
              <Input 
                id="amount2" 
                type="number" 
                step="0.000001"
                min="0"
                placeholder="Enter amount for second token" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div>
              <Label htmlFor="pool" className={isDarkMode ? 'text-gray-300' : ''}>Liquidity Pool</Label>
              <Select>
                <SelectTrigger id="pool" className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                  <SelectValue placeholder="Select liquidity pool" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="bark-sol">BARK/SOL</SelectItem>
                  <SelectItem value="bark-usdc">BARK/USDC</SelectItem>
                  <SelectItem value="sol-usdc">SOL/USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-white' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Action Board</h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link href="/" passHref>
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Terms of Use
              </Button>
            </DialogTrigger>
            <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
              <DialogHeader>
                <DialogTitle>Terms of Use</DialogTitle>
                <DialogDescription>
                  Please read our terms of use carefully before using the BARK platform.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
                <p>By using the BARK platform, you agree to be bound by these Terms of Use.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">2. Use of Services</h3>
                <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">3. Privacy Policy</h3>
                <p>Your use of the BARK platform is also governed by our Privacy Policy.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4. Modifications to Terms</h3>
                <p>We reserve the right to modify these Terms at any time. Please review them regularly.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'} mb-8`}>
        Perform various actions on the Solana blockchain using our BARK Protocol interface.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : ''}>Available Actions</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>Select an action to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {actions.map((action) => (
                <Button
                  key={action.name}
                  variant={selectedAction === action.name ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center text-center ${
                    isDarkMode && selectedAction !== action.name ? 'hover:bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedAction(action.name)}
                >
                  <action.icon className={`h-6 w-6 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#D0BFB4]'}`} />
                  <span className="text-sm">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : ''}>{selectedAction} {selectedAction !== 'Governance' && selectedCurrency.symbol}</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
              {actions.find(a => a.name === selectedAction)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleActionSubmit}>
              <div className="space-y-4">
                {selectedAction !== 'Governance' && selectedAction !== 'Claim Rewards' && selectedAction !== 'View Analytics' && (
                  <div>
                    <Label htmlFor="currency" className={isDarkMode ? 'text-gray-300' : ''}>Select Currency</Label>
                    <Select
                      value={selectedCurrency.symbol}
                      onValueChange={(value) => setSelectedCurrency(currencies.find(c => c.symbol === value) || currencies[0])}
                    >
                      <SelectTrigger id="currency" className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.symbol} value={currency.symbol} className={isDarkMode ? 'text-white' : ''}>
                            <div className="flex items-center">
                              <Image
                                src={currency.icon}
                                alt={currency.name}
                                width={24}
                                height={24}
                                className="mr-2"
                              />
                              {currency.name} ({currency.symbol})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {renderActionInputs()}
              </div>
              <Tabs defaultValue="basic" className="w-full mt-4">
                <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                  <TabsTrigger value="basic" className={isDarkMode ? 'data-[state=active]:bg-gray-600' : ''}>Basic</TabsTrigger>
                  <TabsTrigger value="advanced" className={isDarkMode ? 'data-[state=active]:bg-gray-600' : ''}>Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="memo" className={isDarkMode ? 'text-gray-300' : ''}>Memo</Label>
                      <Input 
                        id="memo" 
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="Enter a memo for this transaction" 
                        className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="data" className={isDarkMode ? 'text-gray-300' : ''}>Additional Data (Optional)</Label>
                      <Input 
                        id="data" 
                        placeholder="Enter any additional data" 
                        className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fee" className={isDarkMode ? 'text-gray-300' : ''}>Custom Fee (Optional)</Label>
                      <Input 
                        id="fee" 
                        type="number"
                        step="0.000001"
                        min="0"
                        placeholder="Enter custom fee" 
                        className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="simulation-mode"
                  checked={isSimulation}
                  onCheckedChange={setIsSimulation}
                />
                <Label htmlFor="simulation-mode" className={isDarkMode ? 'text-gray-300' : ''}>Simulation Mode</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
                    </TooltipTrigger>
                    <TooltipContent className={isDarkMode ? 'bg-gray-700 text-white' : ''}>
                      <p>Simulation mode allows you to test actions without executing them on the Solana blockchain.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleActionSubmit} className="w-full">
              {isSimulation ? 'Simulate' : 'Execute'} {selectedAction} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Recent Actions</h2>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className={`h-12 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
            <Skeleton className={`h-12 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
            <Skeleton className={`h-12 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
          </div>
        ) : recentActions.length > 0 ? (
          <AnimatePresence>
            {recentActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`mb-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>{action.action}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        action.status === 'Completed' ? 'default' : 
                        action.status === 'Simulated' ? 'secondary' : 
                        'outline'
                      }
                      className={isDarkMode ? 'border-gray-600' : ''}
                    >
                      {action.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Alert className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className={isDarkMode ? 'text-white' : ''}>No recent actions</AlertTitle>
            <AlertDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Your executed actions will appear here once you perform them.
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  )
}