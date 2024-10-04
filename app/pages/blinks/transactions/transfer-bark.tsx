'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

// Initialize Solana connection (replace with your RPC endpoint)
const connection = new Connection('https://api.mainnet-beta.solana.com')

// BARK token mint address (replace with actual BARK token mint)
const BARK_MINT = new PublicKey('')

export default function TransferBARK() {
  const { publicKey, signTransaction } = useWallet()
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !signTransaction) return

    setIsLoading(true)
    try {
      const recipientPubkey = new PublicKey(recipient)
      const barkToken = new Token(connection, BARK_MINT, TOKEN_PROGRAM_ID, publicKey)
      const fromTokenAccount = await barkToken.getOrCreateAssociatedAccountInfo(publicKey)
      const toTokenAccount = await barkToken.getOrCreateAssociatedAccountInfo(recipientPubkey)

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          publicKey,
          [],
          parseFloat(amount) * Math.pow(10, await barkToken.getMintInfo().then(info => info.decimals))
        )
      )

      const { blockhash } = await connection.getRecentBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signed = await signTransaction(transaction)
      const txid = await connection.sendRawTransaction(signed.serialize())

      toast({
        title: "Transfer Successful",
        description: `Transaction ID: ${txid}`,
      })
    } catch (error) {
      console.error('Error transferring BARK:', error)
      toast({
        title: "Transfer Failed",
        description: "An error occurred while transferring BARK.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer BARK</CardTitle>
        <CardDescription>Send BARK tokens to another Solana wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {!publicKey && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connect Your Wallet</AlertTitle>
            <AlertDescription>
              Please connect your Solana wallet to transfer BARK tokens.
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-4">
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
        </div>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient's Solana address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (BARK)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000000001"
              min="0"
              placeholder="Enter amount in BARK"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !publicKey} className="w-full">
            {isLoading ? 'Processing...' : 'Transfer BARK'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}