import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Verify the session with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get Spotify access token from user metadata
    const spotifyAccessToken = user.user_metadata?.provider_token

    if (!spotifyAccessToken) {
      return NextResponse.json({ error: "No Spotify access token found" }, { status: 401 })
    }

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
      console.error("Spotify API error:", response.status, await response.text())
      throw new Error("Failed to fetch from Spotify")
    }

    const data = await response.json()

    let artists = []
    if (source === "top") {
      artists = data.items
    } else {
      // Extract unique artists from recently played tracks
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
    console.error("Error fetching artists:", error)
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 })
  }
}
