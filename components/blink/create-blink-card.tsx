import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Coins, DollarSign, ImageIcon, Plus, Repeat } from 'lucide-react'

const blinkTypes = [
  { id: 'gift', icon: Gift, name: 'Gift Blink', description: 'Create a gift for someone special', path: '/blinks/create/gift' },
  { id: 'donation', icon: Coins, name: 'Donation Blink', description: 'Set up a donation campaign', path: '/blinks/create/donations' },
  { id: 'payment', icon: DollarSign, name: 'Payment Blink', description: 'Request a payment or create an invoice', path: '/blinks/create/payments' },
  { id: 'nft', icon: ImageIcon, name: 'NFT Blink', description: 'Create and share an NFT', path: '/blinks/create/nft' },
  { id: 'subscription', icon: Repeat, name: 'Subscription Blink', description: 'Set up a recurring payment', path: '/blinks/create/subscription' },
]

interface CreateBlinkCardProps {
  className?: string
}

export default function CreateBlinkCard({ className }: CreateBlinkCardProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleCreateBlink = () => {
    if (selectedType) {
      const selectedBlinkType = blinkTypes.find(type => type.id === selectedType)
      if (selectedBlinkType) {
        router.push(selectedBlinkType.path)
      }
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create a New Blink</CardTitle>
        <CardDescription>Choose a Blink type to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {blinkTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              className="h-auto flex flex-col items-center p-4 space-y-2"
              onClick={() => setSelectedType(type.id)}
            >
              <type.icon className="h-8 w-8" />
              <span className="text-sm font-medium text-center">{type.name}</span>
            </Button>
          ))}
        </div>
        <Button
          className="w-full mt-4"
          onClick={handleCreateBlink}
          disabled={!selectedType}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create {selectedType ? blinkTypes.find(t => t.id === selectedType)?.name : 'Blink'}
        </Button>
      </CardContent>
    </Card>
  )
}