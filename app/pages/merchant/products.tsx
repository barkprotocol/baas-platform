'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import ProductList from '@/components/merchant/product-list'
import ProductForm from '@/components/merchant/product-form'
import { fetchMerchantProducts } from '@/lib/merchant/api'
import { Product } from '@/lib/merchant/types'

export default function ProductManagement() {
  const { publicKey } = useWallet()
  const [products, setProducts] = useState<Product[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  useEffect(() => {
    if (publicKey) {
      fetchMerchantProducts(publicKey.toString()).then(setProducts)
    }
  }, [publicKey])

  if (!publicKey) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to manage your products.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <WalletButton />
      </div>
      <Button onClick={() => setIsAddingProduct(true)} className="mb-6">
        Add New Product
      </Button>
      {isAddingProduct && (
        <ProductForm
          onSubmit={(newProduct) => {
            setProducts([...products, newProduct])
            setIsAddingProduct(false)
          }}
          onCancel={() => setIsAddingProduct(false)}
        />
      )}
      <ProductList
        products={products}
        onEdit={(editedProduct) => {
          setProducts(products.map(p => p.id === editedProduct.id ? editedProduct : p))
        }}
        onDelete={(deletedProductId) => {
          setProducts(products.filter(p => p.id !== deletedProductId))
        }}
      />
    </div>
  )
}