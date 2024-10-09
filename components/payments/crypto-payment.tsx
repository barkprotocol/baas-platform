import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import Image from 'next/image'

interface CryptoPaymentProps {
  amount: number
  token: 'SOL' | 'BARK' | 'USDC'
}

export function CryptoPayment({ amount, token }: CryptoPaymentProps) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    if (!publicKey) return

    setIsProcessing(true)

    try {
      let transaction: Transaction

      if (token === 'SOL') {
        transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey('gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR'), // Replace with your actual recipient address
            lamports: amount * 1e9 // Convert to lamports
          })
        )
      } else {
        const tokenMintAddress = new PublicKey(
          token === 'BARK' ? 'BARK_TOKEN_MINT_ADDRESS' : 'USDC_TOKEN_MINT_ADDRESS'
        )
        const recipientAddress = new PublicKey('gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR') // Replace with your actual recipient address

        const fromTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, publicKey)
        const toTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, recipientAddress)

        transaction = new Transaction().add(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            publicKey,
            amount * (token === 'USDC' ? 1e6 : 1e9) // USDC has 6 decimals, BARK assumed to have 9
          )
        )
      }

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('Payment successful:', signature)
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={!publicKey || isProcessing} className="w-full">
      <Image src={`/icons/${token.toLowerCase()}.svg`} alt={token} width={20} height={20} className="mr-2" />
      {isProcessing ? 'Processing...' : `Pay with ${token}`}
    </Button>
  )
}