import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StakingFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
}

export function StakingForm({ onSubmit, isLoading, isWalletConnected, solPrice }: StakingFormProps) {
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('30')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ amount: parseFloat(amount), duration: parseInt(duration) })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to stake tokens.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="stake-amount">Stake Amount (SOL)</Label>
        <Input
          id="stake-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to stake"
          required
          min="0"
          step="0.01"
        />
        {solPrice && <p className="text-sm text-gray-500 mt-1">≈ ${(parseFloat(amount) * solPrice).toFixed(2)} USD</p>}
      </div>
      <div>
        <Label htmlFor="stake-duration">Staking Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="stake-duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="180">180 days</SelectItem>
            <SelectItem value="365">365 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm text-gray-500">Estimated APY: 5%</p>
        <p className="text-sm text-gray-500">
          Estimated Rewards: {((parseFloat(amount) * 0.05 * parseInt(duration)) / 365).toFixed(4)} SOL
        </p>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Staking...' : 'Stake Tokens'}
      </Button>
    </form>
  )
}