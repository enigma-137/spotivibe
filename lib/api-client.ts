import { supabase } from "./supabase"
import { encrypt, decrypt } from "@/utils/crypto"

// Helper to refresh the Spotify access token
export async function refreshAccessToken() {
  // The refresh token is now stored as an httpOnly cookie and sent automatically
  const response = await fetch("/api/spotify/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to refresh token (cookie missing or invalid)");
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem("spotifyToken", encrypt(data.access_token));
    return data.access_token;
  }
  throw new Error("No access token returned from refresh");
}

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

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized (token expired), try refreshing and retrying once
  if (response.status === 401 && spotifyAccessToken) {
    try {
      const newToken = await refreshAccessToken();
      headers["X-Spotify-Token"] = newToken;
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (err) {
      // Optionally, handle refresh failure (e.g., log out user)
      throw err;
    }
  }
  return response;
}
