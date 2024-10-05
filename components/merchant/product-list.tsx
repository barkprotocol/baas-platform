import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Product } from '@/lib/merchant/types'
import ProductForm from './product-form'

interface ProductListProps {
  products: Product[]
  onEdit: (editedProduct: Product) => void
  onDelete: (deletedProductId: string) => void
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price (SOL)</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button onClick={() => setEditingProduct(product)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => onDelete(product.id)} variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(editedProduct) => {
            onEdit(editedProduct)
            setEditingProduct(null)
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  )
}