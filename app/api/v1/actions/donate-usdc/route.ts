import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
} from '@solana/actions';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';

const headers = createActionHeaders();

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDC_DECIMALS = 6;

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/v1/actions/donate-usdc?to=${toPubkey.toBase58()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: 'action',
      title: 'Donate USDC to Charity',
      icon: 'https://ucarecdn.com/de8494e3-47f4-4b21-a9a4-221f836ffbc1/donation_usdc.png/-/preview/880x864/-/quality/smart/-/format/auto/',
      description:
        'Cybersecurity Enthusiast | Support my research with a donation.',
      label: 'Transfer',
      links: {
        actions: [
          {
            type: 'transaction',
            label: 'Send 10 USDC',
            href: `${baseHref}&amount=10`,
          },
          {
            type: 'transaction',
            label: 'Send 50 USDC',
            href: `${baseHref}&amount=50`,
          },
          {
            type: 'transaction',
            label: 'Send 100 USDC',
            href: `${baseHref}&amount=100`,
          },
          {
            type: 'transaction',
            label: 'Send USDC',
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter the amount of USDC to send',
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.error('Error in GET request:', err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return new Response(message, {
      status: 400,
      headers,
    });
  }
};

export const OPTIONS = async (req: Request) => {
  return new Response(null, { headers });
};

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC || clusterApiUrl('mainnet-beta'),
    );

    const fromTokenAccount = await findAssociatedTokenAddress(account, USDC_MINT);
    const toTokenAccount = await findAssociatedTokenAddress(toPubkey, USDC_MINT);

    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      account,
      BigInt(amount * Math.pow(10, USDC_DECIMALS)),
      [],
      TOKEN_PROGRAM_ID
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: 'transaction',
        transaction,
        message: `Sent ${amount} USDC to Charity: ${toPubkey.toBase58()}`,
      },
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.error('Error in POST request:', err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return new Response(message, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = new PublicKey(
    'gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR',
  );
  let amount: number = 10;

  try {
    if (requestUrl.searchParams.get('to')) {
      toPubkey = new PublicKey(requestUrl.searchParams.get('to')!);
    }
  } catch (err) {
    throw new Error('Invalid input query parameter: to');
  }

  try {
    if (requestUrl.searchParams.get('amount')) {
      amount = parseFloat(requestUrl.searchParams.get('amount')!);
    }

    if (amount <= 0) throw new Error('Amount is too small');
  } catch (err) {
    throw new Error('Invalid input query parameter: amount');
  }

  return {
    amount,
    toPubkey,
  };
}

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
  ))[0];
}