import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface StripePaymentProps {
  amount: number
}

export function StripePayment({ amount }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    })

    if (error) {
      console.error(error)
      setIsProcessing(false)
    } else {
      console.log('Payment successful:', paymentMethod)
      // Send paymentMethod.id to your server for processing
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full mt-4">
        <Image src="/icons/stripe.svg" alt="Stripe" width={20} height={20} className="mr-2" />
        {isProcessing ? 'Processing...' : 'Pay with Stripe'}
      </Button>
    </form>
  )
}