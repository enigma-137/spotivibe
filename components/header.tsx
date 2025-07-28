"use client"

import { useAuth } from "../app/providers"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function Header() {
  const { user } = useAuth()

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white/80 backdrop-blur border-b border-green-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Spotivibe</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                <AvatarFallback>{user.user_metadata?.full_name?.[0] || user.email?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{user.user_metadata?.full_name || user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="border-green-200 hover:bg-green-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
