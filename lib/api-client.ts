import { supabase } from "./supabase"

// Helper function to make authenticated API calls
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error("No session found")
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  })
}
