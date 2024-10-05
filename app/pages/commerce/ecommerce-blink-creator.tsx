'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ShoppingCart } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Initialize Solana connection (replace with your RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com')

// Token mint addresses (replace with actual addresses)
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const BARK_MINT = new PublicKey('BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo')

// Simulated product data
const product = {
  name: "BARK T-Shirt",
  price: {
    SOL: 0.5,
    USDC: 10,
    BARK: 100
  },
  sellerAddress: "gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR"
}

interface ShippingInfo {
  name: string
  address: string
  city: string
  country: string
  postalCode: string
}

type PaymentMethod = 'SOL' | 'USDC' | 'BARK'

export default function EcommerceBlinkCreator() {
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  })
  const [emailAddress, setEmailAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('SOL')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateBlink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const transaction = new Transaction()

      // Action 1: Save shipping information (simulated)
      console.log('Saving shipping information:', shippingInfo)

      // Action 2: Make purchase
      if (paymentMethod === 'SOL') {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(product.sellerAddress),
            lamports: product.price.SOL * LAMPORTS_PER_SOL,
          })
        )
      } else {
        const tokenMint = paymentMethod === 'USDC' ? USDC_MINT : BARK_MINT
        const tokenAmount = paymentMethod === 'USDC' ? product.price.USDC : product.price.BARK
        const tokenDecimals = paymentMethod === 'USDC' ? 6 : 9 // Assuming BARK has 9 decimals

        const token = new Token(connection, tokenMint, TOKEN_PROGRAM_ID, publicKey)
        const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(publicKey)
        const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(new PublicKey(product.sellerAddress))

        transaction.add(
          Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            toTokenAccount.address,
            publicKey,
            [],
            tokenAmount * Math.pow(10, tokenDecimals)
          )
        )
      }

      // Action 3: Save follow-up email (simulated)
      console.log('Saving follow-up email:', emailAddress)

      const { blockhash } = await connection.getRecentBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signed = await signTransaction(transaction)
      const txid = await connection.sendRawTransaction(signed.serialize())

      toast({
        title: "Purchase Successful",
        description: `Your order for ${product.name} has been placed successfully!`,
      })

      // In a real application, you would save the order details to your backend here

    } catch (error) {
      console.error('Error processing purchase:', error)
      toast({
        title: "Error",
        description: "Failed to process purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <WalletButton />
      </div>
      <Card className="w-full max-w-2xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>Purchase {product.name} using Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Follow-up Email Address</Label>
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="BARK">BARK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Action Chaining</AlertTitle>
              <AlertDescription>
                This purchase will use action chaining to complete your order in one transaction:
                1. Save your shipping information
                2. Process the payment of {product.price[paymentMethod]} {paymentMethod}
                3. Register your email for order updates
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={isLoading || !publicKey}>
              {isLoading ? 'Processing...' : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" style={{ color: '#D0BFB4' }} />
                  Complete Purchase ({product.price[paymentMethod]} {paymentMethod})
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}