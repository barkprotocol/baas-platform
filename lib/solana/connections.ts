import { Connection, Commitment, ConnectionConfig } from '@solana/web3.js';

const config: ConnectionConfig = {
  commitment: 'confirmed' as Commitment,
  confirmTransactionInitialTimeout: 60000, // 60 seconds
};

export const MAINNET_RPC_URL = 'https://api.mainnet-beta.solana.com';
export const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
export const TESTNET_RPC_URL = 'https://api.testnet.solana.com';

export function getConnection(network: 'mainnet' | 'devnet' | 'testnet' = 'mainnet'): Connection {
  let rpcUrl: string;

  switch (network) {
    case 'mainnet':
      rpcUrl = MAINNET_RPC_URL;
      break;
    case 'devnet':
      rpcUrl = DEVNET_RPC_URL;
      break;
    case 'testnet':
      rpcUrl = TESTNET_RPC_URL;
      break;
    default:
      throw new Error('Invalid network specified');
  }

  return new Connection(rpcUrl, config);
}

export async function isConnectionHealthy(connection: Connection): Promise<boolean> {
  try {
    const version = await connection.getVersion();
    return !!version;
  } catch (error) {
    console.error('Error checking connection health:', error);
    return false;
  }
}