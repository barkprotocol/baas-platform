import { PublicKey } from '@solana/web3.js';
import { createQR, encodeURL, TransferRequestURLFields, ValidateTransferError } from '@solana/pay';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface CreateQRCodeParams {
  recipient: string;
  amount: number;
  reference: string;
  label?: string;
  message?: string;
  memo?: string;
}

export function createSolanaPayQRCode({
  recipient,
  amount,
  reference,
  label,
  message,
  memo
}: CreateQRCodeParams): string {
  try {
    const recipientPublicKey = new PublicKey(recipient);
    const amountInLamports = amount * LAMPORTS_PER_SOL;

    const urlParams: TransferRequestURLFields = {
      recipient: recipientPublicKey,
      amount: amountInLamports,
      reference: new PublicKey(reference),
      label,
      message,
      memo
    };

    const url = encodeURL(urlParams);
    const qr = createQR(url);

    return qr.toDataURL();
  } catch (error) {
    if (error instanceof ValidateTransferError) {
      console.error('Invalid transfer params:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function formatSolAmount(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9
  });
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL);
}