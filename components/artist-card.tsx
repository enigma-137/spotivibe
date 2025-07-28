"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import Image from "next/image"

interface Artist {
  id: string
  name: string
  images: { url: string }[]
  genres: string[]
}

interface ArtistCardProps {
  artist: Artist
  selected: boolean
  onToggle: () => void
}

export function ArtistCard({ artist, selected, onToggle }: ArtistCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer" onClick={onToggle}>
      <Card
        className={`relative overflow-hidden transition-all duration-200 ${
          selected ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-lg bg-white/80 backdrop-blur"
        }`}
      >
        <CardContent className="p-4">
          <div className="relative mb-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
              {artist.images[0] ? (
                <Image
                  src={artist.images[0].url || "/placeholder.svg"}
                  alt={artist.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </div>

          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">{artist.name}</h3>

          {artist.genres.length > 0 && <p className="text-xs text-gray-500 line-clamp-1">{artist.genres[0]}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
