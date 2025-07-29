import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// Create a Supabase client for server-side operations using the Service Role Key
// This client has elevated privileges to read auth.sessions table
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    // Get Supabase JWT from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }
    const token = authHeader.replace("Bearer ", "")

    // Verify Supabase JWT
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get Spotify token from header
    const spotifyAccessToken = request.headers.get("x-spotify-token")
    if (!spotifyAccessToken) {
      return NextResponse.json({ error: "No Spotify access token found" }, { status: 401 })
    }

    // Use spotifyAccessToken directly for Spotify API calls
    const { searchParams } = new URL(request.url)
    const source = searchParams.get("source") || "top"
    let url = ""
    if (source === "top") {
      url = "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term"
    } else {
      url = "https://api.spotify.com/v1/me/player/recently-played?limit=50"
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error: Spotify API call failed.", response.status, errorText)

      // If Spotify token is expired, return a specific error
      if (response.status === 401) {
        return NextResponse.json({ error: "Spotify token expired", code: "SPOTIFY_TOKEN_EXPIRED" }, { status: 401 })
      }

      throw new Error(`Failed to fetch from Spotify: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    let artists = []
    if (source === "top") {
      artists = data.items
    } else {
      const artistMap = new Map()
      data.items.forEach((item: any) => {
        item.track.artists.forEach((artist: any) => {
          if (!artistMap.has(artist.id)) {
            artistMap.set(artist.id, artist)
          }
        })
      })
      artists = Array.from(artistMap.values())
    }

    return NextResponse.json({ artists })
  } catch (error) {
    console.error("API Error: Uncaught error in GET /api/spotify/artists:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
