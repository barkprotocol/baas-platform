'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Plus, List, Eye, Zap, BarChart2, ArrowLeft, QrCode, CreditCard, Settings, Send, Share2, DollarSign, Repeat, Shield, Search } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { CreateSolanaPayQRCode } from "@/components/payments/solana-pay/create-solana-pay-qr-code"
import { useToast } from "@/components/ui/use-toast"

const iconColor = "#D0BFB4"
const barkIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const cards = [
  {
    title: "Create a Blink",
    description: "Set up a new BARK BLINK for instant transactions.",
    content: "Create a unique Blink link that allows instant payments or interactions on social media platforms using Solana Actions.",
    icon: <Plus className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/create",
    buttonText: "Create Blink",
  },
  {
    title: "Manage Blinks",
    description: "View and edit your existing BARK BLINKS.",
    content: "Access your dashboard to manage all your created Blinks, view statistics, and make updates to your Solana Actions.",
    icon: <List className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/manage",
    buttonText: "Manage Blinks",
  },
  {
    title: "View Blink Example",
    description: "See how a BARK BLINK works in action.",
    content: "Explore a demo Blink to understand how users will interact with your created Blinks and Solana Actions.",
    icon: <Eye className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/example",
    buttonText: "View Example",
  },
  {
    title: "Blink Analytics",
    description: "Track the performance of your BARK BLINKS.",
    content: "Get detailed insights into your Blinks' usage, engagement rates, and transaction volumes to optimize your strategies.",
    icon: <BarChart2 className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/analytics",
    buttonText: "View Analytics",
  },
  {
    title: "Generate QR Code",
    description: "Create a QR code for easy Blink sharing.",
    content: "Generate a custom QR code for your Blink to facilitate easy scanning and instant transactions.",
    icon: <QrCode className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/qr-code",
    buttonText: "Generate QR",
  },
  {
    title: "Payment Settings",
    description: "Configure your payment preferences.",
    content: "Set up and manage your payment options, including supported tokens and transaction limits.",
    icon: <CreditCard className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/payment-settings",
    buttonText: "Configure",
  },
  {
    title: "Blink Customization",
    description: "Personalize your Blink appearance and behavior.",
    content: "Customize the look and feel of your Blinks, including themes, logos, and interaction flows.",
    icon: <Settings className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/customize",
    buttonText: "Customize",
  },
  {
    title: "Send Blink",
    description: "Instantly send a Blink to a recipient.",
    content: "Quickly send a Blink to another user or platform, facilitating instant transactions or interactions.",
    icon: <Send className="h-6 w-6 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
    link: "/blinks/send",
    buttonText: "Send Now",
  },
]

const whyUseBlinks = [
  {
    title: "Lightning-Fast Transactions",
    description: "Experience near-instantaneous transactions with Solana's high-speed network, enabling real-time payments and interactions.",
    icon: <Zap className="h-5 w-5 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Minimal Fees",
    description: "Benefit from Solana's low transaction costs, making micro-transactions and frequent use economically viable.",
    icon: <DollarSign className="h-5 w-5 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Social Media Integration",
    description: "Seamlessly integrate BARK BLINKS into popular social media platforms, enabling easy sharing and viral growth.",
    icon: <Share2 className="h-5 w-5 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Versatile Use Cases",
    description: "From simple payments to complex smart contract interactions, BARK BLINKS adapt to various scenarios including tipping, subscriptions, and more.",
    icon: <Repeat className="h-5 w-5 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "Enhanced Security",
    description: "Leverage Solana's robust blockchain technology for secure, transparent, and tamper-proof transactions.",
    icon: <Shield className="h-5 w-5 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
  },
  {
    title: "User-Friendly Experience",
    description: "Enjoy a smooth, intuitive interface that makes blockchain interactions accessible to both crypto novices and experts.",
    icon: <Eye className="h-5 w-5 mr-2" style={{ color: iconColor }} aria-hidden="true" />,
  },
]

export default function BlinksPage() {
  const [isBlinkVisible, setIsBlinkVisible] = useState(true)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCards, setFilteredCards] = useState(cards)
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinkVisible(v => !v)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleGenerateQR = useCallback(() => {
    setShowQRCode(true)
  }, [])

  const handleCloseQR = useCallback(() => {
    setShowQRCode(false)
  }, [])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = cards.filter(card => 
      card.title.toLowerCase().includes(term) || 
      card.description.toLowerCase().includes(term) ||
      card.content.toLowerCase().includes(term)
    )
    setFilteredCards(filtered)
  }, [])

  const handleCardAction = useCallback((title: string) => {
    toast({
      title: `Action: ${title}`,
      description: "This feature is coming soon!",
    })
  }, [toast])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={barkIconUrl} alt="BARK BLINKS icon" width={50} height={50} className="mr-4" />
          <h1 className="text-4xl font-bold">
            BARK <span className={`font-light ${isBlinkVisible ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300`}>BLINKS</span>
          </h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button asChild variant="outline" className="flex items-center">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
              Back to Main
            </Link>
          </Button>
        </div>
      </div>

      <motion.p 
        className="text-xl mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Create and manage instant, social media-based blockchain transactions with BARK BLINKS, powered by Solana Actions.
      </motion.p>

      <div className="mb-6">
        <Label htmlFor="search" className="sr-only">Search Blinks</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="search"
            type="search"
            placeholder="Search Blinks..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence>
          {filteredCards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{card.content}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleCardAction(card.title)}>
                    {card.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Why Use BARK BLINKS?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyUseBlinks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {item.icon}
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button asChild size="lg">
          <Link href="/docs/blinks">
            Learn More About BARK BLINKS
            <ArrowRight className="ml-2 h-4 w-4" style={{ color: iconColor }} aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>

      {showQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Generate QR Code</h2>
            <CreateSolanaPayQRCode />
            <Button onClick={handleCloseQR} className="mt-4 w-full">Close</Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}