'use client'

import { useState, useEffect } from 'react'
import { checkoutAction } from '@/lib/payments/chech'
import { Check, Info } from 'lucide-react'
import { getStripePrices } from '@/lib/payments/stripe'
import { getCommerceProducts } from '@/lib/e-commerce/products'
import { getSolanaPrices } from '@/lib/payments/solana-pay'
import { SubmitButton } from '@/components/ui/submit-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define types for our data structures
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
  plusPlan: Product | undefined;
  basePrice: Price | undefined;
  enterprisePrice: Price | undefined;
  solanaBasePrice: Price;
  solanaEnterprisePrice: Price;
}

// Prices are fresh for one hour max
export const revalidate = 3600

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
        const plusPlan = commerceProducts.find((product: Product) => product.name === 'Enterprise')

        const basePrice = stripePrices.find((price: Price) => price.productId === basePlan?.id)
        const enterprisePrice = stripePrices.find((price: Price) => price.productId === plusPlan?.id)

        // Convert Solana prices to the same format as Stripe prices
        const solanaBasePrice: Price = {
          id: 'solana-base',
          productId: basePlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 100), // Convert to cents
          interval: 'month',
          trialPeriodDays: 7,
        }

        const solanaEnterprisePrice: Price = {
          id: 'solana-enterprise',
          productId: plusPlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 200), // Assuming Enterprise is 2x Base price
          interval: 'month',
          trialPeriodDays: 7,
        }

        setPricingData({
          basePlan,
          plusPlan,
          basePrice,
          enterprisePrice,
          solanaBasePrice,
          solanaEnterprisePrice,
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

  const { basePlan, plusPlan, basePrice, enterprisePrice, solanaBasePrice, solanaEnterprisePrice } = pricingData

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={paymentMethod === 'stripe' ? basePrice?.unitAmount : solanaBasePrice.unitAmount}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Email Support',
          ]}
          priceId={paymentMethod === 'stripe' ? basePrice?.id : solanaBasePrice.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
        <PricingCard
          name={plusPlan?.name || 'Plus'}
          price={paymentMethod === 'stripe' ? enterprisePrice?.unitAmount : solanaEnterprisePrice.unitAmount}
          interval={enterprisePrice?.interval || 'month'}
          trialDays={enterprisePrice?.trialPeriodDays || 7}
          features={[
            'Everything in Base, and:',
            'Early Access to New Features',
            '24/7 Support + Slack Access',
          ]}
          priceId={paymentMethod === 'stripe' ? enterprisePrice?.id : solanaEnterprisePrice.id}
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