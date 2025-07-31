import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No authorization header" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  // Verify the session with Supabase
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get Spotify access token from user metadata
  const spotifyAccessToken = request.headers.get("x-spotify-token");
  if (!spotifyAccessToken) {
    return NextResponse.json({ error: "No Spotify access token found" }, { status: 401 });
  }

  const { query } = await request.json();
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "Missing or invalid query" }, { status: 400 });
  }

  // Search tracks using Spotify API
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
  const spotifyRes = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
  });

  if (!spotifyRes.ok) {
    return NextResponse.json({ error: "Spotify search failed" }, { status: 500 });
  }

  const data = await spotifyRes.json();
  const tracks = (data.tracks?.items || []).map((track: any) => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map((a: any) => ({ name: a.name })),
    album: {
      name: track.album.name,
      images: track.album.images,
    },
    preview_url: track.preview_url,
  }));

  return NextResponse.json({ tracks });
}
