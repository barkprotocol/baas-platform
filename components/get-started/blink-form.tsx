import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BlinkFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
}

export function BlinkForm({ onSubmit, isLoading, isWalletConnected }: BlinkFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, amount: parseFloat(amount) })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to create a Blink.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="blink-name">Blink Name</Label>
        <Input
          id="blink-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Blink name"
          required
        />
      </div>
      <div>
        <Label htmlFor="blink-amount">Amount (SOL)</Label>
        <Input
          id="blink-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in SOL"
          required
          min="0"
          step="0.01"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Blink'}
      </Button>
    </form>
  )
}