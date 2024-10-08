'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { type User } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error) {
    return { error: error.message }
  }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    })
    if (error) throw new Error(error.message)

    return { success: 'Check your email to confirm your account' }
  } catch (error) {
    return { error: error.message }
  }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string

  // TODO: Implement actual newsletter subscription logic

  console.log(`Subscribing ${email} to newsletter`)

  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: 'Thank you for subscribing to our newsletter!' }
}

export async function createBlink(formData: FormData) {
  const user = await getUser()
  if (!user) return { error: 'You must be logged in to create a Blink' }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // TODO: Implement actual Blink creation logic

  console.log(`Creating Blink: ${title} for user ${user.id}`)

  await new Promise(resolve => setTimeout(resolve, 1000))
  revalidatePath('/dashboard')
  return { success: 'Blink created successfully!' }
}

export async function updateUserProfile(formData: FormData) {
  const user = await getUser()
  if (!user) return { error: 'You must be logged in to update your profile' }

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string

  const supabase = createClient()
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name, bio, updated_at: new Date().toISOString() })

    if (error) throw new Error(error.message)

    revalidatePath('/profile')
    return { success: 'Profile updated successfully!' }
  } catch (error) {
    return { error: error.message }
  }
}
