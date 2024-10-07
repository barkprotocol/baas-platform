import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SwapFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  isWalletConnected: boolean
  solPrice: number | null
  usdcPrice: number | null
}

export function SwapForm({ onSubmit, isLoading, isWalletConnected, solPrice, usdcPrice }: SwapFormProps) {
  const [fromAmount, setFromAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('SOL')
  const [toCurrency, setToCurrency] = useState('USDC')
  const [estimatedAmount, setEstimatedAmount] = useState('')

  useEffect(() => {
    if (fromAmount && solPrice && usdcPrice) {
      let estimated = 0
      if (fromCurrency === 'SOL' && toCurrency === 'USDC') {
        estimated = parseFloat(fromAmount) * (solPrice / usdcPrice)
      } else if (fromCurrency === 'USDC' && toCurrency === 'SOL') {
        estimated = parseFloat(fromAmount) * (usdcPrice / solPrice)
      }
      setEstimatedAmount(estimated.toFixed(6))
    } else {
      setEstimatedAmount('')
    }
  }, [fromAmount, fromCurrency, toCurrency, solPrice, usdcPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ fromAmount: parseFloat(fromAmount), fromCurrency, toCurrency, estimatedAmount: parseFloat(estimatedAmount) })
  }

  if (!isWalletConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Please connect your wallet to perform a swap.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="from-amount">From Amount</Label>
        <Input
          id="from-amount"
          type="number"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          placeholder={`Enter amount in ${fromCurrency}`}
          required
          min="0"
          step="0.000001"
        />
      </div>
      <div>
        <Label htmlFor="from-currency">From Currency</Label>
        <Select value={fromCurrency} onValueChange={setFromCurrency}>
          <SelectTrigger id="from-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOL">SOL {solPrice ? `($${solPrice.toFixed(2)})` : ''}</SelectItem>
            <SelectItem value="USDC">USDC {usdcPrice ? `($${usdcPrice.toFixed(2)})` : ''}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="to-currency">To Currency</Label>
        <Select value={toCurrency} onValueChange={setToCurrency}>
          <SelectTrigger id="to-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOL">SOL {solPrice ? `($${solPrice.toFixed(2)})` : ''}</SelectItem>
            <SelectItem value="USDC">USDC {usdcPrice ? `($${usdcPrice.toFixed(2)})` : ''}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Estimated Amount</Label>
        <p className="text-lg font-semibold">{estimatedAmount ? `${estimatedAmount} ${toCurrency}` : 'N/A'}</p>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Swapping...' : 'Swap'}
      </Button>
    </form>
  )
}