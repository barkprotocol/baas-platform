"use server"

import React, { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const ProgramInteraction = () => {
  const [programId, setProgramId] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const { publicKey, signTransaction } = useWallet();

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

  const handleTransaction = async () => {
    if (!publicKey || !signTransaction) {
      alert('Wallet not connected');
      return;
    }

    try {
      const programPublicKey = new PublicKey(programId);
      const recipientPublicKey = new PublicKey(recipient);
      const transaction = new Transaction();

      // Add an instruction to interact with the Solana program
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPublicKey,
        lamports: amount * 1e9, // Convert SOL to lamports (1 SOL = 1e9 lamports)
      });

      transaction.add(instruction);

      // Get the latest blockhash for the transaction
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send the transaction
      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log('Transaction sent:', txid);
      alert(`Transaction successful: ${txid}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed: ' + error.message);
    }
  };

  return (
    <div className="program-interaction">
      <h2>Interact with Solana Program</h2>
      <div className="input-container">
        <label htmlFor="programId">Program ID:</label>
        <input
          type="text"
          id="programId"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          placeholder="Enter the Program ID"
        />
      </div>
      <div className="input-container">
        <label htmlFor="recipient">Recipient Address:</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient address"
        />
      </div>
      <div className="input-container">
        <label htmlFor="amount">Amount (SOL):</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Enter amount in SOL"
        />
      </div>
      <button onClick={handleTransaction} className="submit-btn">
        Send Transaction
      </button>
    </div>
  );
};

export default ProgramInteraction;
