import { PublicKey } from '@solana/web3.js';
import { sendSolanaPayment } from '../lib/payments/solana-pay';

export const handleSolanaPayment = async (fromAddress: string, toAddress: string, amount: number, wallet: any) => {
  try {
    const fromPublicKey = new PublicKey(fromAddress);
    const toPublicKey = new PublicKey(toAddress);

    // Trigger payment action
    const transactionSignature = await sendSolanaPayment(fromPublicKey, toPublicKey, amount, wallet);

    console.log('Transaction Signature:', transactionSignature);
    return transactionSignature;
  } catch (error) {
    console.error('Error in payment action:', error);
    throw error;
  }
};
