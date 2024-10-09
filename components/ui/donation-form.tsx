import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface DonationFormProps {
  campaignId: string
}

export default function DonationForm({ campaignId }: DonationFormProps) {
  const [amount, setAmount] = useState('')
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: (donationAmount: string) =>
      axios.post('/api/donate', { campaignId, amount: donationAmount }),
    onSuccess: () => {
      toast({
        title: "Donation Successful",
        description: `Thank you for your donation of $${amount}!`,
      })
      setAmount('')
    },
    onError: (error) => {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      })
      console.error('Donation error:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(amount)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Donation Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter donation amount"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Donate'
        )}
      </Button>
    </form>
  )
}