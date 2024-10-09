'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Image as ImageIcon, Plus, Trash2, Wallet, Loader2 } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { useToast } from "@/components/ui/use-toast"

interface Attribute {
  trait_type: string
  value: string
}

export default function CreateNFTBlinkPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [attributes, setAttributes] = useState<Attribute[]>([{ trait_type: '', value: '' }])
  const [supply, setSupply] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleAttributeChange = (index: number, key: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index][key] = value
    setAttributes(newAttributes)
  }

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }])
  }

  const removeAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index)
    setAttributes(newAttributes)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      if (image) {
        formData.append('image', image)
      }
      formData.append('attributes', JSON.stringify(attributes.filter(attr => attr.trait_type && attr.value)))
      formData.append('supply', supply)

      const response = await fetch('/api/blinks/nft', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "NFT Blink Created",
          description: "Your NFT Blink has been successfully created.",
        })
        router.push('/blinks')
      } else {
        throw new Error(data.error || 'Failed to create NFT Blink')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while creating the NFT Blink",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  const isFormValid = name && description && image && supply && attributes.some(attr => attr.trait_type && attr.value)

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 sm:mb-0">Create NFT Blink</h1>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button asChild variant="outline">
            <Link href="/blinks/create">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {!publicKey ? (
          <Alert className="mb-6">
            <Wallet className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to create an NFT Blink. You need a connected wallet to interact with the Solana blockchain.
            </AlertDescription>
          </Alert>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create an NFT Blink</CardTitle>
                <CardDescription>Fill in the details to create your NFT Blink</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">NFT Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter NFT name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter NFT description"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                    />
                    {image && (
                      <div className="mt-2 relative w-full h-64">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="NFT Preview"
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Attributes</Label>
                    {attributes.map((attr, index) => (
                      <div key={index} className="flex space-x-2 mt-2">
                        <Input
                          placeholder="Trait"
                          value={attr.trait_type}
                          onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                          aria-label={`Attribute ${index + 1} Trait`}
                        />
                        <Input
                          placeholder="Value"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                          aria-label={`Attribute ${index + 1} Value`}
                        />
                        <Button type="button" variant="outline" onClick={() => removeAttribute(index)} aria-label={`Remove Attribute ${index + 1}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addAttribute} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attribute
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supply">Supply</Label>
                    <Input
                      id="supply"
                      type="number"
                      value={supply}
                      onChange={(e) => setSupply(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Create NFT Blink
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm NFT Blink Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this NFT Blink? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button onClick={handleConfirmedSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}