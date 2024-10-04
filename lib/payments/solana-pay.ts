import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createTransfer, encodeURL, parseURL, validateTransfer, FindReferenceError, ValidateTransferError } from '@solana/pay';
import BigNumber from 'bignumber.js';

export async function createSolanaPayTransaction(
  recipient: string,
  amount: number,
  reference: string,
  label: string,
  message: string
): Promise<string> {
  try {
    const recipientPublicKey = new PublicKey(recipient);
    const amountBigNumber = new BigNumber(amount);

    const url = encodeURL({
      recipient: recipientPublicKey,
      amount: amountBigNumber,
      reference: new PublicKey(reference),
      label,
      message,
    });

    return url.toString();
  } catch (error) {
    console.error('Error creating Solana Pay transaction:', error);
    throw new Error('Failed to create Solana Pay transaction');
  }
}

export async function verifySolanaPayTransaction(
  connection: Connection,
  reference: string,
  recipient: string,
  amount: number
): Promise<boolean> {
  try {
    const referencePublicKey = new PublicKey(reference);
    const recipientPublicKey = new PublicKey(recipient);
    const amountBigNumber = new BigNumber(amount);

    const signatureInfo = await findTransactionSignature(connection, referencePublicKey);
    if (!signatureInfo) {
      return false;
    }

    const { signature, slot } = signatureInfo;
    const response = await connection.getTransaction(signature);
    if (!response) {
      return false;
    }

    if (!validateTransfer(response, {
      recipient: recipientPublicKey,
      amount: amountBigNumber,
      reference: referencePublicKey,
    })) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying Solana Pay transaction:', error);
    return false;
  }
}

async function findTransactionSignature(connection: Connection, reference: PublicKey): Promise<{ signature: string; slot: number } | null> {
  try {
    const signatureInfo = await connection.getSignaturesForAddress(reference, { limit: 1 });

    if (signatureInfo.length === 0) {
      return null;
    }

    const [{ signature, slot }] = signatureInfo;
    return { signature, slot };
  } catch (error) {
    if (error instanceof FindReferenceError) {
      return null;
    }
    console.error('Error finding transaction signature:', error);
    throw error;
  }
}

export async function createSolanaPayTransferTransaction(
  connection: Connection,
  payer: PublicKey,
  recipient: PublicKey,
  amount: BigNumber,
  reference: PublicKey,
  memo?: string
): Promise<Transaction> {
  try {
    const tx = await createTransfer(connection, payer, {
      recipient,
      amount,
      reference,
      memo,
    });

    return tx;
  } catch (error) {
    console.error('Error creating Solana Pay transfer transaction:', error);
    throw new Error('Failed to create Solana Pay transfer transaction');
  }
}