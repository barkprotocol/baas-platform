'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { WalletButton } from "@/components/ui/wallet-button"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, MenuIcon, ArrowRight, X, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const logoUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showTopBanner, setShowTopBanner] = useState(true)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleGetStarted = () => {
    router.push('/pages/get-started')
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/pages/services", label: "Services" },
    { href: "/pages/actions", label: "Actions" },
    { href: "#features", label: "Features" },
    { href: "pages/about", label: "About" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <>
      <AnimatePresence>
        {showTopBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm relative"
          >
            <span>Experience the future of blockchain with BARK Protocol. Join our beta and start Blinking today!</span>
            <button
              onClick={() => setShowTopBanner(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-primary-foreground/10 rounded-full p-1 transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <header className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md" : "bg-transparent",
        showTopBanner ? "top-8" : "top-0"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <div className="flex-1 flex items-center justify-start">
              <Link className="flex items-center justify-center space-x-2 group" href="/">
                <Image src={logoUrl} alt="BARK Logo" width={32} height={32} className="sm:w-[35px] sm:h-[35px] transition-transform group-hover:scale-110" />
                <span className="text-lg sm:text-xl">
                  <span className="font-semibold group-hover:text-primary transition-colors">BARK</span>
                  <span className="font-normal text-muted-foreground group-hover:text-primary/80 transition-colors"> PROTOCOL</span>
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center justify-center flex-1">
              {navItems.map((item) => (
                <Link key={item.href} className="text-sm font-medium hover:text-primary transition-colors mx-4 relative group" href={item.href}>
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            <div className="flex-1 flex items-center justify-end gap-4 sm:gap-4">
              <Button 
                onClick={handleGetStarted}
                size="default"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium group"
              >
                Get Started
                <Zap className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
              <WalletButton />
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="hidden sm:inline-flex hover:bg-primary/10"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5 transition-transform hover:rotate-45" />
                  ) : (
                    <MoonIcon className="h-5 w-5 transition-transform hover:-rotate-12" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-screen max-w-[200px]">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.label}
                        <ArrowRight className="ml-auto h-4 w-4 opacity-50" />
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onSelect={handleGetStarted} className="font-medium text-primary">
                    Get Started
                    <Zap className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={toggleTheme}>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    {theme === 'dark' ? <SunIcon className="ml-auto h-4 w-4" /> : <MoonIcon className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}