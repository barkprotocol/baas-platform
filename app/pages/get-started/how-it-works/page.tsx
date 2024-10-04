'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Code, Shield, Coins, PlusCircle, Landmark } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Start by connecting your Solana wallet to the BARK BaaS Platform.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Choose Your Service",
    description: "Select from our range of blockchain services including payments, NFTs, and crowdfunding.",
    icon: <Code className="h-6 w-6" />,
  },
  {
    title: "Integrate API",
    description: "Use our simple API to integrate BARK Protocol into your application.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Test and Deploy",
    description: "Test your integration in our sandbox environment, then deploy to production.",
    icon: <Coins className="h-6 w-6" />,
  },
  {
    title: "Monitor and Scale",
    description: "Use our dashboard to monitor your blockchain activities and scale as needed.",
    icon: <PlusCircle className="h-6 w-6" />,
  },
]

const features = [
  {
    title: "Instant Payments",
    description: "Process payments in seconds with minimal fees using Solana's high-speed network.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "NFT Minting",
    description: "Create and manage unique digital assets with our easy-to-use NFT minting service.",
    icon: <PlusCircle className="h-6 w-6" />,
  },
  {
    title: "Crowdfunding",
    description: "Launch and manage decentralized crowdfunding campaigns with ease.",
    icon: <Landmark className="h-6 w-6" />,
  },
]

export default function HowItWorksPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">How BARK BaaS Works</h1>
      
      <div className="max-w-3xl mx-auto mb-16">
        <p className="text-lg text-center text-muted-foreground mb-8">
          BARK BaaS (Blockchain as a Service) simplifies blockchain integration, allowing you to focus on building great applications without worrying about the underlying infrastructure.
        </p>
        
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
      
      <div className="grid gap-8 md:grid-cols-3 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {feature.icon}
                  <span className="ml-2">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/get-started">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}