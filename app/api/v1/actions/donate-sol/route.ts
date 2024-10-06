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
} from '@solana/web3.js';

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/v1/actions/donate-sol?to=${toPubkey.toBase58()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: 'action',
      title: 'Donate SOL to Charity',
      icon: 'https://ucarecdn.com/9d42462f-cd40-40ac-a218-00932eaae06a/donation_sol.png/-/preview/880x864/-/quality/smart/-/format/auto/',
      description:
        'Cybersecurity Enthusiast | Support my research with a donation.',
      label: 'Transfer',
      links: {
        actions: [
          {
            type: 'transaction',
            label: 'Send 1 SOL',
            href: `${baseHref}&amount=1`,
          },
          {
            type: 'transaction',
            label: 'Send 5 SOL',
            href: `${baseHref}&amount=5`,
          },
          {
            type: 'transaction',
            label: 'Send 10 SOL',
            href: `${baseHref}&amount=10`,
          },
          {
            type: 'transaction',
            label: 'Send SOL',
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter the amount of SOL to send',
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

    const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: toPubkey,
      lamports: Math.floor(amount * LAMPORTS_PER_SOL),
    });

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: 'transaction',
        transaction,
        message: `Sent ${amount} SOL to Charity: ${toPubkey.toBase58()}`,
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
  let amount: number = 0.1;

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