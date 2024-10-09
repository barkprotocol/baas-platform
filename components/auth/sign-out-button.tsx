'use client'

import { useState } from 'react'
import { signOut } from '@/app/actions/auth'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSignOut() {
    setIsLoading(true)
    try {
      const result = await signOut()
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while signing out",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={isLoading} variant="outline" className="w-full">
      {isLoading ? 'Signing Out...' : 'Sign Out'}
    </Button>
  )
}