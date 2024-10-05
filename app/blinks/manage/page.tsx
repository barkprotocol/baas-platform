'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Eye, Pencil, Trash2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

// Mock data for Blinks
const initialBlinks = [
  { id: '1', name: 'Donation Blink', type: 'payment', amount: 5, expirationDate: '2024-12-31' },
  { id: '2', name: 'Vote for Project', type: 'vote', expirationDate: '2024-06-30' },
  { id: '3', name: 'Limited NFT Mint', type: 'nft', amount: 1, expirationDate: '2024-09-15' },
]

export default function ManageBlinksPage() {
  const [blinks, setBlinks] = useState(initialBlinks)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    setBlinks(blinks.filter(blink => blink.id !== id))
    toast({
      title: "Blink Deleted",
      description: "The Blink has been successfully deleted.",
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/blinks">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to Blinks
        </Link>
      </Button>

      <h1 className="text-4xl font-bold mb-8">Manage Your Blinks</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blinks.map((blink) => (
            <TableRow key={blink.id}>
              <TableCell>{blink.name}</TableCell>
              <TableCell>{blink.type}</TableCell>
              <TableCell>{blink.amount ? `${blink.amount} SOL` : 'N/A'}</TableCell>
              <TableCell>{blink.expirationDate}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/blinks/${blink.id}`}>
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/blinks/${blink.id}/edit`}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(blink.id)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8">
        <Button asChild>
          <Link href="/blinks/create">Create New Blink</Link>
        </Button>
      </div>
    </div>
  )
}