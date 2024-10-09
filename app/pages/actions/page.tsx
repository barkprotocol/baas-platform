'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'
import ActionSelector from '@/components/actions/action-selector'
import ActionForm from '@/components/actions/action-form'
import RecentActions from '@/components/actions/recent-actions'
import DarkModeToggle from '@/components/actions/dark-mode-toggle'
import TermsOfUseDialog from '@/components/actions/terms-of-use'
import { Action, Currency, ActionResult } from '@/types/actionboard'
import { actions, currencies } from '@/data/actionboard'

export default function ActionsPage() {
  const [selectedAction, setSelectedAction] = useState<Action>(actions[0])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [recentActions, setRecentActions] = useState<ActionResult[]>([])
  const [isSimulation, setIsSimulation] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [memo, setMemo] = useState<string>('')
  const [barkBalance, setBarkBalance] = useState<number>(0)
  const [governanceProposals, setGovernanceProposals] = useState<any[]>([])
  const [claimableRewards, setClaimableRewards] = useState<number>(0)
  const [subscriptionTier, setSubscriptionTier] = useState<'Starter' | 'Pro' | 'Enterprise'>('Starter');
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API calls
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setRecentActions([
          { id: 1, action: 'Transfer SPL Tokens', status: 'Completed', timestamp: new Date().toISOString() },
          { id: 2, action: 'Create SPL Token', status: 'Pending', timestamp: new Date().toISOString() },
        ])
        setBarkBalance(750000)
        setGovernanceProposals([
          { id: 1, title: 'Increase Staking Rewards', description: 'Proposal to increase staking rewards by 2%', votes: 1500000, status: 'Active' },
          { id: 2, title: 'New Partnership', description: 'Establish partnership with DEX aggregator', votes: 2000000, status: 'Passed' },
        ])
        setClaimableRewards(5000)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load initial data. Please try again.',
          variant: 'destructive',
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleActionSubmit = async (formData: any) => {
    const actionMessage = isSimulation ? "simulated" : "submitted"
    
    try {
      setIsLoading(true)
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const result = {
        success: true,
        message: `${selectedAction.name} ${actionMessage} successfully.`
      }

      toast({
        title: result.success ? `Action ${actionMessage}` : 'Action Failed',
        description: result.message,
        duration: 5000,
      })

      if (result.success) {
        setRecentActions(prev => [{
          id: prev.length + 1,
          action: `${selectedAction.name} ${selectedCurrency.symbol}`,
          status: isSimulation ? 'Simulated' : 'Pending',
          timestamp: new Date().toISOString()
        }, ...prev])

        // Update balances or other state based on the action
        if (!isSimulation) {
          if (selectedAction.name === 'Transfer') {
            setBarkBalance(prev => prev - (formData.amount || 0))
          } else if (selectedAction.name === 'Claim Rewards') {
            setBarkBalance(prev => prev + claimableRewards)
            setClaimableRewards(0)
          }
        }
      }
    } catch (error) {
      console.error('Error submitting action:', error)
      toast({
        title: 'Action Failed',
        description: 'An error occurred while processing your action. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTierChange = (newTier: 'Starter' | 'Pro' | 'Enterprise') => {
    setSubscriptionTier(newTier);
    toast({
      title: `Subscription Tier Changed`,
      description: `You have switched to the ${newTier} tier.`,
      duration: 3000,
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold text-sand-900 dark:text-sand-100 mb-4 sm:mb-0">Action Board</h1>
        <div className="flex items-center space-x-4">
          <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Link href="/" passHref>
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main
            </Button>
          </Link>
          <TermsOfUseDialog isDarkMode={isDarkMode} />
        </div>
      </motion.div>
      <p className="text-sand-700 dark:text-sand-300 mb-8">
        Perform various actions on the Solana blockchain using our BARK Protocol interface.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-sand-800 border-sand-200 dark:border-sand-700">
          <CardHeader>
            <CardTitle className="text-sand-900 dark:text-sand-100">Available Actions</CardTitle>
            <CardDescription className="text-sand-600 dark:text-sand-400">Select an action to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <ActionSelector
              actions={actions}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
              isDarkMode={isDarkMode}
            />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-sand-800 border-sand-200 dark:border-sand-700">
          <CardHeader>
            <CardTitle className="text-sand-900 dark:text-sand-100">
              {selectedAction.name} {selectedAction.name !== 'Governance' && selectedCurrency.symbol}
            </CardTitle>
            <CardDescription className="text-sand-600 dark:text-sand-400">{selectedAction.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ActionForm
              selectedAction={selectedAction}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              currencies={currencies}
              isSimulation={isSimulation}
              setIsSimulation={setIsSimulation}
              memo={memo}
              setMemo={setMemo}
              barkBalance={barkBalance}
              governanceProposals={governanceProposals}
              claimableRewards={claimableRewards}
              onSubmit={handleActionSubmit}
              isDarkMode={isDarkMode}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between my-4">
        <Button onClick={() => handleTierChange('Starter')} className={`${
          subscriptionTier === 'Starter' ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`} variant="outline">Starter</Button>
        <Button onClick={() => handleTierChange('Pro')} className={`${
          subscriptionTier === 'Pro' ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`} variant="outline">Pro</Button>
        <Button onClick={() => handleTierChange('Enterprise')} className={`${
          subscriptionTier === 'Enterprise' ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`} variant="outline">Enterprise</Button>
      </div>

      <RecentActions
        isLoading={isLoading}
        recentActions={recentActions}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}
