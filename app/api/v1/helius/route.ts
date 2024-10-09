import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Helius API data
    const heliusData = {
      balance: '100.5',
      recentTransactions: [
        { id: 'tx1', amount: '10.0', type: 'send', timestamp: Date.now() - 3600000 },
        { id: 'tx2', amount: '5.5', type: 'receive', timestamp: Date.now() - 7200000 },
      ],
    }

    return NextResponse.json(heliusData)
  } catch (error) {
    console.error('Error in Helius API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { address } = body

    // BARK fetching NFTs for a given address
    const nfts = [
      { id: 'nft1', name: 'BARK Prospect Membership NFT #1', image: 'https://example.com/nft1.jpg' },
      { id: 'nft2', name: 'BARK 0.99% Membership NFT #2', image: 'https://example.com/nft2.jpg' },
    ]

    return NextResponse.json({ address, nfts })
  } catch (error) {
    console.error('Error in Helius API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}