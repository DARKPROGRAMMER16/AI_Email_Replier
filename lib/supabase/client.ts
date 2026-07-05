"use client"

import { useSession } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"

export function createSupabaseClient() {
  const { session } = useSession()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return (await session?.getToken()) ?? null
      },
    },
  )
}