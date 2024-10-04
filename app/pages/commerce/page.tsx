'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Package, Store, Upload, ArrowLeft, Download, DollarSign, BarChart2, Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock API functions (replace these with actual API calls)
const createProduct = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const updateInventory = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const setupStorefront = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const importCSV = async (file: File) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
const fetchSalesData = async () => new Promise(resolve => setTimeout(() => resolve({
  totalSales: 10000,
  topProducts: [
    { name: 'Product A', sales: 500 },
    { name: 'Product B', sales: 300 },
    { name: 'Product C', sales: 200 },
  ]
}), 1000));
const fetchProducts = async () => new Promise(resolve => setTimeout(() => resolve([
  { id: 'product1', name: 'Product 1', price: 19.99, quantity: 100 },
  { id: 'product2', name: 'Product 2', price: 29.99, quantity: 50 },
  { id: 'product3', name: 'Product 3', price: 39.99, quantity: 75 },
]), 1000));

export default function CommercePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [salesData, setSalesData] = useState<{ totalSales: number, topProducts: { name: string, sales: number }[] } | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [products, setProducts] = useState<{ id: string, name: string, price: number, quantity: number }[]>([])
  const [searchTerm, setSearchTerm] = useState('')

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
        setConfirmationMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`)
        setShowConfirmation(true)
        // Reset form
        e.currentTarget.reset()
        // Refresh product list if necessary
        if (action === 'createProduct' || action === 'updateInventory') {
          loadProducts()
        }
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
          setConfirmationMessage("CSV file imported successfully.")
          setShowConfirmation(true)
          loadProducts() // Refresh product list after import
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

  const loadSalesData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSalesData()
      setSalesData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sales data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="storefront">Storefront</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
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
        </TabsContent>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Package className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Update Inventory</CardTitle>
              <CardDescription>Manage your product inventory.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="searchProduct">Search Products</Label>
                <div className="flex items-center">
                  <Input
                    id="searchProduct"
                    placeholder="Search by product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={loadProducts} variant="outline">
                    <Search className="w-4 h-4 mr-2" style={{color: '#D0BFB4'}} />
                    Refresh
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Update</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="storefront">
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
        </TabsContent>
        <TabsContent value="import">
          <Card>
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
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BarChart2 className="w-5 h-5 mr-2" style={{color: '#D0BFB4'}} />Sales Overview</CardTitle>
              <CardDescription>View your sales data and top-selling products.</CardDescription>
            </CardHeader>
            <CardContent>
              {salesData ? (
                <div>
                  <p className="text-2xl font-bold mb-4">Total Sales: ${salesData.totalSales.toLocaleString()}</p>
                  <h3 className="text-lg font-semibold mb-2">Top Products:</h3>
                  <ul>
                    {salesData.topProducts.map((product, index) => (
                      <li key={index} className="mb-2">
                        {product.name}: {product.sales} sales
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Button onClick={loadSalesData} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Load Sales Data'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" style={{color: '#D0BFB4'}} />
        <AlertTitle>Payment Methods</AlertTitle>
        <AlertDescription>
          Your store supports payments in USDC, BARK, SOL, and accepts payments via Stripe and Solana Pay.
        </AlertDescription>
      </Alert>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              {confirmationMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}