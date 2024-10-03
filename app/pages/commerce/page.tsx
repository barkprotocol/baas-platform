'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Package, Store, Upload, ArrowLeft, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock API functions (replace these with actual API calls)
const createProduct = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const updateInventory = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const setupStorefront = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const importCSV = async (file: File) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

export default function CommercePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      let result;
      switch (action) {
        case 'createProduct':
          result = await createProduct(data)
          break
        case 'updateInventory':
          result = await updateInventory(data)
          break
        case 'setupStorefront':
          result = await setupStorefront(data)
          break
        default:
          throw new Error('Invalid action')
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`,
        })
        // Reset form
        e.currentTarget.reset()
      } else {
        throw new Error('Operation failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process ${action}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      try {
        const result = await importCSV(file)
        if (result.success) {
          toast({
            title: "Success",
            description: "CSV file imported successfully.",
          })
        } else {
          throw new Error('CSV import failed')
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import CSV file. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBackToMain = () => {
    router.push('/') // Navigate to the landing page
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
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      }));
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Commerce Dashboard</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Main
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
        <AlertTitle>Welcome to your Commerce Dashboard!</AlertTitle>
        <AlertDescription>
          Here you can manage your products, update inventory, set up your storefront, and import products from CSV.
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Package className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Create a Product</CardTitle>
            <CardDescription>Add a new product to your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'createProduct')}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" name="productName" placeholder="Enter product name" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productDescription">Product Description</Label>
                  <Textarea id="productDescription" name="productDescription" placeholder="Describe your product" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productPrice">Price</Label>
                  <Input id="productPrice" name="productPrice" placeholder="Enter price" type="number" step="0.01" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productQuantity">Initial Quantity</Label>
                  <Input id="productQuantity" name="productQuantity" placeholder="Enter initial quantity" type="number" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productImage">Product Image URL</Label>
                  <Input id="productImage" name="productImage" placeholder="Enter image URL" required />
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button className="w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleImageDownload(document.getElementById('productImage')?.value || '', 'product-image.png')}>
                  <Download className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />
                  Download Image
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Package className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Update Inventory</CardTitle>
            <CardDescription>Manage your product inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'updateInventory')}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productId">Product</Label>
                  <Select name="productId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product1">Product 1</SelectItem>
                      <SelectItem value="product2">Product 2</SelectItem>
                      <SelectItem value="product3">Product 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="quantityChange">Quantity Change</Label>
                  <Input id="quantityChange" name="quantityChange" placeholder="Enter quantity change" type="number" required />
                </div>
              </div>
              <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Inventory'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Store className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Setup Storefront</CardTitle>
            <CardDescription>Configure your online store settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'setupStorefront')}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" name="storeName" placeholder="Enter store name" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea id="storeDescription" name="storeDescription" placeholder="Describe your store" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="storeCurrency">Currency</Label>
                  <Select name="storeCurrency" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="bark">BARK</SelectItem>
                      <SelectItem value="sol">SOL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Setup Storefront'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center"><Upload className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Import Products</CardTitle>
          <CardDescription>Import products from a CSV file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input id="csvFile" type="file" accept=".csv" onChange={handleCSVImport} disabled={isLoading} />
            <Button type="button" disabled={isLoading}>
              {isLoading ? 'Importing...' : 'Import CSV'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
        <AlertTitle>Payment Methods</AlertTitle>
        <AlertDescription>
          Your store supports payments in USDC, BARK, SOL, and accepts payments via Stripe and Solana Pay.
        </AlertDescription>
      </Alert>
    </div>
  )
}