'use client';

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { BarChart, Users, Zap, ArrowRight, Shield, Rocket, Code, Coins, Gift, Repeat, PaintBrush } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const features = {
  overview: [
    { icon: BarChart, title: "Real-time Analytics", description: "Gain insights with comprehensive blockchain analytics" },
    { icon: Users, title: "User Management", description: "Effortless user and wallet management tools" },
    { icon: Zap, title: "Programs", description: "Deploy and manage smart contracts with ease" }
  ],
  dashboard: [
    { icon: Rocket, title: "Intuitive Interface", description: "User-friendly dashboard for seamless navigation" },
    { icon: BarChart, title: "Performance Metrics", description: "Track your Solana blink performance in real-time" },
    { icon: Users, title: "Collaboration Tools", description: "Streamline teamwork with built-in collaboration features" }
  ],
  security: [
    { icon: Shield, title: "Advanced Encryption", description: "State-of-the-art encryption for data protection" },
    { icon: Users, title: "Access Control", description: "Granular access controls for enhanced security" },
    { icon: Zap, title: "Audit Logs", description: "Comprehensive audit trails for all activities" }
  ],
  integration: [
    { icon: Code, title: "API & SDK", description: "Robust API and SDK for seamless integration" },
    { icon: Zap, title: "Solana Actions", description: "Leverage Solana's speed with custom actions" },
    { icon: Repeat, title: "Cross-chain Support", description: "Interact with multiple blockchains effortlessly" }
  ],
  socialFi: [
    { icon: Coins, title: "Staking", description: "Maximize returns with staking and automated yield farming" },
    { icon: Repeat, title: "Token Swaps", description: "Effortless token exchanges across platforms" },
    { icon: Shield, title: "Risk Management", description: "Advanced tools for DeFi risk assessment" }
  ],
  nFT: [
    { icon: PaintBrush, title: "NFT Minting", description: "Create and deploy NFTs with ease" },
    { icon: Gift, title: "Marketplace Integration", description: "Seamless integration with popular NFT marketplaces" },
    { icon: Coins, title: "Royalty Management", description: "Automate royalty distributions for creators" }
  ]
}

export function About() {
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()

  const handleExplore = () => {
    toast({
      title: "Exploring Solutions",
      description: "Redirecting you to our solutions page.",
      duration: 3000,
    })
  }

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-sand-50 dark:bg-sand-900">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-sand-900 dark:text-sand-50">
            Empowering the Future of <span className="text-primary">Blockchain</span>
          </h2>
          <p className="mt-4 text-xl text-sand-700 dark:text-sand-300 max-w-3xl mx-auto">
            BARK Protocol revolutionizes blockchain integration, making it accessible and efficient for businesses of all sizes.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h3 className="text-2xl font-bold text-sand-800 dark:text-sand-100">About Our Platform</h3>
            <p className="text-gray-700 dark:text-sand-300 text-lg leading-relaxed">
              BARK BaaS (Blockchain as a Service) is a cutting-edge platform that leverages the power of Solana blockchain to provide fast, secure, and scalable solutions for businesses. Our mission is to simplify blockchain integration and empower companies to harness the full potential of decentralized technologies.
            </p>
            <div className="pt-4">
              <Link href="/solutions" passHref>
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleExplore}
                >
                  Explore Our Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Image
              src="/images/blinkboard.png"
              alt="BARK BaaS Platform Dashboard"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="rounded-2xl"
              priority
              aria-label="Screenshot of the BARK BaaS Platform Dashboard"
            />
          </motion.div>
        </div>

        <motion.div 
          className="mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-sand-800 dark:text-sand-100">Features</h3>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="inline-flex p-1 bg-sand-200 dark:bg-sand-800 rounded-full">
                {Object.keys(features).map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab}
                    className="px-6 py-1 rounded-md text-sand-700 dark:text-sand-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:bg-sand-300 dark:hover:bg-sand-700 text-lg"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="mt-10">
              {Object.entries(features).map(([tab, items]) => (
                <TabsContent key={tab} value={tab}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {items.map((item, index) => (
                      <DashboardCard
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        className="p-6 h-full"
                      />
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}