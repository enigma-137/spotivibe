"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RotateCcw, Save, Play } from "lucide-react"
import Image from "next/image"
import { PlaylistSuccessModal } from "@/components/playlist-success-modal"
import { useState } from "react"

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
  onSave: (onSuccess?: (playlistData: { name: string; url: string }) => void) => void
  generating: boolean
  saving: boolean
}

export function PlaylistPreview({ tracks, onRegenerate, onSave, generating, saving }: PlaylistPreviewProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [savedPlaylistData, setSavedPlaylistData] = useState<{ name: string; url: string } | null>(null)

  const handleSave = () => {
    onSave((playlistData) => {
      setSavedPlaylistData(playlistData)
      setShowSuccessModal(true)
    })
  }

  return (
    <Card className="bg-black backdrop-blur w-full max-w-xs sm:max-w-lg mx-auto px-2 sm:px-3 py-2 sm:py-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          {/* CardTitle above buttons on mobile */}
          <CardTitle className="flex items-center text-gray-100 text-xs mb-2 py-2 sm:mb-0">
            <Play className="w-5 h-5 mr-2 text-green-900" />
            Generated Playlist ({tracks.length} tracks)
          </CardTitle>

          <div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onRegenerate}
                disabled={generating}
                className="border-green-200 hover:bg-green-50 text-gray-100 bg-transparent"
              >
                {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-1" />}
                Regenerate
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || tracks.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save to Spotify
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-green-50 transition-colors"
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
