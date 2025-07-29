import { supabase } from "./supabase"

// Helper function to make authenticated API calls
export async function makeAuthenticatedRequest(
  url: string,
  options: RequestInit = {},
  supabaseJwt: string | null,
  spotifyAccessToken?: string | null
) {
  if (!supabaseJwt) {
    throw new Error("No Supabase JWT found")
  }

  // Normalize headers to a plain object
  let baseHeaders: Record<string, string> = {}
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        baseHeaders[key] = value
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        baseHeaders[key] = value
      })
    } else {
      baseHeaders = { ...options.headers } as Record<string, string>
    }
  }

  const headers: Record<string, string> = {
    ...baseHeaders,
    Authorization: `Bearer ${supabaseJwt}`,
    "Content-Type": "application/json",
  }

  if (spotifyAccessToken) {
    headers["X-Spotify-Token"] = spotifyAccessToken
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
