'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Rocket, ChevronDown } from "lucide-react"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const router = useRouter()

  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleGetStarted = () => {
    router.push('/pages/get-started')
  }

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#features')
    }
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 sm:px-6 lg:px-8">
      <div className="container relative z-20 mx-auto">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge variant="outline" className="px-3 py-1 text-sm font-semibold animate-pulse">
            Revolutionary Blockchain Solution
          </Badge>
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl/none">
              <span className="block text-foreground">Unleash the Power of</span>
              <span className="block text-primary font-black">
                BARK BaaS Platform
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl md:text-2xl">
              Revolutionize Your Business with Solana Blockchain Technology
            </p>
          </div>
          <p className="text-sm sm:text-base text-[#D0BFB4] max-w-[600px] mb-6">
            Experience lightning-fast transactions, unparalleled scalability, and enterprise-grade security. Build, deploy, and scale your decentralized applications with ease.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out group shadow-lg hover:shadow-xl"
              onClick={handleGetStarted}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Launch Your Project
              <Rocket className={`ml-2 h-4 w-4 transition-all duration-300 ${isHovered ? 'translate-x-1 rotate-45' : ''} group-hover:animate-pulse`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out group shadow-lg hover:shadow-xl"
              onClick={handleLearnMore}
            >
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20"
        style={{
          opacity: Math.max(0, 1 - scrollPosition / 300),
          transform: `translate(-50%, ${Math.min(scrollPosition / 2, 100)}px)`,
        }}
      >
        <ChevronDown className="h-8 w-8 text-muted-foreground" />
      </div>
    </section>
  )
}