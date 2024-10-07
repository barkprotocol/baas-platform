import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NFTFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
}

export function NFTForm({ onSubmit, isLoading, isWalletConnected, solPrice }: NFTFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, description, imageUrl })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to mint an NFT.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nft-name">NFT Name</Label>
        <Input
          id="nft-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter NFT name"
          required
        />
      </div>
      <div>
        <Label htmlFor="nft-description">Description</Label>
        <Textarea
          id="nft-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter NFT description"
          required
        />
      </div>
      <div>
        <Label htmlFor="nft-image">Image URL</Label>
        <Input
          id="nft-image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          required
        />
      </div>
      <p className="text-sm text-gray-500">
        Minting fee: 0.1 SOL {solPrice ? `(~$${(0.1 * solPrice).toFixed(2)})` : ''}
      </p>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Minting...' : 'Mint NFT'}
      </Button>
    </form>
  )
}