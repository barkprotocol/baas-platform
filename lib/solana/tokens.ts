import { 
    Token,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    MintLayout,
  } from '@solana/spl-token';
  import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
  import { getConnection } from './connections';
  
  export async function getTokenBalance(
    connection: Connection,
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<number> {
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenMintAddress,
      walletAddress
    );
  
    try {
      const balance = await connection.getTokenAccountBalance(tokenAccount);
      return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }
  
  export async function createToken(
    connection: Connection,
    payer: Keypair,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null,
    decimals: number
  ): Promise<PublicKey> {
    const mintAccount = Keypair.generate();
    const token = new Token(
      connection,
      mintAccount.publicKey,
      TOKEN_PROGRAM_ID,
      payer
    );
  
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        space: MintLayout.span,
        lamports: await Token.getMinBalanceRentForExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        decimals,
        mintAuthority,
        freezeAuthority
      )
    );
  
    await connection.sendTransaction(transaction, [payer, mintAccount]);
    return mintAccount.publicKey;
  }
  
  export async function createAssociatedTokenAccount(
    connection: Connection,
    payer: Keypair,
    tokenMintAddress: PublicKey,
    owner: PublicKey
  ): Promise<PublicKey> {
    const associatedTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenMintAddress,
      owner
    );
  
    const transaction = new Transaction().add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenMintAddress,
        associatedTokenAddress,
        owner,
        payer.publicKey
      )
    );
  
    await connection.sendTransaction(transaction, [payer]);
    return associatedTokenAddress;
  }
  
  export async function transferToken(
    connection: Connection,
    payer: Keypair,
    source: PublicKey,
    destination: PublicKey,
    owner: PublicKey,
    amount: number,
    tokenMintAddress: PublicKey
  ): Promise<string> {
    const token = new Token(
      connection,
      tokenMintAddress,
      TOKEN_PROGRAM_ID,
      payer
    );
  
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        source,
        destination,
        owner,
        [],
        amount
      )
    );
  
    const signature = await connection.sendTransaction(transaction, [payer]);
    return signature;
  }
  
  export async function getTokenInfo(tokenMintAddress: PublicKey): Promise<any> {
    const connection = getConnection();
    const info = await connection.getParsedAccountInfo(tokenMintAddress);
    
    if (info.value && 'parsed' in info.value.data) {
      const parsedData = info.value.data.parsed;
      return {
        mintAuthority: parsedData.info.mintAuthority,
        supply: parsedData.info.supply,
        decimals: parsedData.info.decimals,
      };
    }
    
    throw new Error('Failed to fetch token info');
  }
  
  export async function burnTokens(
    connection: Connection,
    payer: Keypair,
    account: PublicKey,
    mint: PublicKey,
    owner: Keypair,
    amount: number
  ): Promise<string> {
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    const transactionSignature = await token.burn(account, owner, [], amount);
    return transactionSignature;
  }