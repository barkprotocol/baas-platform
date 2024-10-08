import { PaymentMethod, products } from './products';

// Fees and tax rates
const MERCHANT_FEE_PERCENTAGE = 2.5;
const SOLANA_TX_FEE = 0.000005; // SOL
const TAX_RATE = 8.5; // 8.5%

export interface OrderSummary {
  basePrice: number;
  merchantFee: number;
  solanaTxFee: number;
  subtotal: number;
  tax: number;
  total: number;
  merchantFeePercentage: number;
  taxRate: number;
}

export function calculateOrderSummary(paymentMethod: PaymentMethod): OrderSummary {
  const basePrice = products[paymentMethod]; // Ensure you're accessing the price correctly

  const merchantFee = basePrice * (MERCHANT_FEE_PERCENTAGE / 100);
  const solanaTxFee = paymentMethod === 'SOL' ? SOLANA_TX_FEE : 0;

  const subtotal = basePrice + merchantFee + solanaTxFee;
  const tax = subtotal * (TAX_RATE / 100);
  const total = subtotal + tax;

  return {
    basePrice,
    merchantFee: Number(merchantFee.toFixed(2)), // Round to 2 decimal places
    solanaTxFee: Number(solanaTxFee.toFixed(6)), // Round to 6 decimal places
    subtotal: Number(subtotal.toFixed(2)), // Round to 2 decimal places
    tax: Number(tax.toFixed(2)), // Round to 2 decimal places
    total: Number(total.toFixed(6)), // Round to 6 decimal places
    merchantFeePercentage: MERCHANT_FEE_PERCENTAGE,
    taxRate: TAX_RATE,
  };
}
