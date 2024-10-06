import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from '@/lib/solana/connections';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { reference, signature } = body;

  if (!reference || !signature) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const connection = getConnection();
    const merchantWallet = new PublicKey(process.env.MERCHANT_WALLET!);

    // Confirm the transaction
    const result = await connection.confirmTransaction(signature);
    if (result.value.err) {
      throw new Error('Transaction failed to confirm');
    }

    // Fetch the transaction details
    const transaction = await connection.getParsedTransaction(signature, 'confirmed');
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Verify the reference
    const referencePublicKey = new PublicKey(reference);
    const isReferenceValid = transaction.transaction.message.accountKeys.some(
      (key) => key.pubkey.equals(referencePublicKey)
    );
    if (!isReferenceValid) {
      throw new Error('Invalid reference');
    }

    // Verify the recipient
    let isRecipientValid = false;
    for (const instruction of transaction.transaction.message.instructions) {
      if ('parsed' in instruction && instruction.program === 'system') {
        if (instruction.parsed.type === 'transfer' && instruction.parsed.info.destination === merchantWallet.toBase58()) {
          isRecipientValid = true;
          break;
        }
      } else if ('parsed' in instruction && instruction.program === 'spl-token') {
        if (instruction.parsed.type === 'transferChecked' && instruction.parsed.info.destination === merchantWallet.toBase58()) {
          isRecipientValid = true;
          break;
        }
      }
    }
    if (!isRecipientValid) {
      throw new Error('Invalid recipient');
    }

    // Process the payment (e.g., update order status, send confirmation email, etc.)
    // This is where you would typically update your database or perform other business logic

    return NextResponse.json({ status: 'success', message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing Solana Pay webhook:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}