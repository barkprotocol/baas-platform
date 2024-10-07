import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GiftFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
  usdcPrice: number | null
}

export function GiftForm({ onSubmit, isLoading, isWalletConnected, solPrice, usdcPrice }: GiftFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('SOL')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ recipient, amount: parseFloat(amount), currency, message })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to send a gift.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="gift-recipient">Recipient Address</Label>
        <Input
          id="gift-recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient's wallet address"
          required
        />
      </div>
      <div>
        <Label htmlFor="gift-amount">Gift Amount</Label>
        <Input
          id="gift-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Enter amount in ${currency}`}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="gift-currency">Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="gift-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOL">SOL {solPrice ? `($${solPrice.toFixed(2)})` : ''}</SelectItem>
            <SelectItem value="USDC">USDC {usdcPrice ? `($${usdcPrice.toFixed(2)})` : ''}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="gift-message">Gift Message</Label>
        <Textarea
          id="gift-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message for the recipient"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Gift'}
      </Button>
    </form>
  )
}