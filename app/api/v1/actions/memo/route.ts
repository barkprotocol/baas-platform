import {
    ActionPostResponse,
    createPostResponse,
    MEMO_PROGRAM_ID,
    ActionGetResponse,
    ActionPostRequest,
    createActionHeaders,
  } from '@solana/actions';
  import {
    clusterApiUrl,
    ComputeBudgetProgram,
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
  } from '@solana/web3.js';
  
  const headers = createActionHeaders();
  
  export const GET = async (req: Request) => {
    try {
      const payload: ActionGetResponse = {
        type: 'action',
        title: 'Actions - On-chain Memo',
        icon: new URL('https://ucarecdn.com/c9817a5c-b04a-43b0-a9a5-c503d2f11e4e/Frame141.png', new URL(req.url).origin).toString(),
        description: 'Send a message on-chain using a Memo',
        label: 'Send Memo',
        links: {
          actions: [
            {
              type: 'transaction',
              label: 'Send Memo',
              href: `/api/v1/actions/on-chain-memo?message={message}`,
              parameters: [
                {
                  name: 'message',
                  label: 'Enter your memo message',
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
    } catch (error) {
      console.error('Error in GET request:', error);
      return new Response('An error occurred while processing the request', {
        status: 500,
        headers,
      });
    }
  };
  
  export const OPTIONS = async () => {
    return new Response(null, { headers });
  };
  
  export const POST = async (req: Request) => {
    try {
      const body: ActionPostRequest = await req.json();
      const { searchParams } = new URL(req.url);
      const message = searchParams.get('message');
  
      if (!message) {
        return new Response('Message is required', {
          status: 400,
          headers,
        });
      }
  
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
        process.env.SOLANA_RPC || clusterApiUrl('devnet'),
      );
  
      const transaction = new Transaction().add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1000,
        }),
        new TransactionInstruction({
          programId: new PublicKey(MEMO_PROGRAM_ID),
          data: Buffer.from(message, 'utf8'),
          keys: [],
        }),
      );
  
      transaction.feePayer = account;
  
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          type: 'transaction',
          transaction,
          message: `Post this memo on-chain: "${message}"`,
        },
      });
  
      return Response.json(payload, {
        headers,
      });
    } catch (error) {
      console.error('Error in POST request:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return new Response(message, {
        status: 400,
        headers,
      });
    }
  };