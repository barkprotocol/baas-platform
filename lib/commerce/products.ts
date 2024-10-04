'use client'

import { useState, useEffect } from 'react'
import { checkoutAction } from '@/lib/payments/actions'
import { Check, Info } from 'lucide-react'
import { getStripePrices } from '@/lib/payments/stripe'
import { getCommerceProducts } from '@/lib/commerce/products'
import { getSolanaPrices } from '@/lib/payments/solana-pay'
import { SubmitButton } from '@/components/ui/submit-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Product {
  id: string;
  name: string;
}

interface Price {
  id: string;
  productId: string;
  unitAmount: number;
  interval: string;
  trialPeriodDays: number;
}

interface PricingData {
  basePlan: Product | undefined;
  proPlan: Product | undefined;
  basePrice: Price | undefined;
  proPrice: Price | undefined;
  solanaBasePrice: Price;
  solanaProPrice: Price;
}

export const revalidate = 3600 // Prices are fresh for one hour max

export default function PricingPage() {
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [stripePrices, commerceProducts, solanaPrices] = await Promise.all([
          getStripePrices(),
          getCommerceProducts(),
          getSolanaPrices(),
        ])

        const basePlan = commerceProducts.find((product: Product) => product.name === 'Base')
        const proPlan = commerceProducts.find((product: Product) => product.name === 'Pro')

        const basePrice = stripePrices.find((price: Price) => price.productId === basePlan?.id)
        const proPrice = stripePrices.find((price: Price) => price.productId === proPlan?.id)

        const solanaBasePrice: Price = {
          id: 'solana-base',
          productId: basePlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 100),
          interval: 'month',
          trialPeriodDays: 7,
        }

        const solanaProPrice: Price = {
          id: 'solana-pro',
          productId: proPlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 200),
          interval: 'month',
          trialPeriodDays: 7,
        }

        setPricingData({
          basePlan,
          proPlan,
          basePrice,
          proPrice,
          solanaBasePrice,
          solanaProPrice,
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching pricing data:', error)
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  if (loading) {
    return <div>Loading pricing information...</div>
  }

  if (!pricingData) {
    return <div>Error loading pricing information. Please try again later.</div>
  }

  const { basePlan, proPlan, basePrice, proPrice, solanaBasePrice, solanaProPrice } = pricingData

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your BARK Dashboard Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={paymentMethod === 'stripe' ? basePrice?.unitAmount : solanaBasePrice.unitAmount}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            'Access to BARK Community',
            'Basic BARK Services',
            'Standard Support',
            'Limited API Access',
          ]}
          priceId={paymentMethod === 'stripe' ? basePrice?.id : solanaBasePrice.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={paymentMethod === 'stripe' ? proPrice?.unitAmount : solanaProPrice.unitAmount}
          interval={proPrice?.interval || 'month'}
          trialDays={proPrice?.trialPeriodDays || 7}
          features={[
            'Everything in Base, plus:',
            'Advanced BARK Services',
            'Priority Support',
            'Full API Access',
            'Custom Integrations',
          ]}
          priceId={paymentMethod === 'stripe' ? proPrice?.id : solanaProPrice.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>
    </main>
  )
}

interface PricingCardProps {
  name: string;
  price: number | undefined;
  interval: string;
  trialDays: number;
  features: string[];
  priceId: string | undefined;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
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
}: PricingCardProps) {
  return (
    <div className="pt-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 bg-white">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-semibold text-gray-900 mb-6">
        {paymentMethod === 'stripe' ? '$' : '◎'}{price ? price / 100 : 'N/A'}{' '}
        <span className="text-xl font-normal text-gray-600">
          per month
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