'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet } from 'lucide-react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      if (image) {
        formData.append('image', image)
      }
      formData.append('attributes', JSON.stringify(attributes))
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
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Create NFT Blink</h1>
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
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <Label htmlFor="name">NFT Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter NFT name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter NFT description"
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Upload Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
              {image && (
                <div className="mt-2">
                  <img src={URL.createObjectURL(image)} alt="NFT Preview" className="max-w-full h-auto" />
                </div>
              )}
            </div>
            <div>
              <Label>Attributes</Label>
              {attributes.map((attr, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Trait"
                    value={attr.trait_type}
                    onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => removeAttribute(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addAttribute} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </div>
            <div>
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
            <Button type="submit" className="w-full">
              <ImageIcon className="mr-2 h-4 w-4" />
              Create NFT Blink
            </Button>
          </motion.form>
        )}
      </main>
    </div>
  )
}