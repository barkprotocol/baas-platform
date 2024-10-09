'use client'

import { useState } from 'react'
import { signIn, signOut } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileClientProps {
  initialUser: string | null
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser)
  const [walletAddress, setWalletAddress] = useState('')
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(walletAddress)
      setUser(walletAddress)
      router.refresh()
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  if (!user) {
    return (
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Please sign in with your Solana wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your Solana wallet address"
            />
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Welcome, {user}!</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSignOut} className="w-full">Sign Out</Button>
      </CardContent>
    </Card>
  )
}