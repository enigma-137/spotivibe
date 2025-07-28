import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get session
export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Helper function to get user
export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
