"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RotateCcw, Save, Play } from "lucide-react"
import Image from "next/image"

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
  onSave: () => void
  generating: boolean
  saving: boolean
}

export function PlaylistPreview({ tracks, onRegenerate, onSave, generating, saving }: PlaylistPreviewProps) {
  return (
    <Card className="bg-black backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-100 text-xs">
            <Play className="w-5 h-5 mr-2 text-green-900" />
            Generated Playlist ({tracks.length} tracks)
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={generating}
              className="border-green-200 hover:bg-green-50 text-gray-100 bg-transparent"
            >
              {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
              Regenerate
            </Button>
            <Button
              onClick={onSave}
              disabled={saving || tracks.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save to Spotify
            </Button>
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
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="w-12 h-12 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                {track.album.images[0] ? (
                  <Image
                    src={track.album.images[0].url || "/placeholder.svg"}
                    alt={track.album.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-100 truncate">{track.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>

              <div className="text-xs text-gray-200 flex-shrink-0">#{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
