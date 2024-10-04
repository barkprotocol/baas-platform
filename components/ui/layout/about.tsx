'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { BarChart, Users, Zap, ArrowRight, Shield, Rocket } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Empowering the Future of <span className="text-primary">Blockchain</span>
          </h2>
          <p className="mt-4 text-xl text-[#D0BFB4] max-w-3xl mx-auto">
            BARK BaaS revolutionizes blockchain integration, making it accessible and efficient for businesses of all sizes.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold">About BaaS Platform</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
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
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Image
              src="/.github/images/app.png?height=400&width=600"
              alt="BARK BaaS Platform"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </motion.div>
        </div>

        <motion.div 
          className="mt-20"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h3 className="text-2xl font-bold text-center mb-10">Features</h3>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 p-1 rounded-lg">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-background rounded-md transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard"
                className="data-[state=active]:bg-background rounded-md transition-all duration-300"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-background rounded-md transition-all duration-300"
              >
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard
                  icon={BarChart}
                  title="Real-time Analytics"
                  description="Gain insights with comprehensive blockchain analytics"
                />
                <DashboardCard
                  icon={Users}
                  title="User Management"
                  description="Effortless user and wallet management tools"
                />
                <DashboardCard
                  icon={Zap}
                  title="Smart Contracts"
                  description="Deploy and manage smart contracts with ease"
                />
              </div>
            </TabsContent>
            <TabsContent value="dashboard">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard
                  icon={Rocket}
                  title="Intuitive Interface"
                  description="User-friendly dashboard for seamless navigation"
                />
                <DashboardCard
                  icon={BarChart}
                  title="Performance Metrics"
                  description="Track your blockchain performance in real-time"
                />
                <DashboardCard
                  icon={Users}
                  title="Collaboration Tools"
                  description="Streamline teamwork with built-in collaboration features"
                />
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard
                  icon={Shield}
                  title="Advanced Encryption"
                  description="State-of-the-art encryption for data protection"
                />
                <DashboardCard
                  icon={Users}
                  title="Access Control"
                  description="Granular access controls for enhanced security"
                />
                <DashboardCard
                  icon={Zap}
                  title="Audit Logs"
                  description="Comprehensive audit trails for all activities"
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}