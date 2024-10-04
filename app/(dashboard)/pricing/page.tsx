'use client'

import { useState } from 'react'
import { checkoutAction } from '@/lib/payments/actions'
import { Check, Info } from 'lucide-react'
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe'
import { getSolanaPrices, getSolanaProducts } from '@/lib/payments/solana-pay'
import { SubmitButton } from '@/components/ui/submit-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Prices are fresh for one hour max
export const revalidate = 3600

export default function PricingPage() {
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const fetchPrices = async () => {
    const [stripePrices, stripeProducts, solanaPrices, solanaProducts] = await Promise.all([
      getStripePrices(),
      getStripeProducts(),
      getSolanaPrices(),
      getSolanaProducts(),
    ])

    return { stripePrices, stripeProducts, solanaPrices, solanaProducts }
  }

  const { stripePrices, stripeProducts, solanaPrices, solanaProducts } = await fetchPrices()

  const basePlan = stripeProducts.find((product) => product.name === 'Base')
  const plusPlan = stripeProducts.find((product) => product.name === 'Enterprise')

  const basePrice = stripePrices.find((price) => price.productId === basePlan?.id)
  const enterprisePrice = stripePrices.find((price) => price.productId === plusPlan?.id)

  const solanaBasePrice = solanaPrices.find((price) => price.productId === basePlan?.id)
  const solanaEnterprisePrice = solanaPrices.find((price) => price.productId === plusPlan?.id)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={paymentMethod === 'stripe' ? basePrice?.unitAmount : solanaBasePrice?.unitAmount}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Email Support',
          ]}
          priceId={paymentMethod === 'stripe' ? basePrice?.id : solanaBasePrice?.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
        <PricingCard
          name={plusPlan?.name || 'Plus'}
          price={paymentMethod === 'stripe' ? enterprisePrice?.unitAmount : solanaEnterprisePrice?.unitAmount}
          interval={enterprisePrice?.interval || 'month'}
          trialDays={enterprisePrice?.trialPeriodDays || 7}
          features={[
            'Everything in Base, and:',
            'Early Access to New Features',
            '24/7 Support + Slack Access',
          ]}
          priceId={paymentMethod === 'stripe' ? enterprisePrice?.id : solanaEnterprisePrice?.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>
    </main>
  )
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
  paymentMethod,
  onPaymentMethodChange,
}: {
  name: string
  price: number
  interval: string
  trialDays: number
  features: string[]
  priceId?: string
  paymentMethod: string
  onPaymentMethodChange: (method: string) => void
}) {
  return (
    <div className="pt-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 bg-white">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-semibold text-gray-900 mb-6">
        {paymentMethod === 'stripe' ? '$' : '◎'}{price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-sand-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        <div className="flex items-center mb-4">
          <select 
            name="paymentMethod" 
            className="p-2 border border-gray-300 rounded hover:border-sand-500 transition-colors mr-2"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
          >
            <option value="stripe">Pay with Stripe</option>
            <option value="solana">Pay with Solana</option>
          </select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose your preferred payment method</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SubmitButton />
      </form>
    </div>
  )
}