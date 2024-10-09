'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'
import { PaymentForm } from '@/components/payments/payment-form'
import { OrderSummary } from '@/components/payments/order-summary'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from '@solana/web3.js'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('your_stripe_publishable_key')

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsProcessing(true)

    // Simulating payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsProcessing(false)
    toast({
      title: "Payment Successful",
      description: "Your order has been processed successfully.",
      duration: 5000,
    })

    // Redirect to a success page (you would need to create this page)
    router.push('/payments/success')
  }

  const orderItems = [
    { name: "BARK Pro Plan (Annual)", price: 1000.00 }
  ]
  const tax = 80.00
  const total = orderItems.reduce((sum, item) => sum + item.price, 0) + tax

  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={[/* Add your supported wallet adapters here */]}>
        <WalletModalProvider>
          <PayPalScriptProvider options={{ "client-id": "your_paypal_client_id" }}>
            <Elements stripe={stripePromise}>
              <div className="container mx-auto px-4 py-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button variant="ghost" asChild className="mb-6">
                    <Link href="/services">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Services
                    </Link>
                  </Button>
                  <h1  className="text-3xl font-bold mb-8">Checkout</h1>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Choose your preferred payment method</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <WalletMultiButton />
                        </div>
                        <PaymentForm onSubmit={handleSubmit} isProcessing={isProcessing} amount={total} />
                        <p className="mt-4 text-sm text-sand-600 dark:text-sand-400">
                          Payment method icons are displayed for easy identification.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <OrderSummary items={orderItems} tax={tax} />
                  </motion.div>
                </div>
              </div>
            </Elements>
          </PayPalScriptProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}