'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Zap, Coins, Code, Gift, Repeat, Paintbrush, ArrowRight, Search, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

const iconColor = "#d0bfb4"

const services = [
  {
    title: "Actions & Blinks",
    description: "Leverage the power of Solana blockchain with our Actions and Blinks services.",
    icon: Zap,
    features: [
      "Fast and efficient blockchain transactions",
      "Customizable Blinks for various use cases",
      "Seamless integration with BARK Protocol ecosystem",
      "Real-time transaction monitoring"
    ]
  },
  {
    title: "API & SDK",
    description: "Integrate BARK BaaS into your applications with our comprehensive API and SDK.",
    icon: Code,
    features: [
      "RESTful API for blockchain interactions",
      "SDK support for multiple programming languages",
      "Extensive documentation and code samples",
      "Webhooks for real-time event notifications"
    ]
  },
  {
    title: "DeFi Solutions",
    description: "Explore decentralized finance opportunities with our DeFi services.",
    icon: Coins,
    features: [
      "Yield farming and liquidity provision",
      "Decentralized lending and borrowing",
      "Automated market making (AMM)",
      "Cross-chain DeFi integrations"
    ]
  },
  {
    title: "Social Finance",
    description: "Empower your community with blockchain-based social finance tools.",
    icon: Gift,
    features: [
      "Peer-to-peer payments and tipping",
      "Social tokens and creator economies",
      "Decentralized reputation systems",
      "Community-driven fundraising"
    ]
  },
  {
    title: "Donations & Crowdfunding",
    description: "Revolutionize charitable giving and crowdfunding with blockchain technology.",
    icon: Gift,
    features: [
      "Transparent and traceable donations",
      "Smart contract-based crowdfunding campaigns",
      "Automated fund distribution",
      "Integration with existing donation platforms"
    ]
  },
  {
    title: "Token Swap",
    description: "Facilitate seamless token exchanges with our swap services.",
    icon: Repeat,
    features: [
      "Multi-token swap functionality",
      "Automated price discovery and liquidity",
      "Cross-chain token swaps",
      "Integration with Jupiter Terminal API"
    ]
  },
  {
    title: "NFT Services",
    description: "Unlock the potential of non-fungible tokens with our comprehensive NFT solutions.",
    icon: Paintbrush,
    features: [
      "NFT minting and deployment",
      "Marketplace development and integration",
      "Royalty management for creators",
      "NFT-based loyalty and reward programs"
    ]
  }
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("actions-&-blinks")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)
  const { toast } = useToast()

  const handleSearch = useCallback((term: string) => {
    try {
      const filtered = services.filter(service =>
        service.title.toLowerCase().includes(term.toLowerCase()) ||
        service.description.toLowerCase().includes(term.toLowerCase()) ||
        service.features.some(feature => feature.toLowerCase().includes(term.toLowerCase()))
      )
      setFilteredServices(filtered)
      if (filtered.length > 0) {
        setActiveTab(filtered[0].title.toLowerCase().replace(/\s+/g, '-'))
      }
    } catch (error) {
      console.error('Error filtering services:', error)
      toast({
        title: "Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])

  return (
    <div className="flex flex-col min-h-screen bg-sand-50 dark:bg-sand-900">
      <main className="flex-grow container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Main
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-sand-800 dark:text-sand-100 mb-8 text-center">Our Services</h1>
          <p className="text-lg sm:text-xl text-sand-600 dark:text-sand-300 mb-12 text-center max-w-3xl mx-auto">
            Explore the wide range of blockchain services offered by BARK BaaS, powered by Solana technology.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 max-w-md mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sand-400" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-sand-800 border-sand-200 dark:border-sand-700 focus:border-sand-400 dark:focus:border-sand-500"
              aria-label="Search services"
            />
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full mb-6">
            <TabsList className="flex justify-start p-1 bg-sand-100 dark:bg-sand-800 rounded-lg">
              {filteredServices.map((service, index) => (
                <TabsTrigger
                  key={index}
                  value={service.title.toLowerCase().replace(/\s+/g, '-')}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-sand-700 data-[state=active]:text-sand-900 dark:data-[state=active]:text-sand-100 whitespace-nowrap"
                >
                  {service.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          <AnimatePresence mode="wait">
            {filteredServices.map((service, index) => (
              <TabsContent
                key={service.title}
                value={service.title.toLowerCase().replace(/\s+/g, '-')}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white dark:bg-sand-800 mt-4 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <service.icon className="w-8 h-8" style={{ color: iconColor }} aria-hidden="true" />
                        <CardTitle className="text-2xl font-bold text-sand-800 dark:text-sand-100">{service.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sand-600 dark:text-sand-300 mt-2">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2" aria-label={`Features of ${service.title}`}>
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                            className="flex items-center space-x-2 text-sand-700 dark:text-sand-200"
                          >
                            <ChevronRight className="w-4 h-4 text-sand-500 dark:text-sand-400 flex-shrink-0" aria-hidden="true" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full mt-4 bg-sand-600 hover:bg-sand-700 text-white">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </main>

      <footer className="bg-sand-100 dark:bg-sand-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <p className="text-sand-600 dark:text-sand-300 text-sm">
              © {new Date().getFullYear()} BARK BaaS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}