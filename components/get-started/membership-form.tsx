import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MembershipFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
}

export function MembershipForm({ onSubmit, isLoading, isWalletConnected }: MembershipFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('30')
  const [price, setPrice] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, description, duration: parseInt(duration), price: parseFloat(price) })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCirc className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to create a membership program.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="membership-name">Membership Name</Label>
        <Input
          id="membership-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter membership name"
          required
        />
      </div>
      <div>
        <Label htmlFor="membership-description">Description</Label>
        <Textarea
          id="membership-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the membership benefits"
          required
        />
      </div>
      <div>
        <Label htmlFor="membership-duration">Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="membership-duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="180">180 days</SelectItem>
            <SelectItem value="365">365 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="membership-price">Price (SOL)</Label>
        <Input
          id="membership-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter membership price in SOL"
          required
          min="0"
          step="0.01"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Membership'}
      </Button>
    </form>
  )
}