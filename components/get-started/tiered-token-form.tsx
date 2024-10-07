import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TieredTokenFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
}

interface Tier {
  name: string
  supply: string
  price: string
}

export function TieredTokenForm({ onSubmit, isLoading, isWalletConnected }: TieredTokenFormProps) {
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [tiers, setTiers] = useState<Tier[]>([{ name: '', supply: '', price: '' }])

  const handleAddTier = () => {
    setTiers([...tiers, { name: '', supply: '', price: '' }])
  }

  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index))
  }

  const handleTierChange = (index: number, field: keyof Tier, value: string) => {
    const newTiers = [...tiers]
    newTiers[index][field] = value
    setTiers(newTiers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ tokenName, tokenSymbol, description, tiers })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to create tiered tokens.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="token-name">Token Name</Label>
        <Input
          id="token-name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder="Enter token name"
          required
        />
      </div>
      <div>
        <Label htmlFor="token-symbol">Token Symbol</Label>
        <Input
          id="token-symbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          placeholder="Enter token symbol"
          required
        />
      </div>
      <div>
        <Label htmlFor="token-description">Description</Label>
        <Textarea
          id="token-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your tiered token"
          required
        />
      </div>
      {tiers.map((tier, index) => (
        <div key={index} className="space-y-2 p-4 border rounded-md">
          <div>
            <Label htmlFor={`tier-name-${index}`}>Tier Name</Label>
            <Input
              id={`tier-name-${index}`}
              value={tier.name}
              onChange={(e) => handleTierChange(index, 'name', e.target.value)}
              placeholder="Enter tier name"
              required
            />
          </div>
          <div>
            <Label htmlFor={`tier-supply-${index}`}>Supply</Label>
            <Input
              id={`tier-supply-${index}`}
              type="number"
              value={tier.supply}
              onChange={(e) => handleTierChange(index, 'supply', e.target.value)}
              placeholder="Enter tier supply"
              required
              min="1"
            />
          </div>
          <div>
            <Label htmlFor={`tier-price-${index}`}>Price (SOL)</Label>
            <Input
              id={`tier-price-${index}`}
              type="number"
              value={tier.price}
              onChange={(e) => handleTierChange(index, 'price', e.target.value)}
              placeholder="Enter tier price in SOL"
              required
              min="0"
              step="0.01"
            />
          </div>
          {index > 0 && (
            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveTier(index)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Tier
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddTier}>
        <Plus className="h-4 w-4 mr-2" />
        Add Tier
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Tiered Token'}
      </Button>
    </form>
  )
}