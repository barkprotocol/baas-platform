import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge: number; sameSite: 'lax' | 'strict' | 'none'; httpOnly: boolean }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { path: string }) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}