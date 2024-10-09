'use server'

import { cookies } from 'next/headers'

export async function getUser(): Promise<string | null> {
  const user = cookies().get('user')?.value
  return user || null
}

export async function signIn(walletAddress: string): Promise<void> {
  // Here you would typically verify the wallet address
  // For this example, we're just setting a cookie
  cookies().set('user', walletAddress, { secure: true, httpOnly: true })
}

export async function signOut(): Promise<void> {
  cookies().delete('user')
}