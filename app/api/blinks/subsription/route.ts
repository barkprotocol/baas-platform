import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, currency, frequency, description } = body

    // Interact with BARK Protocol database or Solana blockchain
    // to create a new Subscription Blink. For this example, we'll just return mock data.
    const newSubscription = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      amount,
      currency,
      frequency,
      description,
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newSubscription, { status: 201 })
  } catch (error) {
    console.error('Error creating Subscription Blink:', error)
    return NextResponse.json({ error: 'Failed to create Subscription Blink' }, { status: 500 })
  }
}