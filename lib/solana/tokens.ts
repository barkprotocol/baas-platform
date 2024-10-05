import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token, AccountLayout } from '@solana/spl-token';

export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const BARK_MINT = new PublicKey('BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo');

export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<number> {
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(walletAddress, { mint: tokenMintAddress });
    
    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    const accountInfo = await connection.getAccountInfo(tokenAccounts.value[0].pubkey);
    if (!accountInfo) {
      throw new Error('Failed to fetch token account info');
    }

    const accountData = AccountLayout.decode(accountInfo.data);
    return Number(accountData.amount) / Math.pow(10, await getTokenDecimals(connection, tokenMintAddress));
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
}

export async function getTokenDecimals(connection: Connection, tokenMintAddress: PublicKey): Promise<number> {
  try {
    const token = new Token(connection, tokenMintAddress, TOKEN_PROGRAM_ID, PublicKey.default);
    const mintInfo = await token.getMintInfo();
    return mintInfo.decimals;
  } catch (error) {
    console.error('Error fetching token decimals:', error);
    throw error;
  }
}

export async function createAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  tokenMintAddress: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  try {
    const token = new Token(connection, tokenMintAddress, TOKEN_PROGRAM_ID, payer);
    return await token.getOrCreateAssociatedAccountInfo(owner);
  } catch (error) {
    console.error('Error creating associated token account:', error);
    throw error;
  }
}