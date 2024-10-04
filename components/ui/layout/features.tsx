'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, Code, ShieldCheck, Zap, Sparkles, Layers, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"

const features = [
  {
    icon: <Hourglass className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Experience blazing fast performance with our optimized platform, powered by Solana's high-speed blockchain. Process thousands of transactions per second with minimal latency.",
    link: "/features/performance",
    details: "Our platform leverages Solana's innovative Proof of History (PoH) consensus mechanism, enabling unparalleled transaction speeds and throughput in the blockchain space."
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "User Friendly",
    description: "Tailor our solution to fit your unique business needs with ease, thanks to our intuitive API and comprehensive documentation. Get started quickly with our developer-friendly tools.",
    link: "/features/api",
    details: "We provide SDKs for popular programming languages, interactive API documentation, and a playground environment for testing and prototyping your blockchain applications."
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Reliable & Secure",
    description: "Count on our robust infrastructure for uninterrupted service, backed by enterprise-grade security and 24/7 support. Benefit from Solana's proven track record of stability and security.",
    link: "/features/security",
    details: "Our platform implements multi-layer security protocols, regular security audits, and encrypted data storage to ensure the highest level of protection for your blockchain assets and data."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Solana Actions",
    description: "Leverage the power of Solana's fast and efficient blockchain with our streamlined action system. Execute complex operations with ease and minimal gas fees.",
    link: "/features/solana-actions",
    details: "Solana Actions provide a high-level abstraction for common blockchain operations, allowing developers to focus on business logic rather than low-level blockchain interactions."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Blinks",
    description: "Utilize our innovative Blinks feature for instant, atomic swaps and cross-chain transactions. Seamlessly interact with multiple blockchains in a single, cohesive ecosystem.",
    link: "/features/blinks",
    details: "Blinks enable trustless, decentralized cross-chain operations, opening up new possibilities for DeFi applications, NFT marketplaces, and multi-chain dApps."
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Scalable Architecture",
    description: "Build with confidence on our highly scalable infrastructure. Our multi-layered architecture ensures your applications can grow seamlessly, handling increased load and complexity with ease.",
    link: "/features/scalability",
    details: "Our platform utilizes horizontal scaling, load balancing, and caching strategies to ensure your applications can handle millions of users and transactions without compromising performance."
  }
]

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const handleLearnMore = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
    toast({
      title: `Exploring ${features[index].title}`,
      description: "Expand the card to learn more about this feature.",
      duration: 3000,
    })
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-semibold">
            Powerful Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
            Key Features
          </h2>
          <p className="mt-4 text-[#D0BFB4] md:text-lg max-w-3xl mx-auto">
            Discover how our platform can revolutionize your blockchain experience with these powerful features.
          </p>
        </motion.div>
        <motion.div 
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              details={feature.details}
              isHovered={hoveredIndex === index}
              isExpanded={expandedIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
              onExpand={() => handleLearnMore(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  details: string
  isHovered: boolean
  isExpanded: boolean
  onHover: () => void
  onLeave: () => void
  onExpand: () => void
}

function FeatureCard({ icon, title, description, link, details, isHovered, isExpanded, onHover, onLeave, onExpand }: FeatureCardProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className="flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-xl border-primary/10"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <CardHeader className="pb-2 flex flex-col items-center">
          <motion.div 
            className="w-12 h-12 flex items-center justify-center mb-4 bg-secondary/10 rounded-full"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-secondary">{icon}</div>
          </motion.div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <p className="text-[#D0BFB4] mb-4">{description}</p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger
                onClick={onExpand}
                className="text-sm font-medium text-secondary hover:underline"
              >
                Learn More
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-[#D0BFB4] mt-2">{details}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="w-full">
          <Link href={link} passHref className="w-full">
            <Button variant="outline" className="w-full">
              Explore Feature <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}