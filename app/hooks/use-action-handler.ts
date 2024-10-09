import { useState, useCallback } from 'react'
import { Action, Currency, ActionResult } from '@/types/actionboard'
import { useToast } from "@/components/ui/use-toast"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor'
import { IDL } from '@/idl/bark_protocol'

const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')

export function useActionHandler() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { connection } = useConnection()
  const wallet = useWallet()

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
      })
      return {
        id: '',
        success: false,
        message: "Wallet not connected",
        actionId: action.id,
        actionType: action.type,
        amount,
        currency: currency.symbol,
        timestamp: Date.now(),
        status: 'failed'
      }
    }

    setIsProcessing(true)
    try {
      const provider = new AnchorProvider(connection, wallet as any, {})
      const program = new Program(IDL, TOKEN_2022_PROGRAM_ID, provider)

      let txHash: string

      if (isSimulation) {
        const tx = await program.methods
          .executeAction(action.id, new web3.BN(amount), memo)
          .accounts({
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .simulate()

        txHash = 'simulation-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      } else {
        const tx = await program.methods
          .executeAction(action.id, new web3.BN(amount), memo)
          .accounts({
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        txHash = tx
      }

      const resultMessage = `${action.name} ${isSimulation ? 'simulated' : 'executed'} successfully`
      toast({
        title: "Success",
        description: `${resultMessage}. Transaction: ${txHash}`,
      })

      return {
        id: txHash,
        success: true,
        message: resultMessage,
        txHash,
        actionId: action.id,
        actionType: action.type,
        amount,
        currency: currency.symbol,
        timestamp: Date.now(),
        status: isSimulation ? 'simulated' : 'completed'
      }
    } catch (error) {
      console.error('Error executing action:', error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return {
        id: '',
        success: false,
        message: errorMessage,
        actionId: action.id,
        actionType: action.type,
        amount,
        currency: currency.symbol,
        timestamp: Date.now(),
        status: 'failed'
      }
    } finally {
      setIsProcessing(false)
    }
  }, [connection, wallet, toast])

  return { handleAction, isProcessing }
}