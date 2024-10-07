'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Upload } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'NFT name is required.',
  }),
  description: z.string().min(1, {
    message: 'NFT description is required.',
  }),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: 'Image must be less than 5MB.',
  }),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.string(),
  })).optional(),
  royaltyPercentage: z.number().min(0).max(100),
  supply: z.number().min(1),
  isCollection: z.boolean(),
  collectionName: z.string().optional(),
})

interface MintNFTFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
}

export function MintNFTForm({ onSubmit, isLoading, isWalletConnected, solPrice }: MintNFTFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      royaltyPercentage: 0,
      supply: 1,
      isCollection: false,
      collectionName: '',
    },
  })

  const watchIsCollection = form.watch('isCollection')

  function onFormSubmit(data: z.infer<typeof formSchema>) {
    onSubmit(data)
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue('image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function calculateEstimatedCost() {
    if (solPrice) {
      // Assuming a base cost of 0.01 SOL per NFT
      const baseCost = 0.01
      const supply = form.getValues('supply')
      const cost = baseCost * supply * solPrice
      setEstimatedCost(cost)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NFT Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter NFT name" {...field} />
              </FormControl>
              <FormDescription>
                Provide a name for your NFT.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NFT Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter NFT description"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your NFT.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>NFT Image</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e)
                      onChange(e.target.files?.[0])
                    }}
                    {...rest}
                  />
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover rounded" />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload an image for your NFT (max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="royaltyPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Royalty Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Set the royalty percentage for secondary sales (0-100%).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supply"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supply</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value))
                    calculateEstimatedCost()
                  }}
                />
              </FormControl>
              <FormDescription>
                Set the number of NFTs to mint.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isCollection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Create Collection</FormLabel>
                <FormDescription>
                  Enable this if you want to create a new NFT collection.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {watchIsCollection && (
          <FormField
            control={form.control}
            name="collectionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter collection name" {...field} />
                </FormControl>
                <FormDescription>
                  Provide a name for your new NFT collection.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {estimatedCost !== null && (
          <div className="text-sm text-muted-foreground">
            Estimated cost: ${estimatedCost.toFixed(2)} USD
          </div>
        )}

        <Button type="submit" disabled={isLoading || !isWalletConnected}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Mint NFT
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}