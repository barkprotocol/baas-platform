'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { fetchProducts, updateProductQuantity } from '@/lib/e-commerce/api'

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

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

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    setIsLoading(true)
    try {
      const result = await updateProductQuantity(productId, newQuantity)
      if (result.success) {
        setProducts(products.map(p => p.id === productId ? { ...p, quantity: newQuantity } : p))
        toast({
          title: "Success",
          description: "Product quantity updated successfully.",
        })
      } else {
        throw new Error('Failed to update quantity')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product quantity. Please try again.",
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
    <div>
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
          <Button onClick={loadProducts} variant="outline" disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
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
                <Input
                  type="number"
                  defaultValue={product.quantity}
                  className="w-20 mr-2"
                  onBlur={(e) => {
                    const newQuantity = parseInt(e.target.value, 10)
                    if (newQuantity !== product.quantity) {
                      handleUpdateQuantity(product.id, newQuantity)
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => handleUpdateQuantity(product.id, product.quantity)}>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}