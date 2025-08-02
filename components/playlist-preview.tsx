"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RotateCcw, Save, Play, Plus } from "lucide-react"
import Image from "next/image"
import { PlaylistSuccessModal } from "@/components/playlist-success-modal"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../app/providers"
import toast from "react-hook-toast"
import { encrypt, decrypt } from "@/utils/crypto"

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

interface PlaylistPreviewProps {
  tracks: Track[]
  onRegenerate: () => void
  onSave: (playlistName: string, onSuccess?: (playlistData: { name: string; url: string }) => void) => void
  generating: boolean
  saving: boolean
}

export function PlaylistPreview({ tracks: initialTracks, onRegenerate, onSave, generating, saving }: PlaylistPreviewProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [savedPlaylistData, setSavedPlaylistData] = useState<{ name: string; url: string } | null>(null)
  const [playlistName, setPlaylistName] = useState("My Playlist")
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [showAddSong, setShowAddSong] = useState(false)
  const [addSongQuery, setAddSongQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const { session } = useAuth();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [supabaseJwt, setSupabaseJwt] = useState<string | null>(null)

  const handleSave = () => {
    // Pass edited playlist name to onSave
    onSave(playlistName, (playlistData: { name: string; url: string }) => {
      setSavedPlaylistData({ ...playlistData, name: playlistName })
      setShowSuccessModal(true)
    })
  }

  const handleRemoveTrack = (id: string) => {
    setTracks(tracks.filter((track) => track.id !== id))
  }

  const handleAddTrack = (track: Track) => {
    if (!tracks.find((t) => t.id === track.id)) {
      setTracks([...tracks, track])
    }
    setShowAddSong(false)
    setAddSongQuery("")
    setSearchResults([])
  }

  // Debounced search effect
  useEffect(() => {
    if (!showAddSong) return;
    if (!addSongQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      setSearchLoading(false)
      return
    }
    setSearchLoading(true)
    setSearchError(null)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {



      // const supabaseJwt = localStorage.getItem("supabaseJwt")
      // const accessToken = localStorage.getItem("spotifyToken")

      try {
        const storedJwt = localStorage.getItem("supabaseJwt")
        const storedSpotify = localStorage.getItem("spotifyToken")

        const decryptedJwt = storedJwt ? decrypt(storedJwt) : ""
        const decryptedSpotify = storedSpotify ? decrypt(storedSpotify) : ""
        if (!decryptedJwt || !decryptedSpotify) {
          setSearchError("Missing authentication tokens")
          setSearchLoading(false)
          return
        }
        const res = await fetch("/api/spotify/search-tracks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${decryptedJwt}`,
            "X-Spotify-Token": decryptedSpotify
          },
          body: JSON.stringify({ query: addSongQuery })
        })

        if (!res.ok) throw new Error("Spotify search failed")
        const data = await res.json()
        setSearchResults(data.tracks || [])
        setSearchLoading(false)
      } catch (err: any) {
        setSearchError("Failed to search Spotify tracks")
        setSearchResults([])
        setSearchLoading(false)

      }
    }, 400)
    // Cleanup
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [addSongQuery, showAddSong, session])

  return (
    <Card className="bg-black backdrop-blur w-full max-w-xs sm:max-w-lg mx-auto px-2 sm:px-3 py-2 sm:py-4">
      <CardHeader>
        <div className="flex items-start sm:items-center justify-between w-full">

          <div className="flex-1 ">
            <input
              type="text"
              className="w-full bg-transparent border-b border-green-400 text-lg font-semibold text-gray-100 mb-2 focus:outline-none focus:border-green-600 transition"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              placeholder="Playlist name"
              maxLength={100}
            />
            <CardTitle className="flex items-center text-gray-100 text-xs  sm:mb-0">
              <Play className="w-5 h-5 mr-2 text-green-900" />
              Generated Playlist ({tracks.length} tracks)
            </CardTitle>
          </div>

        </div>
      </CardHeader>



      <CardContent>

        <div className="flex space-x-2 juqstify-between gap-6 mb-4">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={generating}
            className="border-green-200 hover:bg-green-50 text-gray-100 bg-transparent"
          >
            Regenerate
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}

          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || tracks.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Spotify
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}

          </Button>
        </div>


        <div className="space-y-2 max-h-96 overflow-y-auto">

          <div className="mb-2">
            <Button
              variant="outline"
              className="border-green-200 hover:bg-green-50 text-gray-100 bg-transparent w-full"
              onClick={() => setShowAddSong(true)}
            >
              + Add Song
            </Button>
          </div>


          {showAddSong && (
            <div className="mb-2 p-2 bg-gray-900 rounded-lg">
              <input
                type="text"
                className="w-full bg-gray-800 border-b border-green-400 text-gray-100 mb-2 focus:outline-none focus:border-green-600 transition"
                placeholder="Search for a song..."
                value={addSongQuery}
                onChange={e => setAddSongQuery(e.target.value)}
              />
              <div className="max-h-32 overflow-y-auto">
                {searchLoading ? (
                  <div className="text-gray-400 text-xs">Searching...</div>
                ) : searchError ? (
                  <div className="text-red-400 text-xs">{searchError}</div>
                ) : searchResults.length === 0 && addSongQuery.trim() ? (
                  <div className="text-gray-400 text-xs">No results</div>
                ) : (
                  searchResults.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-1 hover:bg-green-100 rounded cursor-pointer" onClick={() => handleAddTrack(track)}>
                      <span className="text-gray-100 text-xs">{track.name} - {track.artists.map(a => a.name).join(", ")}</span>
                      <span className="text-green-600 text-xs ml-2">Add <Plus className="w-4 h-4 inline" /></span>
                    </div>
                  ))
                )}
              </div>
              <Button variant="ghost" className="mt-2 text-gray-100 w-full" onClick={() => setShowAddSong(false)}>
                Cancel
              </Button>
            </div>
          )}
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-800 hover:text-gray-100 transition-colors"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                {track.album.images[0] ? (
                  <Image
                    src={track.album.images[0].url || "/placeholder.svg"}
                    alt={track.album.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm text-gray-100 truncate">{track.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>

              <div className="text-[10px] sm:text-xs text-gray-200 flex-shrink-0 w-5 text-center sm:w-auto">#{index + 1}</div>
              <button
                className="ml-2 text-red-400 hover:text-red-600 text-xs sm:text-sm focus:outline-none"
                title="Remove"
                onClick={() => handleRemoveTrack(track.id)}
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>

      {savedPlaylistData && (
        <PlaylistSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          playlistName={savedPlaylistData.name}
          playlistUrl={savedPlaylistData.url}
        />
      )}
    </Card>
  )
}
