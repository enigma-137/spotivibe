"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, ExternalLink, Home } from "lucide-react"

interface PlaylistSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  playlistName: string
  playlistUrl: string
}

export function PlaylistSuccessModal({
  isOpen,
  onClose,
  playlistName,
  playlistUrl,
}: PlaylistSuccessModalProps) {
  const router = useRouter()

  const handleGoToDashboard = () => {
    onClose()
    router.push("/dashboard")
  }

  const handleOpenPlaylist = () => {
    window.open(playlistUrl, "_blank")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Playlist Saved Successfully!</DialogTitle>
          <DialogDescription className="text-center">
            Your playlist "{playlistName}" has been saved to your Spotify account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleGoToDashboard}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
          <Button
            onClick={handleOpenPlaylist}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Spotify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
