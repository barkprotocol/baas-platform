import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Here you would typically fetch analytics data from your database or analytics service
  // For this example, we'll return mock data
  const analyticsData = {
    totalBlinks: 100,
    activeBlinks: 75,
    totalVolume: 1000000,
    topBlinkTypes: [
      { type: 'payment', count: 50 },
      { type: 'gift', count: 30 },
      { type: 'nft', count: 20 },
    ],
  }

  return NextResponse.json(analyticsData)
}