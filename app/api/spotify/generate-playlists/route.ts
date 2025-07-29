import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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
    const spotifyAccessToken = request.headers.get("x-spotify-token")

    if (!spotifyAccessToken) {
      return NextResponse.json({ error: "No Spotify access token found" }, { status: 401 })
    }

    const { artistIds, includeRelated } = await request.json()

    const allTracks: any[] = []

    // Get top tracks for each selected artist
    for (const artistId of artistIds) {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        allTracks.push(...data.tracks)
      }

      // If include related is enabled, get tracks from related artists
      if (includeRelated) {
        const relatedResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        })

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          // Get top tracks from first 2 related artists
          for (const relatedArtist of relatedData.artists.slice(0, 2)) {
            const tracksResponse = await fetch(
              `https://api.spotify.com/v1/artists/${relatedArtist.id}/top-tracks?market=US`,
              {
                headers: {
                  Authorization: `Bearer ${spotifyAccessToken}`,
                },
              },
            )

            if (tracksResponse.ok) {
              const tracksData = await tracksResponse.json()
              allTracks.push(...tracksData.tracks.slice(0, 3)) // Only add 3 tracks per related artist
            }
          }
        }
      }
    }

    // Remove duplicates and shuffle
    const uniqueTracks = Array.from(new Map(allTracks.map((track) => [track.id, track])).values())

    // Shuffle and limit to 50 tracks
    const shuffledTracks = uniqueTracks.sort(() => Math.random() - 0.5).slice(0, 50)

    return NextResponse.json({ tracks: shuffledTracks })
  } catch (error) {
    console.error("Error generating playlist:", error)
    return NextResponse.json({ error: "Failed to generate playlist" }, { status: 500 })
  }
}
