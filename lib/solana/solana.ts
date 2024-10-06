import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection } from './connections';

export async function getBalance(publicKey: PublicKey): Promise<number> {
  const connection = getConnection();
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

export async function transferSOL(
  from: PublicKey,
  to: PublicKey,
  amount: number
): Promise<string> {
  const connection = getConnection();
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;

  // Note: This function doesn't sign the transaction. The wallet should sign it.
  return transaction.serialize().toString('base64');
}

export async function getAccountInfo(publicKey: PublicKey): Promise<any> {
  const connection = getConnection();
  const accountInfo = await connection.getAccountInfo(publicKey);
  return accountInfo;
}

export async function getTransactionHistory(publicKey: PublicKey, limit: number = 10): Promise<any[]> {
  const connection = getConnection();
  const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
  const transactions = await Promise.all(
    signatures.map(sig => connection.getTransaction(sig.signature))
  );
  return transactions.filter(tx => tx !== null);
}

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getBlockTime(slot: number): Promise<number | null> {
  const connection = getConnection();
  return await connection.getBlockTime(slot);
}

export async function getSlot(): Promise<number> {
  const connection = getConnection();
  return await connection.getSlot();
}