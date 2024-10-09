import { PublicKey } from '@solana/web3.js';
import { sendSolanaPayment } from '@/lib/payments/solana-pay';

// Define a type for the wallet
type Wallet = {
  publicKey: PublicKey; // The public key of the wallet
  signTransaction: (transaction: any) => Promise<any>; // Function to sign a transaction
  // Add any other necessary wallet properties here
};

type PaymentParams = {
  fromAddress: string;
  toAddress: string;
  amount: number;
  wallet: Wallet; // Use the specific Wallet type
};

export const handleSolanaPayment = async ({
  fromAddress,
  toAddress,
  amount,
  wallet,
}: PaymentParams): Promise<string> => {
  try {
    // Validate the provided addresses and amount
    if (!fromAddress || !toAddress || amount <= 0) {
      throw new Error('Invalid payment parameters');
    }

    const fromPublicKey = new PublicKey(fromAddress);
    const toPublicKey = new PublicKey(toAddress);

    // Trigger payment action
    const transactionSignature = await sendSolanaPayment(fromPublicKey, toPublicKey, amount, wallet);

    console.log('Transaction Signature:', transactionSignature);
    return transactionSignature;
  } catch (error) {
    console.error('Error in payment action:', error);
    throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
