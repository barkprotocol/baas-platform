import React from 'react';
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

// Function to calculate order summary
export function calculateOrderSummary(paymentMethod: PaymentMethod): OrderSummary {
  const basePrice = products[paymentMethod]?.price || 0; // Assuming products is a record of PaymentMethod to product details
  const merchantFee = basePrice * (MERCHANT_FEE_PERCENTAGE / 100);
  const solanaTxFee = paymentMethod === 'SOL' ? SOLANA_TX_FEE : 0;
  const subtotal = basePrice + merchantFee + solanaTxFee;
  const tax = subtotal * (TAX_RATE / 100);
  const total = subtotal + tax;

  return {
    basePrice,
    merchantFee,
    solanaTxFee,
    subtotal,
    tax,
    total: Number(total.toFixed(6)), // Ensuring total has a fixed number of decimal places
    merchantFeePercentage: MERCHANT_FEE_PERCENTAGE,
    taxRate: TAX_RATE,
  };
}

// React component for displaying order summary
interface OrderSummaryProps {
  paymentMethod: PaymentMethod;
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({ paymentMethod }) => {
  const summary = calculateOrderSummary(paymentMethod);

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <ul>
        <li>Base Price: {summary.basePrice.toFixed(2)} SOL</li>
        <li>Merchant Fee ({summary.merchantFeePercentage}%): {summary.merchantFee.toFixed(6)} SOL</li>
        <li>Solana Transaction Fee: {summary.solanaTxFee.toFixed(6)} SOL</li>
        <li>Subtotal: {summary.subtotal.toFixed(2)} SOL</li>
        <li>Tax ({summary.taxRate}%): {summary.tax.toFixed(2)} SOL</li>
        <li>Total: {summary.total.toFixed(2)} SOL</li>
      </ul>
    </div>
  );
};

export default OrderSummaryComponent;
