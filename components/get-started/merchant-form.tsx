import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MerchantFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
}

export function MerchantForm({ onSubmit, isLoading, isWalletConnected }: MerchantFormProps) {
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ businessName, description, websiteUrl })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to create a merchant account.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="business-name">Business Name</Label>
        <Input
          id="business-name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter your business name"
          required
        />
      </div>
      <div>
        <Label htmlFor="business-description">Business Description</Label>
        <Textarea
          id="business-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your business"
          required
        />
      </div>
      <div>
        <Label htmlFor="website-url">Website URL</Label>
        <Input
          id="website-url"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="Enter your website URL"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Merchant Account'}
      </Button>
    </form>
  )
}