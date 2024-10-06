import { Connection, Cluster, clusterApiUrl } from '@solana/web3.js';

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    const cluster: Cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as Cluster) || 'devnet';
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || clusterApiUrl(cluster);
    connection = new Connection(endpoint, 'confirmed');
  }
  return connection;
}

export function setCustomEndpoint(endpoint: string): void {
  connection = new Connection(endpoint, 'confirmed');
}

export function resetConnection(): void {
  connection = null;
}

export async function getNetworkVersion(): Promise<string> {
  const conn = getConnection();
  const version = await conn.getVersion();
  return `Solana ${version['solana-core']}`;
}

export async function isConnected(): Promise<boolean> {
  try {
    const conn = getConnection();
    await conn.getVersion();
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    return false;
  }
}

export async function getNetworkStats(): Promise<{ tps: number, blockTime: number }> {
  const conn = getConnection();
  const perfSamples = await conn.getRecentPerformanceSamples(1);
  const blockTime = await conn.getRecentBlockhash().then(res => res.lastValidBlockHeight);
  
  return {
    tps: perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs,
    blockTime,
  };
}