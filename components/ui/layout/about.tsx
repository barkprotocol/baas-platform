'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { BarChart, Users, Zap, ArrowRight, Shield, Rocket } from 'lucide-react'
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
    { icon: Zap, title: "Smart Contracts", description: "Deploy and manage smart contracts with ease" }
  ],
  dashboard: [
    { icon: Rocket, title: "Intuitive Interface", description: "User-friendly dashboard for seamless navigation" },
    { icon: BarChart, title: "Performance Metrics", description: "Track your blockchain performance in real-time" },
    { icon: Users, title: "Collaboration Tools", description: "Streamline teamwork with built-in collaboration features" }
  ],
  security: [
    { icon: Shield, title: "Advanced Encryption", description: "State-of-the-art encryption for data protection" },
    { icon: Users, title: "Access Control", description: "Granular access controls for enhanced security" },
    { icon: Zap, title: "Audit Logs", description: "Comprehensive audit trails for all activities" }
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
    // Add actual navigation logic here
  }

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Empowering the Future of <span className="text-primary">Blockchain</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            BARK BaaS revolutionizes blockchain integration, making it accessible and efficient for businesses of all sizes.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <motion.div 
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h3 className="text-2xl font-bold">About BaaS Platform</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              BARK BaaS (Blockchain as a Service) is a cutting-edge platform that leverages the power of Solana blockchain to provide fast, secure, and scalable solutions for businesses. Our mission is to simplify blockchain integration and empower companies to harness the full potential of decentralized technologies.
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleExplore}
            >
              Explore Our Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
            />
          </motion.div>
        </div>

        <motion.div 
          className="mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h3 className="text-2xl font-bold text-center mb-10">Features</h3>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 p-1 rounded-lg">
              {Object.keys(features).map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-background rounded-md transition-all duration-300"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(features).map(([tab, items]) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, index) => (
                    <DashboardCard
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}