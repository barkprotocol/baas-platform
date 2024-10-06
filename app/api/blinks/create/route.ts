import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  // This route is used to fetch available Blink types or creation options
  const blinkTypes = [
    { type: 'payment', name: 'Payment Blink' },
    { type: 'gift', name: 'Gift Blink' },
    { type: 'nft', name: 'NFT Blink' },
    { type: 'subscription', name: 'Subscription Blink' },
  ]

  return NextResponse.json({ blinkTypes })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, amount, currency, description } = body

    // Interact with database or Solana blockchain
    // to create a new Blink. For this example, we'll return mock data.
    const newBlink = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      amount: parseFloat(amount),
      currency,
      description,
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    // Simulate a delay to mimic database interaction
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(newBlink, { status: 201 })
  } catch (error) {
    console.error('Error creating Blink:', error)
    return NextResponse.json({ error: 'Failed to create Blink' }, { status: 500 })
  }
}