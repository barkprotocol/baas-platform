import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Currency } from '@/types/actionboard'

interface CurrencySelectorProps {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  currencies: Currency[]
  isDarkMode: boolean
}

export default function CurrencySelector({ selectedCurrency, setSelectedCurrency, currencies, isDarkMode }: CurrencySelectorProps) {
  return (
    <div>
      <Label htmlFor="currency" className={isDarkMode ? 'text-gray-300' : ''}>Select Currency</Label>
      <Select
        value={selectedCurrency.symbol}
        onValueChange={(value) => setSelectedCurrency(currencies.find(c => c.symbol === value) || currencies[0])}
      >
        <SelectTrigger id="currency" className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
          {currencies.map((currency) => (
            <SelectItem key={currency.symbol} value={currency.symbol} className={isDarkMode ? 'text-white' : ''}>
              <div className="flex items-center">
                <Image
                  src={currency.icon}
                  alt={currency.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {currency.name} ({currency.symbol})
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}