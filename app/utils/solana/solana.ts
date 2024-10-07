import { Connection, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';

export const getConnection = () => {
  const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST;
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
  const connection = new Connection(rpcHost || clusterApiUrl(network as any));
  return connection;
};

export const getProvider = (wallet: any) => {
  const connection = getConnection();
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
  return provider;
};