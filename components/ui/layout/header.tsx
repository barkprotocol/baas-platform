'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { WalletButton } from "@/components/ui/wallet-button"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const logoUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call your API to sign up the user
    console.log('Signing up with:', email, password)
    // For demonstration, we'll just close the dialog and redirect
    setIsSignUpOpen(false)
    router.push('/dashboard')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link className="flex items-center justify-center space-x-2" href="/">
            <Image src={logoUrl} alt="BARK Logo" width={35} height={35} />
            <span className="text-xl">
              <span className="font-semibold">BARK</span>
              <span className="font-normal"> PROTOCOL</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:text-primary" href="/">
              Home
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#services">
              Services
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#about">
              About
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#faq">
              FAQ
            </Link>
            <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-1">Sign Up</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sign Up</DialogTitle>
                  <DialogDescription>
                    Create your account to get started with BARK Protocol.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                </form>
              </DialogContent>
            </Dialog>
            <WalletButton />
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}