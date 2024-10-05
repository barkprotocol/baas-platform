'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Package, Store, Upload, ArrowLeft, Download, BarChart2, Search, Wallet, Settings, Link } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import ProductList from './products'
import { createProduct, updateInventory, setupStorefront, importCSV, exportCSV, fetchSalesData, updateMerchantSettings, connectThirdPartyPlatform } from '@/lib/e-commerce/api'

const iconColor = "#D0BFB4"

export default function CommerceDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [salesData, setSalesData] = useState<{ totalSales: number, topProducts: { name: string, sales: number }[] } | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [merchantWallet, setMerchantWallet] = useState('')
  const [merchantFee, setMerchantFee] = useState(0)
  const [enableAutoFulfillment, setEnableAutoFulfillment] = useState(false)
  const [enableInventorySync, setEnableInventorySync] = useState(false)
  const [enableMultiCurrency, setEnableMultiCurrency] = useState(false)

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
          result = await setupStorefront({
            ...data,
            merchantWallet,
            merchantFee,
            barkProtocolFee: 0.05, // 0.05 SOL
          })
          break
        case 'updateMerchantSettings':
          result = await updateMerchantSettings({
            merchantWallet,
            merchantFee,
            enableAutoFulfillment,
            enableInventorySync,
            enableMultiCurrency,
          })
          break
        case 'connectThirdParty':
          result = await connectThirdPartyPlatform(data.platform as string)
          break
        default:
          throw new Error('Invalid action')
      }

      if (result.success) {
        setConfirmationMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} processed successfully.`)
        setShowConfirmation(true)
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
          setConfirmationMessage("CSV file imported successfully.")
          setShowConfirmation(true)
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

  const handleCSVExport = async () => {
    setIsLoading(true)
    try {
      const result = await exportCSV()
      if (result.success) {
        const blob = new Blob([result.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'products.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Success",
          description: "Products exported to CSV successfully.",
        })
      } else {
        throw new Error('CSV export failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export products to CSV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToMain = () => {
    router.push('/')
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

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Commerce Dashboard</h1>
        <Button onClick={handleBackToMain} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" color={iconColor} /> Back to Main
        </Button>
      </div>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" color={iconColor} />
        <AlertTitle>Welcome to your Commerce Dashboard!</AlertTitle>
        <AlertDescription>
          Here you can manage your products, update inventory, set up your storefront, and import/export products.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="storefront">Storefront</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="wallet">Merchant Wallet</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Package className="w-5 h-5 mr-2" color={iconColor} />Create a Product</CardTitle>
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
                <Button className="mt-4 w-full sm:w-auto" type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <ProductList />
        </TabsContent>
        <TabsContent value="storefront">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Store className="w-5 h-5 mr-2" color={iconColor} />Setup Storefront</CardTitle>
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
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="paymentGateway">Payment Gateway</Label>
                    <Select name="paymentGateway" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="solana">Solana Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="merchantFee">Merchant Fee (%)</Label>
                    <Input 
                      id="merchantFee" 
                      name="merchantFee" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      value={merchantFee} 
                      onChange={(e) => setMerchantFee(parseFloat(e.target.value))} 
                      required 
                    />
                  </div>
                </div>
                <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
                  {isLoading ? 'Setting up...' : 'Setup Storefront'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="import-export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Upload className="w-5 h-5 mr-2" color={iconColor} />Import/Export Products</CardTitle>
              <CardDescription>Import products from a CSV file or export your products to CSV.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input id="csvFile" type="file" accept=".csv" onChange={handleCSVImport} disabled={isLoading} />
                <Button type="button" disabled={isLoading} onClick={() => document.getElementById('csvFile')?.click()}>
                  {isLoading ? 'Importing...' : 'Import CSV'}
                </Button>
              </div>
              <Button type="button" disabled={isLoading} onClick={handleCSVExport}>
                {isLoading ? 'Exporting...' : 'Export to CSV'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BarChart2 className="w-5 h-5 mr-2" color={iconColor} />Sales Overview</CardTitle>
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
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Wallet className="w-5 h-5 mr-2" color={iconColor} />Merchant Wallet</CardTitle>
              <CardDescription>Set up your merchant wallet for receiving payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                toast({
                  title: "Wallet Updated",
                  description: "Your merchant wallet has been updated successfully.",
                })
              }}>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="merchantWallet">Merchant Wallet Address</Label>
                  <Input 
                    id="merchantWallet" 
                    name="merchantWallet" 
                    placeholder="Enter your Solana wallet address" 
                    value={merchantWallet} 
                    onChange={(e) => setMerchantWallet(e.target.value)}
                    required 
                  />
                </div>
                <Button className="mt-4" type="submit">Update Wallet</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Settings className="w-5 h-5 mr-2" color={iconColor} />Merchant Settings</CardTitle>
              <CardDescription>Configure additional merchant features.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'updateMerchantSettings')}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoFulfillment">Enable Auto-Fulfillment</Label>
                    <Switch
                      id="autoFulfillment"
                      checked={enableAutoFulfillment}
                      onCheckedChange={setEnableAutoFulfillment}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inventorySync">Enable Inventory Sync</Label>
                    <Switch
                      id="inventorySync"
                      checked={enableInventorySync}
                      onCheckedChange={setEnableInventorySync}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multiCurrency">Enable Multi-Currency Support</Label>
                    <Switch
                      id="multiCurrency"
                      checked={enableMultiCurrency}
                      onCheckedChange={setEnableMultiCurrency}
                    />
                  </div>
                </div>
                <Button className="mt-4" type="submit">Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Link className="w-5 h-5 mr-2" color={iconColor} />Third-Party Integrations</CardTitle>
              <CardDescription>Connect your store to third-party e-commerce platforms.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'connectThirdParty')}>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="platform">Select Platform</Label>
                    <Select name="platform" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shopify">Shopify</SelectItem>
                        <SelectItem value="woocommerce">WooCommerce</SelectItem>
                        <SelectItem value="magento">Magento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="mt-4" type="submit">Connect Platform</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" color={iconColor} />
        <AlertTitle>Payment Methods and Fees</AlertTitle>
        <AlertDescription>
          Your store supports payments in USDC, BARK, and SOL. You can accept payments via Stripe and Solana Pay.
          The BARK Protocol commission fee is 0.05 SOL per transaction. Your custom merchant fee is {merchantFee}%.
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