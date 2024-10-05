'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, HelpCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from 'next-themes'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small projects and startups",
    priceMonthly: { SOL: 1, USDC: 50, BARK: 100000 },
    priceYearly: { SOL: 10, USDC: 500, BARK: 1000000 },
    features: [
      "Up to 1,000 transactions per month",
      "Basic analytics",
      "Email support",
      "1 project",
    ],
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses",
    priceMonthly: { SOL: 5, USDC: 250, BARK: 500000 },
    priceYearly: { SOL: 50, USDC: 2500, BARK: 5000000 },
    features: [
      "Up to 10,000 transactions per month",
      "Advanced analytics",
      "Priority email support",
      "5 projects",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    priceMonthly: { SOL: 20, USDC: 1000, BARK: 2000000 },
    priceYearly: { SOL: 200, USDC: 10000, BARK: 20000000 },
    features: [
      "Unlimited transactions",
      "Real-time analytics",
      "24/7 phone and email support",
      "Unlimited projects",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
]

const barkPriceUSD = 0.00001
const iconColor = "#BBA597"

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'SOL' | 'USDC' | 'BARK'>('SOL')
  const { theme } = useTheme()

  const formatCurrency = (value: number, currency: 'SOL' | 'USDC' | 'BARK') => {
    switch (currency) {
      case 'SOL':
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')
      case 'USDC':
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')
      case 'BARK':
        return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }
  }

  const getUSDEquivalent = (value: number, currency: 'SOL' | 'USDC' | 'BARK') => {
    switch (currency) {
      case 'SOL':
        return value * 50 // Assuming 1 SOL = $50 USD
      case 'USDC':
        return value
      case 'BARK':
        return value * barkPriceUSD
    }
  }

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-8 md:mb-12 lg:mb-16">
          Choose the plan that's right for your business
        </p>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Label htmlFor="billing-toggle" className="text-sm font-medium">
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={() => setIsYearly(!isYearly)}
          />
          <Label htmlFor="billing-toggle" className="text-sm font-medium">
            Yearly <span className="text-primary">(Save 20%)</span>
          </Label>
        </div>
        <Tabs defaultValue="SOL" className="w-full mb-8" onValueChange={(value) => setSelectedCurrency(value as 'SOL' | 'USDC' | 'BARK')}>
          <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
            <TabsTrigger value="SOL">SOL</TabsTrigger>
            <TabsTrigger value="USDC">USDC</TabsTrigger>
            <TabsTrigger value="BARK">BARK</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="flex flex-col bg-white dark:bg-[#010101] border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col items-start mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(
                      isYearly ? plan.priceYearly[selectedCurrency] : plan.priceMonthly[selectedCurrency],
                      selectedCurrency
                    )}
                    <span className="text-lg sm:text-xl font-normal ml-1">{selectedCurrency}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isYearly ? '/year' : '/month'}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  ≈ ${getUSDEquivalent(
                    isYearly ? plan.priceYearly[selectedCurrency] : plan.priceMonthly[selectedCurrency],
                    selectedCurrency
                  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
                <ul className="space-y-2 mt-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4" style={{ color: iconColor }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className="text-sm text-muted-foreground">
                  Need help choosing? <HelpCircle className="ml-1 h-4 w-4" style={{ color: iconColor }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contact our sales team for personalized assistance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  )
}