import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Mock Meteora API data
    const meteoraData = {
      pools: [
        { id: 'pool1', name: 'SOL-USDC', liquidity: '1000000', apy: '12.5%' },
        { id: 'pool2', name: 'BARK-USDC', liquidity: '500000', apy: '18.3%' },
      ],
    }

    return NextResponse.json(meteoraData)
  } catch (error) {
    console.error('Error in Meteora API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { poolId, amount, action } = body

    // Mock liquidity provision/removal
    let result
    if (action === 'provide') {
      result = {
        success: true,
        message: `Successfully provided ${amount} liquidity to pool ${poolId}`,
        lpTokens: (parseFloat(amount) * 0.95).toString(), // Simulating LP token minting
      }
    } else if (action === 'remove') {
      result = {
        success: true,
        message: `Successfully removed ${amount} liquidity from pool ${poolId}`,
        receivedTokens: {
          token1: (parseFloat(amount) * 0.5).toString(),
          token2: (parseFloat(amount) * 0.48).toString(), // Simulating small fee
        },
      }
    } else {
      throw new Error('Invalid action')
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in Meteora API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}