import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

// Import BARK Protocol IDL file from the correct location
import idl from '../idl/bark_protocol.json';

// Define a type for the BARK Protocol IDL
type BarkProtocolIDL = Idl & {
  metadata?: {
    address: string;
  };
};

// Define the type for BARK Protocol program's methods
type BarkProgramMethods = {
  initialize: (args: { authority: PublicKey }) => Promise<void>;
  createBlink: (args: { name: string; amount: number; expirationDate: number }) => Promise<void>;
  processDonation: (args: { blinkId: PublicKey; amount: number }) => Promise<void>;
  makePayment: (args: { blinkId: PublicKey; amount: number }) => Promise<void>;
  mintNFT: (args: { name: string; uri: string }) => Promise<void>;
  startCrowdfunding: (args: { name: string; goal: number; endDate: number }) => Promise<void>;
  sendGift: (args: { recipient: PublicKey; amount: number }) => Promise<void>;
  createMerchant: (args: { name: string; description: string }) => Promise<void>;
};

export const useProgram = () => {
  // Set up the provider
  const getProvider = () => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, window.solana, { commitment: 'confirmed' });
      return provider;
    }
    throw new Error('Wallet not found');
  };

  const provider = getProvider();

  // Create the program
  const programId = new PublicKey(idl.metadata?.address || 'BARK_PROGRAM_ID_HERE');
  const program = new Program(idl as BarkProtocolIDL, programId, provider) as Program<BarkProgramMethods>;

  return { program, connection: provider.connection };
};

// Helper function to convert a date to a Unix timestamp
export const dateToUnixTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Helper function to convert a Unix timestamp to a Date object
export const unixTimestampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};