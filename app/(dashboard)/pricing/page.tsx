'use client'

import { useState, useEffect } from 'react'
import { checkoutAction } from '@/lib/payments/solana-pay'
import { Check, Info } from 'lucide-react'
import { getStripePrices } from '@/lib/payments/stripe'
import { getCommerceProducts } from '@/lib/e-commerce/products'
import { getSolanaPrices } from '@/lib/payments/solana-pay'
import { SubmitButton } from '@/components/ui/submit-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { handleSolanaPayment } from '@/lib/payments/solana-pay'

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
  plans: {
    name: string;
    stripePrice: Price | undefined;
    solanaPrice: Price;
    features: string[];
  }[];
}

// Prices are fresh for one hour max
export const revalidate = 3600

export default function PricingPage() {
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [stripePrices, commerceProducts, solanaPrices] = await Promise.all([
          getStripePrices(),
          getCommerceProducts(),
          getSolanaPrices(),
        ])

        const plans = commerceProducts.map((product: Product) => {
          const stripePrice = stripePrices.find((price: Price) => price.productId === product.id)
          const solanaPrice: Price = {
            id: `solana-${product.name.toLowerCase()}`,
            productId: product.id,
            unitAmount: Math.round(solanaPrices.solana.usd * 100), // Convert to cents
            interval: 'month',
            trialPeriodDays: 7,
          }

          return {
            name: product.name,
            stripePrice,
            solanaPrice,
            features: getFeaturesByPlanName(product.name),
          }
        })

        setPricingData({ plans })
      } catch (error) {
        console.error('Error fetching pricing data:', error)
        setError('Error loading pricing information. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  const getFeaturesByPlanName = (planName: string) => {
    switch (planName) {
      case 'Starter':
        return ['Basic Features', 'Email Support'];
      case 'Pro':
        return ['All Starter Features', 'Advanced Features', 'Priority Support'];
      case 'Enterprise':
        return ['All Pro Features', 'Custom Solutions', '24/7 Support + Slack Access'];
      default:
        return [];
    }
  }

  const handlePayment = async (priceId: string | undefined) => {
    setPaymentLoading(true)
    setError(null) // Reset error state before payment

    try {
      if (paymentMethod === 'stripe') {
        await checkoutAction(priceId);
      } else {
        const fromAddress = ''; // Get the sender's address (implement wallet connection here)
        const toAddress = ''; // Your receiving address
        const amount = priceId ? parseInt(priceId) : 0; // Get amount dynamically

        const transactionSignature = await handleSolanaPayment(fromAddress, toAddress, amount, null);
        console.log('Payment successful with transaction:', transactionSignature);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false)
    }
  };

  if (loading) {
    return <div>Loading pricing information...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!pricingData) {
    return <div>Error loading pricing information. Please try again later.</div>
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {pricingData.plans.map((plan, index) => (
          <PricingCard
            key={index}
            name={plan.name}
            price={paymentMethod === 'stripe' ? plan.stripePrice?.unitAmount : plan.solanaPrice.unitAmount}
            interval={plan.stripePrice?.interval || 'month'}
            trialDays={plan.stripePrice?.trialPeriodDays || 7}
            features={plan.features}
            priceId={paymentMethod === 'stripe' ? plan.stripePrice?.id : plan.solanaPrice.id}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onPayment={handlePayment}
            loading={paymentLoading}
          />
        ))}
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
  onPayment: (priceId: string | undefined) => void;
  loading: boolean;
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
  onPayment,
  loading,
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
      <form onSubmit={(e) => { e.preventDefault(); onPayment(priceId); }}>
        <input type="hidden" name="priceId" value={priceId} />
        <div className="flex items-center mb-4">
          <select 
            name="paymentMethod" 
            className="p-2 border border-gray-300 rounded hover:border-sand-500 transition-colors mr-2"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            aria-label="Select payment method"
          >
            <option value="stripe">Pay with Stripe</option>
            <option value="solana">Pay with Solana</option>
          </select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-500 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Choose a payment method to proceed with the payment.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SubmitButton disabled={loading}>
          {loading ? 'Processing...' : 'Get Started'}
        </SubmitButton>
      </form>
    </div>
  )
}
