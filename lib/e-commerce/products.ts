'use client'

import { useState, useEffect } from 'react'
import { checkoutAction } from '@/lib/payments/actions'
import { Check, Info } from 'lucide-react'
import { getStripePrices } from '@/lib/payments/stripe'
import { getCommerceProducts } from '@/lib/e-commerce/products'
import { getSolanaPrices } from '@/lib/payments/solana-pay'
import { SubmitButton } from '@/components/ui/submit-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the structure of Product and Price interfaces
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

// Define the structure for PricingData to hold all the necessary pricing information
interface PricingData {
  starterPlan: Product | undefined;
  proPlan: Product | undefined;
  enterprisePlan: Product | undefined;
  starterPrice: Price | undefined;
  proPrice: Price | undefined;
  enterprisePrice: Price | undefined;
  solanaStarterPrice: Price;
  solanaProPrice: Price;
  solanaEnterprisePrice: Price;
}

// Set revalidation time for the pricing data
export const revalidate = 3600 // Prices are fresh for one hour max

export default function PricingPage() {
  const [paymentMethod, setPaymentMethod] = useState('stripe') // Track the selected payment method
  const [pricingData, setPricingData] = useState<PricingData | null>(null) // Store fetched pricing data
  const [loading, setLoading] = useState(true) // Loading state for fetching data

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch all necessary pricing data
        const [stripePrices, commerceProducts, solanaPrices] = await Promise.all([
          getStripePrices(),
          getCommerceProducts(),
          getSolanaPrices(),
        ])

        // Map the fetched products and prices
        const starterPlan = commerceProducts.find((product: Product) => product.name === 'Starter')
        const proPlan = commerceProducts.find((product: Product) => product.name === 'Pro')
        const enterprisePlan = commerceProducts.find((product: Product) => product.name === 'Enterprise')

        const starterPrice = stripePrices.find((price: Price) => price.productId === starterPlan?.id)
        const proPrice = stripePrices.find((price: Price) => price.productId === proPlan?.id)
        const enterprisePrice = stripePrices.find((price: Price) => price.productId === enterprisePlan?.id)

        // Define Solana pricing based on fetched Solana prices
        const solanaStarterPrice: Price = {
          id: 'starter',
          productId: starterPlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 100),
          interval: 'month',
          trialPeriodDays: 7,
        }

        const solanaProPrice: Price = {
          id: 'pro',
          productId: proPlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 200),
          interval: 'month',
          trialPeriodDays: 7,
        }

        const solanaEnterprisePrice: Price = {
          id: 'enterprise',
          productId: enterprisePlan?.id || '',
          unitAmount: Math.round(solanaPrices.solana.usd * 300),
          interval: 'month',
          trialPeriodDays: 7,
        }

        // Set the pricing data in state
        setPricingData({
          starterPlan,
          proPlan,
          enterprisePlan,
          starterPrice,
          proPrice,
          enterprisePrice,
          solanaStarterPrice,
          solanaProPrice,
          solanaEnterprisePrice,
        })
        setLoading(false) // Update loading state
      } catch (error) {
        console.error('Error fetching pricing data:', error)
        setLoading(false) // Update loading state even on error
      }
    }

    fetchPrices() // Call the function to fetch pricing data
  }, [])

  // Handle loading state and errors
  if (loading) {
    return <div>Loading pricing information...</div>
  }

  if (!pricingData) {
    return <div>Error loading pricing information. Please try again later.</div>
  }

  // Destructure pricing data for easier access
  const { 
    starterPlan, 
    proPlan, 
    enterprisePlan, 
    starterPrice, 
    proPrice, 
    enterprisePrice, 
    solanaStarterPrice, 
    solanaProPrice, 
    solanaEnterprisePrice 
  } = pricingData

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your BARK Dashboard Plan</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Render Pricing Cards for each plan */}
        <PricingCard
          name={starterPlan?.name || 'Starter'}
          price={paymentMethod === 'stripe' ? starterPrice?.unitAmount : solanaStarterPrice.unitAmount}
          interval={starterPrice?.interval || 'month'}
          trialDays={starterPrice?.trialPeriodDays || 7}
          features={[
            'Access to BARK Community',
            'Basic BaaS Services',
            'Standard Support',
            'Limited API Access',
          ]}
          priceId={paymentMethod === 'stripe' ? starterPrice?.id : solanaStarterPrice.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={paymentMethod === 'stripe' ? proPrice?.unitAmount : solanaProPrice.unitAmount}
          interval={proPrice?.interval || 'month'}
          trialDays={proPrice?.trialPeriodDays || 7}
          features={[
            'Everything in Starter, plus:',
            'Advanced BaaS Services',
            'Priority Support',
            'Full API Access',
            'Custom Integrations',
          ]}
          priceId={paymentMethod === 'stripe' ? proPrice?.id : solanaProPrice.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
        <PricingCard
          name={enterprisePlan?.name || 'Enterprise'}
          price={paymentMethod === 'stripe' ? enterprisePrice?.unitAmount : solanaEnterprisePrice.unitAmount}
          interval={enterprisePrice?.interval || 'month'}
          trialDays={enterprisePrice?.trialPeriodDays || 7}
          features={[
            'Everything in Pro, plus:',
            'Dedicated Account Manager',
            'Custom Solutions',
            'Enterprise-Level Support',
            'Tailored BaaS Features',
          ]}
          priceId={paymentMethod === 'stripe' ? enterprisePrice?.id : solanaEnterprisePrice.id}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>
    </main>
  )
}

// Define the props for PricingCard component
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

// PricingCard component definition
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
            <option value="stripe">Credit Card</option>
            <option value="solana">Solana Pay</option>
          </select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="text-sand-500 h-5 w-5 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Choose your payment method for this plan.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SubmitButton type="submit" className="w-full" disabled={!priceId}>
          Choose {name}
        </SubmitButton>
      </form>
    </div>
  )
}
