import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { getConnection } from '@/lib/solana/connections';
import { v4 as uuidv4 } from 'uuid';

export async function createSolanaPayTransaction(
  amount: number,
  splToken?: string,
  label?: string,
  message?: string
) {
  const connection = getConnection();
  const merchantWallet = new PublicKey(process.env.MERCHANT_WALLET!);
  const reference = new PublicKey(uuidv4());

  let transferInstruction;
  let tokenAmount: bigint;

  if (splToken) {
    const mint = new PublicKey(splToken);
    const mintInfo = await getMint(connection, mint);
    tokenAmount = BigInt(Math.round(amount * 10 ** mintInfo.decimals));
    const merchantATA = await getAssociatedTokenAddress(mint, merchantWallet);

    transferInstruction = createTransferCheckedInstruction(
      merchantATA, // source (to be replaced by the payer's ATA)
      mint, // mint
      merchantATA, // destination
      merchantWallet, // owner
      tokenAmount,
      mintInfo.decimals
    );
  } else {
    tokenAmount = BigInt(Math.round(amount * LAMPORTS_PER_SOL));
    transferInstruction = SystemProgram.transfer({
      fromPubkey: merchantWallet, // to be replaced by the payer's public key
      toPubkey: merchantWallet,
      lamports: tokenAmount,
    });
  }

  const transaction = new Transaction().add(transferInstruction);

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: merchantWallet, // to be replaced by the payer's public key
      toPubkey: reference,
      lamports: 0,
    })
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = merchantWallet; // to be replaced by the payer's public key

  const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
  const base64Transaction = serializedTransaction.toString('base64');

  const solanaPayUrl = `solana:${base64Transaction}?reference=${reference.toBase58()}`;

  return {
    label: label || 'BARK Payment',
    icon: 'https://bark-baas-platform.vercel.app/logo.png',
    message: message || 'Thanks for your payment!',
    url: solanaPayUrl,
    reference: reference.toBase58(),
    amount: tokenAmount.toString(),
    token: splToken || 'USDC',
  };
}

export async function verifySolanaPayTransaction(signature: string, reference: string) {
  const connection = getConnection();
  const transaction = await connection.getParsedTransaction(signature, 'confirmed');

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const referencePublicKey = new PublicKey(reference);
  const isReferenceValid = transaction.transaction.message.accountKeys.some(
    (key) => key.pubkey.equals(referencePublicKey)
  );

  if (!isReferenceValid) {
    throw new Error('Invalid reference');
  }

  const merchantWallet = new PublicKey(process.env.MERCHANT_WALLET!);
  let isRecipientValid = false;

  for (const instruction of transaction.transaction.message.instructions) {
    if ('parsed' in instruction) {
      if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
        if (instruction.parsed.info.destination === merchantWallet.toBase58()) {
          isRecipientValid = true;
          break;
        }
      } else if (instruction.program === 'spl-token' && instruction.parsed.type === 'transferChecked') {
        if (instruction.parsed.info.destination === merchantWallet.toBase58()) {
          isRecipientValid = true;
          break;
        }
      }
    }
  }

  if (!isRecipientValid) {
    throw new Error('Invalid recipient');
  }

  return true;
}

export async function getSolanaPayTransactionStatus(signature: string) {
  const connection = getConnection();
  const status = await connection.getSignatureStatus(signature);

  if (status.value === null) {
    return 'not_found';
  }

  if (status.value.err) {
    return 'failed';
  }

  if (status.value.confirmationStatus === 'processed' || status.value.confirmationStatus === 'confirmed') {
    return 'processing';
  }

  if (status.value.confirmationStatus === 'finalized') {
    return 'completed';
  }

  return 'unknown';
}

export async function getSolanaPayTransactionDetails(signature: string) {
  const connection = getConnection();
  const transaction = await connection.getParsedTransaction(signature, 'confirmed');

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  let amount = 0;
  let token = 'SOL';

  for (const instruction of transaction.transaction.message.instructions) {
    if ('parsed' in instruction) {
      if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
        amount = instruction.parsed.info.lamports / LAMPORTS_PER_SOL;
      } else if (instruction.program === 'spl-token' && instruction.parsed.type === 'transferChecked') {
        amount = Number(instruction.parsed.info.tokenAmount.amount) / (10 ** instruction.parsed.info.tokenAmount.decimals);
        token = instruction.parsed.info.mint;
      }
    }
  }

  return {
    signature,
    timestamp: transaction.blockTime ? new Date(transaction.blockTime * 1000).toISOString() : null,
    amount,
    token,
    from: transaction.transaction.message.accountKeys[0].pubkey.toBase58(),
    to: transaction.transaction.message.accountKeys[1].pubkey.toBase58(),
  };
}