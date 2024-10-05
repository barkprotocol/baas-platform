import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

export async function getBalance(connection: Connection, publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

export async function transferSOL(
  connection: Connection,
  wallet: WalletContextState,
  recipient: PublicKey,
  amount: number
): Promise<string> {
  try {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    console.error('Error transferring SOL:', error);
    throw error;
  }
}

export async function transferSPLToken(
  connection: Connection,
  wallet: WalletContextState,
  tokenMintAddress: PublicKey,
  recipientTokenAccount: PublicKey,
  amount: number
): Promise<string> {
  try {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    const sourceTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: tokenMintAddress });
    if (sourceTokenAccount.value.length === 0) throw new Error('Source token account not found');

    const transaction = new Transaction().add(
      createTransferInstruction(
        sourceTokenAccount.value[0].pubkey,
        recipientTokenAccount,
        wallet.publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    console.error('Error transferring SPL token:', error);
    throw error;
  }
}