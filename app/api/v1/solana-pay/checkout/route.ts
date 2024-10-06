import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection } from '@/lib/solana/connections';
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get('amount');
  const splToken = searchParams.get('splToken');
  const label = searchParams.get('label');
  const message = searchParams.get('message');

  if (!amount) {
    return NextResponse.json({ error: 'Missing required amount parameter' }, { status: 400 });
  }

  try {
    const connection = getConnection();
    const merchantWallet = new PublicKey(process.env.MERCHANT_WALLET!);
    const reference = new PublicKey(uuidv4());

    let transferInstruction;
    let tokenAmount: bigint;
    if (splToken) {
      const mint = new PublicKey(splToken);
      const mintInfo = await getMint(connection, mint);
      tokenAmount = BigInt(Math.round(parseFloat(amount) * 10 ** mintInfo.decimals));
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
      tokenAmount = BigInt(Math.round(parseFloat(amount) * LAMPORTS_PER_SOL));
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

    return NextResponse.json({
      label: label || 'BARK Checkout',
      icon: 'https://bark-baas-platform.vercel.app/logo.png', // update and add final URL / logo
      message: message || 'Thanks for your purchase!',
      url: solanaPayUrl,
      reference: reference.toBase58(),
      amount: tokenAmount.toString(),
      token: splToken || 'USDC',
    });
  } catch (error) {
    console.error('Error generating Solana Pay checkout URL:', error);
    return NextResponse.json({ error: 'Failed to generate Solana Pay checkout URL' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}