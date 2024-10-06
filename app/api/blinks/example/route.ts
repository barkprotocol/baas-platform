import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Here you would typically fetch example data from your database or service
  // For this example, we'll return mock data
  const exampleData = {
    id: '123456',
    name: 'Example Blink',
    type: 'payment',
    amount: 100,
    currency: 'SOL',
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(exampleData)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Here you would typically create a new example in your database
  // For this example, we'll just return the received data with an ID
  const newExample = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(newExample, { status: 201 })
}