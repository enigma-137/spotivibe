"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Music } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../app/providers"

interface PlaylistHistory {
  id: string
  name: string
  track_count: number
  spotify_url: string
  created_at: string
}

export function PlaylistHistory() {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState<PlaylistHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPlaylists()
    }
  }, [user])

  const fetchPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setPlaylists(data || [])
    } catch (error) {
      console.error("Error fetching playlists:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || loading) return null

  if (playlists.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="w-5 h-5 mr-2 text-green-600" />
            Playlist History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No playlists created yet. Generate your first playlist!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="w-5 h-5 mr-2 text-green-600" />
          Recent Playlists
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{playlist.name}</h4>
                <p className="text-sm text-gray-500">
                  {playlist.track_count} tracks • {new Date(playlist.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(playlist.spotify_url, "_blank")}
                className="border-green-200 hover:bg-green-100"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
