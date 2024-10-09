import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Apple } from 'lucide-react'

interface ApplePayButtonProps {
  amount: number
}

export function ApplePayButton({ amount }: ApplePayButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApplePay = async () => {
    setIsProcessing(true)
    // Implement Apple Pay logic here
    // This would typically involve using the Apple Pay JS API
    console.log('Processing Apple Pay payment for', amount)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating payment process
    setIsProcessing(false)
  }

  return (
    <Button onClick={handleApplePay} disabled={isProcessing} className="w-full bg-black text-white">
      <Apple className="mr-2 h-4 w-4" />
      {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
    </Button>
  )
}