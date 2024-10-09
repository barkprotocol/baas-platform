'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Zap, Coins, Code, Gift, Repeat, Paintbrush, ArrowRight, Search, ArrowLeft, Moon, Sun, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

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
    ],
    status: 'active'
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
    ],
    status: 'beta'
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
    ],
    status: 'active'
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
    ],
    status: 'coming soon'
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
    ],
    status: 'active'
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
    ],
    status: 'active'
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
    ],
    status: 'beta'
  }
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("actions-&-blinks")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()

  // Memoize filtered services to improve performance
  const filteredServices = useMemo(() => {
    return services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    if (filteredServices.length > 0) {
      setActiveTab(filteredServices[0].title.toLowerCase().replace(/\s+/g, '-'))
    }
  }, [filteredServices])

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const handleServiceAction = useCallback((service: string) => {
    // Simulating an API call or action
    toast({
      title: "Service Action",
      description: `You've interacted with the ${service} service. This is where we'd handle the specific action.`,
      duration: 3000,
    })
  }, [toast])

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-sand-900 text-sand-100' : 'bg-sand-50 text-sand-900'}`}>
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
            <Label htmlFor="dark-mode" className="sr-only">
              Toggle dark mode
            </Label>
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">Our Services</h1>
          <p className="text-lg sm:text-xl mb-12 text-center max-w-3xl mx-auto">
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
              onChange={(e) => handleSearch(e.target.value)}
              className={`pl-10 ${isDarkMode ? 'bg-sand-800 border-sand-700' : 'bg-white border-sand-200'} focus:border-sand-400`}
              aria-label="Search services"
            />
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full mb-6">
            <TabsList className={`flex justify-center p-1 rounded-lg ${isDarkMode ? 'bg-sand-800' : 'bg-sand-100'}`}>
              {filteredServices.map((service, index) => (
                <TabsTrigger
                  key={index}
                  value={service.title.toLowerCase().replace(/\s+/g, '-')}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    isDarkMode
                      ? 'data-[state=active]:bg-sand-700 data-[state=active]:text-sand-100'
                      : 'data-[state=active]:bg-white data-[state=active]:text-sand-900'
                  }`}
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
                  <Card className={`mt-4 shadow-lg ${isDarkMode ? 'bg-sand-800' : 'bg-white'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <service.icon className="w-8 h-8" style={{ color: iconColor }} aria-hidden="true" />
                          <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                        </div>
                        <Badge 
                          variant={
                            service.status === 'active' ? 'default' : 
                            service.status === 'beta' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <CardDescription className={`mt-2 ${isDarkMode ? 'text-sand-300' : 'text-sand-600'}`}>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2" aria-label={`Features of ${service.title}`}>
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                            className={`flex items-center space-x-2 ${isDarkMode ? 'text-sand-200' : 'text-sand-700'}`}
                          >
                            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-sand-400' : 'text-sand-500'}`} aria-hidden="true" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full mt-4 bg-sand-600 hover:bg-sand-700 text-white">
                                  Learn More
                                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className={isDarkMode ? 'bg-sand-800 text-sand-100' : 'bg-white text-sand-900'}>
                                <DialogHeader>
                                  <DialogTitle>{service.title}</DialogTitle>
                                  <DialogDescription>
                                    {service.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {service.features.map((feature, index) => (
                                      <li key={index}>{feature}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="mt-4">
                                  <p>For more information or to get started with {service.title}, please contact our sales team.</p>
                                </div>
                                <Button 
                                  className="w-full mt-4 bg-sand-600 hover:bg-sand-700 text-white"
                                  onClick={() => handleServiceAction(service.title)}
                                >
                                  Get Started
                                </Button>
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent className={isDarkMode ? 'bg-sand-700 text-sand-100' : 'bg-sand-100 text-sand-900'}>
                            Click to learn more about {service.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8"
          >
            <p className={`text-xl ${isDarkMode ? 'text-sand-400' : 'text-sand-600'}`}>
              No services found matching your search.
            </p>
          </motion.div>
        )}
      </main>

      <footer className={`py-8 ${isDarkMode ? 'bg-sand-800' : 'bg-sand-100'}`}>
        <div className="container mx-auto  px-4">
          <div className="flex justify-center items-center">
            <p className={`text-sm ${isDarkMode ? 'text-sand-300' : 'text-sand-600'}`}>
              Powered by Solana
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}