'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Check, Star, ArrowRight } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { BlinkboardSidebar } from '@/components/ui/layout/blinkboard/sidebar'

const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
const iconColor = "#BBA597"

interface TierFeature {
  name: string;
  included: boolean;
}

interface BlinkboardTier {
  name: string;
  description: string;
  price: string;
  features: TierFeature[];
  recommended?: boolean;
}

const tiers: BlinkboardTier[] = [
  {
    name: 'Basic',
    description: 'Essential features for individuals and small teams',
    price: 'Free',
    features: [
      { name: 'Up to 10 Blinks', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Community support', included: true },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'Advanced features for growing businesses',
    price: '$29/month',
    features: [
      { name: 'Unlimited Blinks', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom pricing',
    features: [
      { name: 'Unlimited Blinks', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
    ],
  },
]

export default function BlinkboardTiersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleSelectTier = (tierName: string) => {
    setSelectedTier(tierName)
    toast({
      title: "Tier Selected",
      description: `You've selected the ${tierName} tier.`,
    })
    // In a real application, you would handle the tier selection/upgrade process here
    router.push(`/blinkboard/${tierName.toLowerCase()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-sand-50">
      <BlinkboardSidebar />
      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <Image src={titleIconUrl} alt="BARK BLINKS icon" width={48} height={48} className="rounded-full" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-sand-900">Blinkboard Tiers</h1>
              <p className="text-sand-600">Choose the perfect plan for your needs</p>
            </div>
          </div>

          <Alert className="bg-sand-100 border-sand-300 text-sand-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sand-900 font-semibold">Upgrade for More Features</AlertTitle>
            <AlertDescription>
              Unlock advanced capabilities by upgrading your Blinkboard tier. Compare plans below to find the best fit for you.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${tier.recommended ? 'border-2 border-sand-500' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-sand-900">{tier.name}</CardTitle>
                    {tier.recommended && (
                      <Badge variant="secondary" className="bg-sand-200 text-sand-800">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sand-600">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-sand-900 mb-4">{tier.price}</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sand-700">
                        {feature.included ? (
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <span className="mr-2 h-4 w-4 block bg-sand-200 rounded-full" />
                        )}
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSelectTier(tier.name)} 
                    className="w-full bg-sand-600 hover:bg-sand-700 text-white"
                  >
                    {selectedTier === tier.name ? 'Selected' : 'Select Plan'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  )
}