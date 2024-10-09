import { CreditCard, Wallet, Apple } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

interface PaymentMethodProps {
  selectedMethod: string
  onMethodChange: (value: string) => void
}

export function PaymentMethod({ selectedMethod, onMethodChange }: PaymentMethodProps) {
  return (
    <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="credit-card" id="credit-card" />
        <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          Credit Card
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="solana-pay" id="solana-pay" />
        <Label htmlFor="solana-pay" className="flex items-center cursor-pointer">
          <Image src="/icons/solana-pay.svg" alt="Solana Pay" width={16} height={16} className="mr-2" />
          Solana Pay
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="sol" id="sol" />
        <Label htmlFor="sol" className="flex items-center cursor-pointer">
          <Image src="/icons/sol.svg" alt="SOL" width={16} height={16} className="mr-2" />
          SOL
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="bark" id="bark" />
        <Label htmlFor="bark" className="flex items-center cursor-pointer">
          <Image src="/icons/bark.svg" alt="BARK" width={16} height={16} className="mr-2" />
          BARK
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="usdc" id="usdc" />
        <Label htmlFor="usdc" className="flex items-center cursor-pointer">
          <Image src="/icons/usdc.svg" alt="USDC" width={16} height={16} className="mr-2" />
          USDC
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="apple-pay" id="apple-pay" />
        <Label htmlFor="apple-pay" className="flex items-center cursor-pointer">
          <Apple className="mr-2 h-4 w-4" />
          Apple Pay
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="stripe" id="stripe" />
        <Label htmlFor="stripe" className="flex items-center cursor-pointer">
          <Image src="/icons/stripe.svg" alt="Stripe" width={16} height={16} className="mr-2" />
          Stripe
        </Label>
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
        <RadioGroupItem value="paypal" id="paypal" />
        <Label htmlFor="paypal" className="flex items-center cursor-pointer">
          <Image src="/icons/paypal.svg" alt="PayPal" width={16} height={16} className="mr-2" />
          PayPal
        </Label>
      </div>
    </RadioGroup>
  )
}