"use client"

import { useAuth } from "../providers"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArtistCard } from "@/components/artist-card"
import { PlaylistPreview } from "@/components/playlist-preview"
import { PlaylistHistory } from "@/components/play-history"
import { Header } from "@/components/header"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { makeAuthenticatedRequest } from "@/lib/api-client"

interface Artist {
  id: string
  name: string
  images: { url: string }[]
  genres: string[]
}

interface Track {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
  preview_url: string | null
}

export default function Dashboard() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set())
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([])
  const [loadingArtists, setLoadingArtists] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [includeRelated, setIncludeRelated] = useState(false)
  const [dataSource, setDataSource] = useState<"top" | "recent">("top")
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [supabaseJwt, setSupabaseJwt] = useState<string | null>(null)

  // Parse tokens from URL hash and save to localStorage, then remove from URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
    const supabaseJwt = hashParams.get("access_token")
    const spotifyToken = hashParams.get("provider_token")
    const refresh = hashParams.get("refresh_token")

    if (supabaseJwt) {
      setSupabaseJwt(supabaseJwt)
      localStorage.setItem("supabaseJwt", supabaseJwt)
    }
    if (spotifyToken) {
      setAccessToken(spotifyToken)
      localStorage.setItem("spotifyToken", spotifyToken)
    }
    if (refresh) {
      setRefreshToken(refresh)
      localStorage.setItem("refreshToken", refresh)
    }

    // To remove tokens from URL after parsing
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  // Fallback
  useEffect(() => {
    if (!supabaseJwt) {
      const storedJwt = localStorage.getItem("supabaseJwt")
      if (storedJwt) setSupabaseJwt(storedJwt)
    }
    if (!accessToken) {
      const storedSpotify = localStorage.getItem("spotifyToken")
      if (storedSpotify) setAccessToken(storedSpotify)
    }
    if (!refreshToken) {
      const storedRefresh = localStorage.getItem("refreshToken")
      if (storedRefresh) setRefreshToken(storedRefresh)
    }
  }, [supabaseJwt, accessToken, refreshToken])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (session) {
      fetchArtists()
    }
  }, [session, dataSource])

  const fetchArtists = async () => {
    setLoadingArtists(true)
    try {
      const response = await makeAuthenticatedRequest(
        `/api/spotify/artists?source=${dataSource}`,
        {},
        supabaseJwt,      // Supabase JWT for Authorization header
        accessToken       // Spotify token for X-Spotify-Token header
      )
      if (response.ok) {
        const data = await response.json()
        setArtists(data.artists)
      } else {
        throw new Error("Failed to fetch artists")
      }
    } catch (error) {
      console.error("Error fetching artists:", error)
      toast.error("Failed to fetch artists")
    } finally {
      setLoadingArtists(false)
    }
  }

  const toggleArtist = (artistId: string) => {
    const newSelected = new Set(selectedArtists)
    if (newSelected.has(artistId)) {
      newSelected.delete(artistId)
    } else {
      newSelected.add(artistId)
    }
    setSelectedArtists(newSelected)
  }

  const generatePlaylist = async () => {
    if (selectedArtists.size === 0) {
      toast.error("Please select at least one artist")
      return
    }

    setGenerating(true)
    try {
      const response = await makeAuthenticatedRequest(
        "/api/spotify/generate-playlists",
        {
          method: "POST",
          body: JSON.stringify({
            artistIds: Array.from(selectedArtists),
            includeRelated,
          }),
        },
         supabaseJwt,      // Supabase JWT for Authorization header
        accessToken 
      )

      if (response.ok) {
        const data = await response.json()
        setGeneratedTracks(data.tracks)
        toast.success(`Created ${data.tracks.length} track playlist`)
      } else {
        throw new Error("Failed to generate playlist")
      }
    } catch (error) {
      console.error("Error generating playlist:", error)
      toast.error("Failed to generate playlist")
    } finally {
      setGenerating(false)
    }
  }

  const savePlaylist = async () => {
    if (generatedTracks.length === 0) return

    setSaving(true)
    try {
      const response = await makeAuthenticatedRequest(
        "/api/spotify/save-playlist",
        {
          method: "POST",
          body: JSON.stringify({
            tracks: generatedTracks,
            name: `Your Playlist - ${new Date().toLocaleDateString()}`,
          }),
        },
        supabaseJwt,      // Supabase JWT for Authorization header
        accessToken 
      )

      if (response.ok) {
        toast.success("Playlist saved successfully! Check your Spotify account")
        window.location.reload()
      } else {
        throw new Error("Failed to save playlist")
      }
    } catch (error) {
      console.error("Error saving playlist:", error)
      toast.error("Failed to save playlist")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs value={generatedTracks.length > 0 ? "playlist" : "artists"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-800 rounded-lg border border-zinc-700">
                <TabsTrigger value="artists" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black text-white">Select Artists</TabsTrigger>
                <TabsTrigger value="playlist" disabled={generatedTracks.length === 0} className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black text-white">Playlist Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="artists" className="space-y-6">
                <Card className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-md">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="space-y-2 text-gray-100">
                        <Label htmlFor="data-source">Data Source</Label>
                        <Tabs value={dataSource} onValueChange={(value) => setDataSource(value as "top" | "recent")}> 
                          <TabsList className="bg-zinc-800 border border-zinc-700 rounded-md">
                            <TabsTrigger value="top" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black text-white">Top Artists</TabsTrigger>
                            <TabsTrigger value="recent" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black text-white">Recently Played</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <div className="flex items-center text-red-100 space-x-2">
                        <Switch id="include-related"   checked={includeRelated} onCheckedChange={setIncludeRelated} />
                        <Label htmlFor="include-related">Include related artists</Label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">
                        {selectedArtists.size} artist{selectedArtists.size !== 1 ? "s" : ""} selected
                      </p>
                      <Button onClick={generatePlaylist} disabled={selectedArtists.size === 0 || generating} className="bg-[#1DB954] hover:bg-green-600 text-black font-medium">
                        {generating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-1" /> Generate Playlist
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {loadingArtists ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <AnimatePresence>
                      {artists.map((artist, index) => (
                        <motion.div key={artist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                          <ArtistCard artist={artist} selected={selectedArtists.has(artist.id)} onToggle={() => toggleArtist(artist.id)} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="playlist">
                <PlaylistPreview tracks={generatedTracks} onRegenerate={generatePlaylist} onSave={savePlaylist} generating={generating} saving={saving} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:col-span-1">
            <PlaylistHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
