'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, Download, Plus, Image as ImageIcon, Grid, Wallet, DollarSign, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock API functions (replace these with actual API calls)
const mintNFT = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true, tokenId: '123456', programId: 'ABC123', contractAddress: '0x1234...5678' }), 1000));
const fetchNFTs = async () => new Promise(resolve => setTimeout(() => resolve([
  { id: '1', name: 'BARK NFT #1', image: '/placeholder.svg?height=200&width=200', description: 'A unique BARK NFT', price: 0.5, isSoldable: false, royalty: 5 },
  { id: '2', name: 'BARK NFT #2', image: '/placeholder.svg?height=200&width=200', description: 'Another unique BARK NFT', price: 1.0, isSoldable: true, royalty: 10 },
]), 1000));
const createCollection = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true, collectionId: 'col123' }), 1000));
const listNFTForSale = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const mintOnMarketplace = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true, marketplaceUrl: 'https://example-marketplace.com/nft/123' }), 1000));

const ListForSaleSchema = z.object({
  salePrice: z.string().min(1, "Price is required"),
  saleDate: z.date({
    required_error: "A sale date is required.",
  }),
});

export default function NFTPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [nfts, setNFTs] = useState<any[]>([])
  const [selectedMarketplace, setSelectedMarketplace] = useState('')
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null)

  const listForSaleForm = useForm<z.infer<typeof ListForSaleSchema>>({
    resolver: zodResolver(ListForSaleSchema),
  })

  const handleMintNFT = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const result = await mintNFT(data)
      if (result.success) {
        toast({
          title: "Success",
          description: (
            <div>
              <p>NFT minted successfully. Token ID: {result.tokenId}</p>
              <p>Program ID: {result.programId}</p>
              <p>Contract Address: {result.contractAddress}</p>
              <a href={`https://solscan.io/token/${result.tokenId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View on Solscan
              </a>
            </div>
          ),
        })
        e.currentTarget.reset()
      } else {
        throw new Error('Minting failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const result = await createCollection(data)
      if (result.success) {
        toast({
          title: "Success",
          description: `Collection created successfully. Collection ID: ${result.collectionId}`,
        })
        e.currentTarget.reset()
      } else {
        throw new Error('Collection creation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFetchNFTs = async () => {
    setIsLoading(true)
    try {
      const fetchedNFTs = await fetchNFTs()
      setNFTs(fetchedNFTs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch NFTs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleListNFTForSale = async (data: z.infer<typeof ListForSaleSchema>) => {
    if (!selectedNFTId) return;
    setIsLoading(true)
    try {
      const result = await listNFTForSale({ ...data, nftId: selectedNFTId })
      if (result.success) {
        toast({
          title: "Success",
          description: `NFT listed for sale successfully.`,
        })
        await handleFetchNFTs() // Refresh the NFT list
      } else {
        throw new Error('Listing failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to list NFT for sale. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedNFTId(null)
    }
  }

  const handleMintOnMarketplace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const result = await mintOnMarketplace({ ...data, marketplace: selectedMarketplace })
      if (result.success) {
        toast({
          title: "Success",
          description: `NFT minted successfully on ${selectedMarketplace}. Marketplace URL: ${result.marketplaceUrl}`,
        })
        e.currentTarget.reset()
      } else {
        throw new Error('Marketplace minting failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to mint NFT on ${selectedMarketplace}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToMain = () => {
    router.push('/')
  }

  const handleImageDownload = (imageUrl: string, imageName: string) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = imageName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast({
        title: "Error",
        description: "Failed to download NFT. Please try again.",
        variant: "destructive",
      }));
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">NFT Dashboard</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Main
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
        <AlertTitle>Welcome to your NFT Dashboard!</AlertTitle>
        <AlertDescription>
          Here you can mint new NFTs, view your existing NFTs, manage your collections, list NFTs for sale, and mint on various marketplaces.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="mint" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mint">Mint NFT</TabsTrigger>
          <TabsTrigger value="view">View NFTs</TabsTrigger>
          <TabsTrigger value="collections">Manage Collections</TabsTrigger>
          <TabsTrigger value="marketplace">NFT Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="mint">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Plus className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Mint a New NFT</CardTitle>
              <CardDescription>Create a unique digital asset on the blockchain.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMintNFT}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftName">NFT Name</Label>
                    <Input id="nftName" name="nftName" placeholder="Enter NFT name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftDescription">NFT Description</Label>
                    <Textarea id="nftDescription" name="nftDescription" placeholder="Describe your NFT" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftImage">NFT Image URL</Label>
                    <Input id="nftImage" name="nftImage" placeholder="Enter image URL" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftCollection">Collection</Label>
                    <Select name="nftCollection">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collection1">Collection 1</SelectItem>
                        <SelectItem value="collection2">Collection 2</SelectItem>
                        <SelectItem value="collection3">Collection 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftRoyalty">Royalty Percentage</Label>
                    <Input id="nftRoyalty" name="nftRoyalty" type="number" min="0" max="100" step="0.1" placeholder="Enter royalty percentage" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="nftSoldable" name="nftSoldable" />
                    <Label htmlFor="nftSoldable">List for sale immediately</Label>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nftPrice">Price (if listed for sale)</Label>
                    <Input id="nftPrice" name="nftPrice" type="number" step="0.01" placeholder="Enter price" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Minting...' : 'Mint NFT'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleImageDownload(document.getElementById('nftImage')?.value || '', 'nft-image.png')}>
                    <Download className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />
                    Download NFT
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Grid className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Your NFTs</CardTitle>
              <CardDescription>View and manage your minted NFTs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleFetchNFTs} disabled={isLoading} className="mb-4">
                {isLoading ? 'Fetching...' : 'Refresh NFTs'}
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts.map((nft) => (
                  <Card key={nft.id}>
                    <CardHeader>
                      <CardTitle>{nft.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover mb-2 rounded-md" />
                      <p className="text-sm text-muted-foreground mb-2">{nft.description}</p>
                      <p className="text-sm font-semibold">Price: {nft.price} SOL</p>
                      <p className="text-sm">Status: {nft.isSoldable ? 'Listed for sale' : 'Not for sale'}</p>
                      <p className="text-sm">Royalty: {nft.royalty}%</p>
                    </CardContent>
                    <CardFooter>
                      {!nft.isSoldable && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full" onClick={() => setSelectedNFTId(nft.id)}>
                              <DollarSign className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />
                              List for Sale
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>List NFT for Sale</DialogTitle>
                              <DialogDescription>Set a price and date to list this NFT for sale.</DialogDescription>
                            </DialogHeader>
                            <Form {...listForSaleForm}>
                              <form onSubmit={listForSaleForm.handleSubmit(handleListNFTForSale)} className="space-y-8">
                                <FormField
                                  control={listForSaleForm.control}
                                  name="salePrice"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Sale Price (SOL)</FormLabel>
                                      <FormControl>
                                        <Input type="number" step="0.01" placeholder="Enter price in SOL" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={listForSaleForm.control}
                                  name="saleDate"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel>Sale Date</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant={"outline"}
                                              className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                              )}
                                            >
                                              {field.value ? (
                                                format(field.value, "PPP")
                                              ) : (
                                                <span>Pick a date</span>
                                              )}
                                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                              date < new Date()
                                            }
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      <FormDescription>
                                        Choose the date when you want to list this NFT for sale.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" disabled={isLoading}>
                                  {isLoading ? 'Listing...' : 'List for Sale'}
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Wallet className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Manage Collections</CardTitle>
              <CardDescription>Create and manage your NFT collections.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCollection}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="collectionName">Collection Name</Label>
                    <Input id="collectionName" name="collectionName" placeholder="Enter collection name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="collectionDescription">Collection Description</Label>
                    <Textarea id="collectionDescription" name="collectionDescription" placeholder="Describe your collection" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="collectionImage">Collection Image URL</Label>
                    <Input id="collectionImage" name="collectionImage" placeholder="Enter image URL" required />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Collection'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleImageDownload(document.getElementById('collectionImage')?.value || '', 'collection-image.png')}>
                    <Download className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />
                    Download NFT
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ExternalLink className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />NFT Marketplace</CardTitle>
              <CardDescription>Create and list your NFT on popular marketplaces.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMintOnMarketplace}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="marketplace">Select Marketplace</Label>
                    <Select onValueChange={setSelectedMarketplace} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a marketplace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opensea">OpenSea</SelectItem>
                        <SelectItem value="rarible">Rarible</SelectItem>
                        <SelectItem value="magiceden">Magic Eden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="marketplaceNftName">NFT Name</Label>
                    <Input id="marketplaceNftName" name="marketplaceNftName" placeholder="Enter NFT name" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="marketplaceNftDescription">NFT Description</Label>
                    <Textarea id="marketplaceNftDescription" name="marketplaceNftDescription" placeholder="Describe your NFT" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="marketplaceNftImage">NFT Image URL</Label>
                    <Input id="marketplaceNftImage" name="marketplaceNftImage" placeholder="Enter image URL" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="marketplaceNftPrice">Price</Label>
                    <Input id="marketplaceNftPrice" name="marketplaceNftPrice" type="number" step="0.01" placeholder="Enter price" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="marketplaceNftRoyalty">Royalty Percentage</Label>
                    <Input id="marketplaceNftRoyalty" name="marketplaceNftRoyalty" type="number" min="0" max="100" step="0.1" placeholder="Enter royalty percentage" required />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Minting...' : `Mint on ${selectedMarketplace || 'Selected Marketplace'}`}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleImageDownload(document.getElementById('marketplaceNftImage')?.value || '', 'marketplace-nft-image.png')}>
                    <Download className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />
                    Download NFT
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}