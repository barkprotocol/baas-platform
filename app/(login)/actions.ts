'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { AuthError } from '@supabase/supabase-js'
import { z } from 'zod'
import * as ed from '@noble/ed25519'
import { decode as base58Decode } from 'bs58'

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type ActionResult = {
  error?: string;
  success?: boolean;
}

export async function signIn(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const data = userSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) throw error

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' }
    }
    console.error('Sign in error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signUp(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const data = userSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const { error } = await supabase.auth.signUp(data)

    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    if (error instanceof AuthError) {
      return { error: 'Error creating account' }
    }
    console.error('Sign up error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOut(): Promise<ActionResult> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: 'Error signing out' }
  }
}

export async function signInWithSolana(publicKey: string, signedMessage: string, message: string): Promise<ActionResult> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Verify the signed message
    const isValid = await verifySignature(publicKey, signedMessage, message)
    if (!isValid) {
      throw new Error('Invalid signature')
    }

    // Sign in or create user account associated with the Solana wallet
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'solana',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        scopes: publicKey,
      },
    })

    if (error) throw error

    if (data.url) {
      redirect(data.url)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error) {
    console.error('Solana sign in error:', error)
    return { error: 'Error authenticating with Solana' }
  }
}

async function verifySignature(publicKey: string, signedMessage: string, message: string): Promise<boolean> {
  try {
    const publicKeyBytes = base58Decode(publicKey)
    const signatureBytes = base58Decode(signedMessage)
    const messageBytes = new TextEncoder().encode(message)

    const isValid = await ed.verify(signatureBytes, messageBytes, publicKeyBytes)
    return isValid
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}