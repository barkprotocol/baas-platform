'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulating API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Subscribed!",
        description: "You've successfully subscribed to our newsletter.",
      })
      setEmail('')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem subscribing to the newsletter.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay Updated</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Subscribe to our newsletter for the latest updates, features, and blockchain insights.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                className="flex-grow"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our{" "}
              <Link className="underline underline-offset-2 hover:text-primary" href="/privacy-policy">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}