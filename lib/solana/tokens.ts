// solana/tokens.ts

import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getMint,
  getAccount,
} from '@solana/spl-token';

// Initialize Solana connection
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

/**
 * Create a new token mint on Solana
 * @param payer - The Keypair that will pay for the transaction
 * @param mintAuthority - The mint authority for the new token
 * @param freezeAuthority - The freeze authority (optional)
 * @param decimals - Number of decimal places for the token (default 9, like SOL)
 * @returns - The PublicKey of the newly created token mint
 */
export const createTokenMint = async (
  payer: Keypair,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null = null,
  decimals: number = 9
) => {
  try {
    const mint = await createMint(
      connection,
      payer,
      mintAuthority,
      freezeAuthority,
      decimals
    );
    console.log('Token Mint Created:', mint.toBase58());
    return mint;
  } catch (error) {
    console.error('Error creating token mint:', error);
    throw error;
  }
};

/**
 * Mint new tokens to an associated token account
 * @param mint - The token mint PublicKey
 * @param destination - The destination PublicKey (associated token account)
 * @param amount - Amount of tokens to mint
 * @param mintAuthority - Keypair with authority to mint tokens
 */
export const mintTokens = async (
  mint: PublicKey,
  destination: PublicKey,
  amount: number,
  mintAuthority: Keypair
) => {
  try {
    await mintTo(connection, mintAuthority, mint, destination, mintAuthority.publicKey, amount);
    console.log(`${amount} tokens minted to ${destination.toBase58()}`);
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

/**
 * Transfer tokens between accounts
 * @param source - The source PublicKey (associated token account)
 * @param destination - The destination PublicKey (associated token account)
 * @param amount - Amount of tokens to transfer
 * @param owner - Keypair that owns the source account
 */
export const transferTokens = async (
  source: PublicKey,
  destination: PublicKey,
  amount: number,
  owner: Keypair
) => {
  try {
    const transaction = new Transaction().add(
      transfer(
        source, 
        destination, 
        owner.publicKey, 
        amount, 
        []
      )
    );
    await connection.sendTransaction(transaction, [owner]);
    console.log(`${amount} tokens transferred from ${source.toBase58()} to ${destination.toBase58()}`);
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

/**
 * Get or create an associated token account for a given mint and owner
 * @param mint - The token mint PublicKey
 * @param owner - The owner PublicKey of the associated token account
 * @param payer - The payer Keypair for account creation
 * @returns - The associated token account PublicKey
 */
export const getOrCreateTokenAccount = async (
  mint: PublicKey,
  owner: PublicKey,
  payer: Keypair
) => {
  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      owner
    );
    console.log('Token account created/retrieved:', tokenAccount.address.toBase58());
    return tokenAccount;
  } catch (error) {
    console.error('Error getting/creating token account:', error);
    throw error;
  }
};

/**
 * Fetch account information for a given token account
 * @param tokenAccount - The PublicKey of the token account
 * @returns - Token account information
 */
export const getTokenAccountInfo = async (tokenAccount: PublicKey) => {
  try {
    const accountInfo = await getAccount(connection, tokenAccount);
    console.log('Token account info:', accountInfo);
    return accountInfo;
  } catch (error) {
    console.error('Error fetching token account info:', error);
    throw error;
  }
};

/**
 * Fetch mint information for a given token mint
 * @param mint - The token mint PublicKey
 * @returns - Mint information
 */
export const getMintInfo = async (mint: PublicKey) => {
  try {
    const mintInfo = await getMint(connection, mint);
    console.log('Mint info:', mintInfo);
    return mintInfo;
  } catch (error) {
    console.error('Error fetching mint info:', error);
    throw error;
  }
};
