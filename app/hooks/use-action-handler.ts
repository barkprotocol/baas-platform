import { useState, useCallback } from 'react';
import { Action, Currency, ActionResult } from '@/types/actionboard';
import { useToast } from "@/components/ui/use-toast";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { IDL } from '@/idl/bark_protocol';

const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

export function useActionHandler() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();

  const handleAction = useCallback(async (
    action: Action,
    currency: Currency,
    isSimulation: boolean,
    memo: string,
    amount: number
  ): Promise<ActionResult> => {
    if (!wallet.publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet to perform this action.",
        variant: "destructive",
      });
      return createActionResult(action, currency, amount, 'failed', "Wallet not connected");
    }

    setIsProcessing(true);
    try {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(IDL, TOKEN_2022_PROGRAM_ID, provider);

      let txHash: string;

      if (isSimulation) {
        await program.methods
          .executeAction(action.id, new web3.BN(amount), memo)
          .accounts({
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .simulate();

        txHash = generateSimulationTxHash();
      } else {
        txHash = await program.methods
          .executeAction(action.id, new web3.BN(amount), memo)
          .accounts({
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      }

      const resultMessage = `${action.name} ${isSimulation ? 'simulated' : 'executed'} successfully`;
      toast({
        title: "Success",
        description: `${resultMessage}. Transaction: ${txHash}`,
      });

      return createActionResult(action, currency, amount, isSimulation ? 'simulated' : 'completed', resultMessage, txHash);
    } catch (error) {
      console.error('Error executing action:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return createActionResult(action, currency, amount, 'failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [connection, wallet, toast]);

  const createActionResult = (
    action: Action,
    currency: Currency,
    amount: number,
    status: 'completed' | 'failed' | 'simulated',
    message: string,
    txHash?: string
  ): ActionResult => ({
    id: txHash || '',
    success: status !== 'failed',
    message,
    actionId: action.id,
    actionType: action.type,
    amount,
    currency: currency.symbol,
    timestamp: Date.now(),
    status,
  });

  const generateSimulationTxHash = (): string => {
    return 'simulation-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  return { handleAction, isProcessing };
}
