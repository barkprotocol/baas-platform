'use client';

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { BarChart, Users, Zap, ArrowRight, Shield, Rocket, Code, Coins, Gift, Repeat, Paintbrush, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useInView } from 'react-intersection-observer'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const tabAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
}

const features = {
  overview: [
    { icon: BarChart, title: "Real-time Analytics", description: "Gain insights with comprehensive blockchain analytics" },
    { icon: Users, title: "User Management", description: "Effortless user, wallet and SPL token management tools" },
    { icon: Zap, title: "Programs", description: "Deploy and manage Anchor-based programs with ease" }
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
    { icon: Zap, title: "Solana Actions", description: "Leverage Solana's speed with BARK actions" },
    { icon: Repeat, title: "Cross-chain Support", description: "Interact with multiple blockchains effortlessly" }
  ],
  socialFi: [
    { icon: Coins, title: "Staking", description: "Maximize returns with staking and automated yield farming" },
    { icon: Repeat, title: "Token Swaps", description: "Effortless token exchanges across platforms" },
    { icon: Shield, title: "Token Management", description: "Advanced tools for token management and DeFi assessment" }
  ],
  nFT: [
    { icon: Paintbrush, title: "Assets", description: "Mint, create and deploy digital assets and NFTs with ease" },
    { icon: Gift, title: "Marketplace Integration", description: "Seamless integration with popular NFT marketplaces" },
    { icon: Coins, title: "Royalty Management", description: "Automate royalty distributions for BARK token holders and creators" }
  ]
}

const carouselImages = [
  "/images/blinkboard.png",
  "/images/dashboard-1.png",
  "/images/dashboard-2.png",
  "/images/dashboard-3.png",
]

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          custom={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={carouselImages[currentIndex]}
            alt={`BARK BaaS Platform Dashboard ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-2xl"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/10 text-white hover:bg-black/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/10 text-white hover:bg-black/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

const FeatureTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-10 overflow-x-auto pb-4">
      <div className="inline-flex p-1 bg-sand-200 dark:bg-sand-800 rounded-full">
        {Object.keys(features).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md text-lg whitespace-nowrap transition-all duration-300 ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-sand-700 dark:text-sand-300 hover:bg-sand-300 dark:hover:bg-sand-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

const FeatureContent = ({ activeTab }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={tabAnimation}
        className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
      >
        {features[activeTab].map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export function About() {
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (inView) {
      // You can add any additional actions here when the component comes into view
    }
  }, [inView])

  const handleExplore = () => {
    toast({
      title: "Exploring Solutions",
      description: "Redirecting you to our solutions page.",
      duration: 3000,
    })
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-sand-50 dark:bg-sand-900">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          ref={ref}
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
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h3 className="text-2xl font-bold text-sand-800 dark:text-sand-100">About Our Platform</h3>
            <p className="text-gray-700 dark:text-sand-300 text-lg leading-relaxed">
              BARK BaaS (Blockchain as a Service) is a cutting-edge platform that leverages the power of Solana blockchain to provide fast, secure, and scalable solutions for businesses. Our mission is to simplify blockchain integration and empower companies to harness the full potential of decentralized technologies.
            </p>
            <div className="pt-4 flex items-center space-x-4">
              <Link href="/pages/solutions" passHref>
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleExplore}
                >
                  Explore Our Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="flex items-center space-x-2"
                onClick={toggleVideo}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? "Pause Video" : "Presentation"}</span>
              </Button>
            </div>
            <div className="relative w-full h-48 mt-4">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                src="/videos/bark-protocol-intro.mp4"
                poster="/images/video-poster.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
          <motion.div 
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <ImageCarousel />
          </motion.div>
        </div>

        <motion.div 
          className="mt-24"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-sand-800 dark:text-sand-100">Features</h3>
          <FeatureTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <FeatureContent activeTab={activeTab} />
        </motion.div>
      </div>
    </section>
  )
}