'use client'

import { useState } from 'react'
import { Plus, Zap, MoreVertical, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface Blink {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
}

const mockBlinks: Blink[] = [
  { id: '1', name: 'Coffee Fund', description: 'Quick payments for office coffee', amount: 5, currency: 'USDC', createdAt: '2023-06-01' },
  { id: '2', name: 'Team Lunch', description: 'Collect for team lunches', amount: 15, currency: 'SOL', createdAt: '2023-06-02' },
  { id: '3', name: 'Project Donation', description: 'Donations for our open source project', amount: 50, currency: 'BARK', createdAt: '2023-06-03' },
]

export default function Blinks() {
  const [blinks, setBlinks] = useState<Blink[]>(mockBlinks)
  const [newBlink, setNewBlink] = useState<Partial<Blink>>({})
  const { toast } = useToast()

  const handleCreateBlink = () => {
    if (newBlink.name && newBlink.amount && newBlink.currency) {
      const createdBlink: Blink = {
        id: Date.now().toString(),
        name: newBlink.name,
        description: newBlink.description || '',
        amount: newBlink.amount,
        currency: newBlink.currency,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setBlinks([createdBlink, ...blinks])
      setNewBlink({})
      toast({
        title: "Blink Created",
        description: `Your Blink "${createdBlink.name}" has been created successfully.`,
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Blinks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Blink
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Blink</DialogTitle>
              <DialogDescription>
                Set up a new Blink for quick and easy payments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newBlink.name || ''}
                  onChange={(e) => setNewBlink({ ...newBlink, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newBlink.description || ''}
                  onChange={(e) => setNewBlink({ ...newBlink, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newBlink.amount || ''}
                  onChange={(e) => setNewBlink({ ...newBlink, amount: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <Input
                  id="currency"
                  value={newBlink.currency || ''}
                  onChange={(e) => setNewBlink({ ...newBlink, currency: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateBlink}>Create Blink</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blinks.map((blink) => (
          <Card key={blink.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  {blink.name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit Blink</DropdownMenuItem>
                    <DropdownMenuItem>View Transactions</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete Blink</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
              <CardDescription>{blink.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{blink.amount} {blink.currency}</p>
              <p className="text-sm text-muted-foreground">Created on {blink.createdAt}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Blink
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}