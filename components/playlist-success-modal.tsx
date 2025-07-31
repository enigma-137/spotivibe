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

  // const handleGoToDashboard = () => {
  //   onClose()
  //   router.push("/dashboard")
  // }

  const handleOpenPlaylist = () => {
    window.open(playlistUrl, "_blank")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black">
        <DialogHeader>
          <div className="flex items-center justify-center bg-black mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center text-gray-100">Playlist Saved Successfully!</DialogTitle>
          <DialogDescription className="text-center text-gray-200">
            Your playlist "{playlistName}" has been saved to your Spotify account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          {/* <Button
            variant="outline"
            onClick={handleGoToDashboard}
            className="flex items-center bg-gray-800 gap-2 text-gray-100"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button> */}
          <Button
            onClick={handleOpenPlaylist}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-gray-100"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Spotify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
