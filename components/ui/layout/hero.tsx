'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Rocket, ChevronDown, Plus } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import Link from 'next/link'

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const router = useRouter()
  const controls = useAnimation()
  const heroRef = useRef<HTMLElement>(null)

  const handleScroll = useCallback(() => {
    const position = window.scrollY
    setScrollPosition(position)
    
    if (heroRef.current) {
      const heroHeight = heroRef.current.offsetHeight
      const scrollPercentage = Math.min(position / heroHeight, 1)
      controls.start({ opacity: 1 - scrollPercentage, y: scrollPercentage * 50 })
    }
  }, [controls])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10,
        staggerChildren: 0.1
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const backgroundImageUrl = "https://www.freepik.com/free-photo/abstract-globe_2052333.htm#fromView=search&page=1&position=30&uuid=2f6a30ba-49c9-4495-8ee7-06ef6a51089b"

  return (
    <section 
      ref={heroRef} 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundPosition: 'center 60%',
          transform: 'scale(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95"></div>
      <motion.div 
        className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={titleVariants}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge variant="outline" className="px-3 py-1 text-sm font-semibold animate-pulse">
            Revolutionary Blockchain Solution for All
          </Badge>
          <motion.div className="space-y-4" variants={childVariants}>
            <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl/none">
              <span className="block text-foreground">Unleash the Power of</span>
              <span className="block text-primary font-black">
                Blockchain As A Service Platform
              </span>
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground text-lg sm:text-xl md:text-2xl">
              Revolutionize Your World with Solana Blockchain Technology
            </p>
          </motion.div>
          <motion.p 
            className="text-sm sm:text-base text-muted-foreground max-w-[600px] mb-6"
            variants={childVariants}
          >
            Experience lightning-fast transactions, unparalleled scalability, and enterprise-grade security. Build, deploy, and scale your decentralized applications with ease. Perfect for businesses, developers, and blockchain enthusiasts alike.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            variants={childVariants}
          >
            <Link href="/pages/blinkboard" passHref>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out group shadow-lg hover:shadow-xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Launch Your Project
                <Rocket className={`ml-2 h-4 w-4 transition-all duration-300 ${isHovered ? 'translate-x-1 rotate-45' : ''} group-hover:animate-pulse`} />
              </Button>
            </Link>
            <Link href="/blinks/create" passHref>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out group shadow-lg hover:shadow-xl"
              >
                Create Blink
                <Plus className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
          <motion.div 
            className="mt-8 flex items-center justify-center space-x-2"
            variants={childVariants}
          >
            <Image
              src="https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png"
              alt="Solana Logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="text-sm font-medium text-muted-foreground">Powered by Solana</span>
          </motion.div>
        </div>
      </motion.div>
      <motion.div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
        animate={controls}
        initial={{ opacity: 1, y: 0 }}
      >
        <ChevronDown className="h-8 w-8 text-muted-foreground animate-bounce" />
      </motion.div>
    </section>
  )
}