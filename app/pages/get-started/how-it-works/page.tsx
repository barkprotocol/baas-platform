'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Zap, Code, Shield, Coins, PlusCircle, Landmark, BarChart2, Lock, Globe, Gift, ShoppingCart, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from 'next/link'

const iconColor = "#D0BFB4"

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Start by connecting your Solana wallet to the BARK BaaS Platform.",
    icon: <Zap className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Choose Your Service",
    description: "Select from our range of blockchain services including payments, NFTs, and crowdfunding.",
    icon: <Code className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Integrate API",
    description: "Use our simple API to integrate BARK Protocol into your application.",
    icon: <Shield className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Test and Deploy",
    description: "Test your integration in our sandbox environment, then deploy to production.",
    icon: <Coins className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Monitor and Scale",
    description: "Use our dashboard to monitor your blockchain activities and scale as needed.",
    icon: <PlusCircle className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
]

const features = [
  {
    title: "Instant Payments",
    description: "Process payments in seconds with minimal fees using Solana's high-speed network.",
    icon: <Zap className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "NFT Minting",
    description: "Create and manage unique digital assets with our easy-to-use NFT minting service.",
    icon: <PlusCircle className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Crowdfunding",
    description: "Launch and manage decentralized crowdfunding campaigns with ease.",
    icon: <Landmark className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Real-time Analytics",
    description: "Track and analyze blockchain transactions and user engagement in real-time.",
    icon: <BarChart2 className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Enhanced Security",
    description: "Benefit from advanced security features including multi-sig wallets and fraud detection.",
    icon: <Lock className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Global Accessibility",
    description: "Reach a worldwide audience with our decentralized infrastructure.",
    icon: <Globe className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
]

const useCases = [
  {
    title: "DeFi Applications",
    description: "Build decentralized finance applications like lending platforms or decentralized exchanges.",
    icon: <Coins className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Gaming and Metaverse",
    description: "Create blockchain-based games with in-game economies and digital asset ownership.",
    icon: <PlusCircle className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Supply Chain Management",
    description: "Implement transparent and traceable supply chain solutions using blockchain technology.",
    icon: <Landmark className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Donations",
    description: "Set up transparent and efficient donation systems with real-time tracking and accountability.",
    icon: <Gift className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Commerce",
    description: "Build decentralized e-commerce platforms with secure transactions and loyalty programs.",
    icon: <ShoppingCart className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Solana Blinks Creations",
    description: "Create and manage Solana Blinks for instant, social media-based blockchain transactions.",
    icon: <MessageSquare className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />,
  },
]

const faqs = [
  {
    question: "What blockchain does BARK BaaS use?",
    answer: "BARK BaaS primarily uses the Solana blockchain for its high speed and low transaction costs.",
  },
  {
    question: "How does pricing work?",
    answer: "We offer tiered pricing based on usage. Contact our sales team for a customized quote.",
  },
  {
    question: "Is BARK BaaS suitable for enterprise use?",
    answer: "Yes, BARK BaaS is designed to scale from small projects to enterprise-level applications.",
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
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-3" aria-hidden="true">
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
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Use Cases</h2>
      
      <Tabs defaultValue="defi" className="w-full max-w-3xl mx-auto mb-16">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="gaming">Gaming</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
        </TabsList>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="commerce">Commerce</TabsTrigger>
          <TabsTrigger value="solana-blinks">Solana Blinks</TabsTrigger>
        </TabsList>
        {useCases.map((useCase, index) => (
          <TabsContent key={index} value={useCase.title.toLowerCase().replace(/\s+/g, '-')}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {useCase.icon}
                  <span className="ml-2">{useCase.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{useCase.description}</CardDescription>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mb-16">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/get-started">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}