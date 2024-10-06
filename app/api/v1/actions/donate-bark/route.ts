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
      `/api/v1/actions/donate-bark?to=${toPubkey.toBase58()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: 'action',
      title: 'Donate BARK to Charity',
      icon: 'https://ucarecdn.com/2138a07e-c7e0-4482-820e-105a49d39ede/donation_bark.png/-/preview/880x864/-/quality/smart/-/format/auto/',
      description:
        'Cybersecurity Enthusiast | Support my research with a donation.',
      label: 'Transfer',
      links: {
        actions: [
          {
            type: 'transaction',
            label: 'Send 1.000 BARK',
            href: `${baseHref}&amount=1.000`,
          },
          {
            type: 'transaction',
            label: 'Send 5.000 BARK',
            href: `${baseHref}&amount=5.000`,
          },
          {
            type: 'transaction',
            label: 'Send 10.000 BARK',
            href: `${baseHref}&amount=10.000`,
          },
          {
            type: 'transaction',
            label: 'Send BARK',
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter the amount of BARK to send',
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

    const transferBarkInstruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: toPubkey,
      lamports: Math.floor(amount * LAMPORTS_PER_SOL),
    });

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferBarkInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: 'transaction',
        transaction,
        message: `Sent ${amount.toFixed(3)} BARK to Charity: ${toPubkey.toBase58()}`,
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
  let amount: number = 1.000;

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