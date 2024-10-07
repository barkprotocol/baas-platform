import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CrowdfundingFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
  usdcPrice: number | null
}

export function CrowdfundingForm({ onSubmit, isLoading, isWalletConnected, solPrice, usdcPrice }: CrowdfundingFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [currency, setCurrency] = useState('SOL')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, goal: parseFloat(goal), currency, deadline })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to start a crowdfunding campaign.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="campaign-title">Campaign Title</Label>
        <Input
          id="campaign-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter campaign title"
          required
        />
      </div>
      <div>
        <Label htmlFor="campaign-description">Description</Label>
        <Textarea
          id="campaign-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your campaign"
          required
        />
      </div>
      <div>
        <Label htmlFor="campaign-goal">Funding Goal</Label>
        <Input
          id="campaign-goal"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={`Enter goal amount in ${currency}`}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="campaign-currency">Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="campaign-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOL">SOL {solPrice ? `($${solPrice.toFixed(2)})` : ''}</SelectItem>
            <SelectItem value="USDC">USDC {usdcPrice ? `($${usdcPrice.toFixed(2)})` : ''}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="campaign-deadline">Deadline</Label>
        <Input
          id="campaign-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Start Campaign'}
      </Button>
    </form>
  )
}