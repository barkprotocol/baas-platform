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
  const handleCurrencyChange = (value: string) => {
    const selected = currencies.find(c => c.symbol === value) || currencies[0];
    setSelectedCurrency(selected);
  };

  return (
    <div>
      <Label htmlFor="currency" className={isDarkMode ? 'text-gray-300' : ''}>
        Select Currency
      </Label>
      <Select value={selectedCurrency.symbol} onValueChange={handleCurrencyChange}>
        <SelectTrigger
          id="currency"
          aria-label="Currency Selector"
          className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
        >
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
          {currencies.map((currency) => (
            <SelectItem key={currency.symbol} value={currency.symbol} className={isDarkMode ? 'text-white' : 'text-black'}>
              <div className="flex items-center">
                <Image
                  src={currency.icon}
                  alt={`${currency.name} icon`}
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
  );
}
