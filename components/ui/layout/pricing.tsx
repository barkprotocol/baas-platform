'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, HelpCircle, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from 'next-themes'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface PricingPlan {
  name: string
  description: string
  priceMonthly: { SOL: number; USDC: number }
  priceYearly: { SOL: number; USDC: number }
  features: string[]
  barkRewards: number
  maxBlinks: number
  blinkboardFeatures: string[]
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    description: "For individuals and small teams exploring BARK Blinks",
    priceMonthly: { SOL: 0.1935, USDC: 30.00 },
    priceYearly: { SOL: 1.935, USDC: 300.00 },
    features: [
      "Up to 10,000 Blinks per month",
      "Basic Blinkboard analytics",
      "Community support",
      "Send 10 Blinks monthly",
      "API access (100 requests/day)",
    ],
    barkRewards: 5000,
    maxBlinks: 10000,
    blinkboardFeatures: [
      "Basic donations",
      "Simple token swaps",
      "Starter staking options",
    ],
  },
  {
    name: "Pro",
    description: "For growing projects leveraging BARK Blinks",
    priceMonthly: { SOL: 0.6452, USDC: 100.00 },
    priceYearly: { SOL: 6.452, USDC: 1000.00 },
    features: [
      "Up to 100,000 Blinks per month",
      "Advanced Blinkboard analytics",
      "Priority email support",
      "Send 50 Blinks monthly",
      "API access (1,000 requests/day)",
      "Custom integrations",
    ],
    barkRewards: 20000,
    maxBlinks: 100000,
    blinkboardFeatures: [
      "Advanced donations with recurring options",
      "Multi-token swaps",
      "Enhanced staking features",
      "Basic crowdfunding campaigns",
    ],
  },
  {
    name: "Enterprise",
    description: "For large-scale BARK Blinks operations",
    priceMonthly: { SOL: 2.2581, USDC: 350.00 },
    priceYearly: { SOL: 22.581, USDC: 3500.00 },
    features: [
      "Unlimited Blinks",
      "Real-time Blinkboard analytics",
      "Send unlimited Blinks monthly",
      "Unlimited API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    barkRewards: 100000,
    maxBlinks: Infinity,
    blinkboardFeatures: [
      "Enterprise-grade donation management",
      "Advanced DeFi integrations for swaps",
      "Custom staking programs",
      "Full-featured crowdfunding platform",
      "Integrated payment solutions",
    ],
  },
]

const barkPriceUSD = 0.0001
const solPriceUSD = 155
const iconColor = "#BBA597"

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'SOL' | 'USDC'>('SOL')
  const { theme } = useTheme()

  const formatCurrency = (value: number, currency: 'SOL' | 'USDC') => {
    if (currency === 'SOL') {
      return value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    } else {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString('en-US')
  }

  const getUSDEquivalent = (value: number, currency: 'SOL' | 'USDC') => {
    return currency === 'SOL' ? value * solPriceUSD : value
  }

  const calculateSavings = (plan: PricingPlan) => {
    const monthlyCost = plan.priceMonthly[selectedCurrency] * 12
    const yearlyCost = plan.priceYearly[selectedCurrency]
    const savings = monthlyCost - yearlyCost
    return formatCurrency(savings, selectedCurrency)
  }

  const calculateAPY = (barkRewards: number, price: number) => {
    const annualRewards = barkRewards * 12
    const annualRewardsValue = annualRewards * barkPriceUSD
    return ((annualRewardsValue / getUSDEquivalent(price, selectedCurrency)) * 100).toFixed(2)
  }

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-sand-50 dark:bg-sand-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 text-sand-900 dark:text-sand-100">
          BARK: Blinkboard Pricing
        </h2>
        <p className="text-xl text-sand-700 dark:text-sand-300 text-center mb-8 md:mb-12 lg:mb-16">
          Choose the plan that fits your BARK Blinks and Blinkboard needs
        </p>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Label htmlFor="billing-toggle" className="text-sm font-medium text-sand-800 dark:text-sand-200">
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={() => setIsYearly(!isYearly)}
          />
          <Label htmlFor="billing-toggle" className="text-sm font-medium text-sand-800 dark:text-sand-200">
            Yearly <span className="text-primary">(Save up to 20%)</span>
          </Label>
        </div>
        <Tabs defaultValue="SOL" className="w-full mb-8" onValueChange={(value) => setSelectedCurrency(value as 'SOL' | 'USDC')}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
            <TabsTrigger value="SOL">SOL</TabsTrigger>
            <TabsTrigger value="USDC">USDC</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="flex flex-col bg-white dark:bg-[#010101] border border-sand-200 dark:border-sand-700">
              <CardHeader>
                <CardTitle className="text-sand-900 dark:text-sand-100">{plan.name}</CardTitle>
                <CardDescription className="text-sand-600 dark:text-sand-300">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col items-start mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-sand-900 dark:text-sand-100">
                    {formatCurrency(
                      isYearly ? plan.priceYearly[selectedCurrency] : plan.priceMonthly[selectedCurrency],
                      selectedCurrency
                    )}
                    <span className="text-lg sm:text-xl font-normal ml-1">{selectedCurrency}</span>
                  </div>
                  <div className="text-sm text-sand-600 dark:text-sand-400">
                    {isYearly ? '/year' : '/month'}
                  </div>
                </div>
                <div className="text-sm text-sand-600 dark:text-sand-400 mb-4">
                  ≈ ${getUSDEquivalent(
                    isYearly ? plan.priceYearly[selectedCurrency] : plan.priceMonthly[selectedCurrency],
                    selectedCurrency
                  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
                {isYearly && (
                  <Badge variant="secondary" className="mb-4 bg-sand-200 dark:bg-sand-700 text-sand-800 dark:text-sand-200">
                    Save {calculateSavings(plan)} {selectedCurrency} per year
                  </Badge>
                )}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 text-sand-800 dark:text-sand-200">BARK Blinks Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                        <span className="text-sm text-sand-700 dark:text-sand-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 text-sand-800 dark:text-sand-200">Blinkboard Features</h4>
                  <ul className="space-y-2">
                    {plan.blinkboardFeatures.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                        <span className="text-sm text-sand-700 dark:text-sand-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2 text-sand-800 dark:text-sand-200">BARK Rewards</h4>
                  <p className="text-sm text-sand-600 dark:text-sand-400">Earn up to {formatNumber(plan.barkRewards)} BARK tokens monthly</p>
                  <p className="text-xs text-sand-600 dark:text-sand-400 mt-1">
                    APY: {calculateAPY(plan.barkRewards, isYearly ? plan.priceYearly[selectedCurrency] : plan.priceMonthly[selectedCurrency])}%
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Zap className="mr-2 h-4 w-4" />
                  Get Started with BARK Blinks
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className="text-sm text-sand-700 dark:text-sand-300">
                  Need help choosing your BARK Blinks plan? <HelpCircle className="ml-1 h-4 w-4" style={{ color: iconColor }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contact us for personalized assistance with BARK Blinks and Blinkboard features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  )
}