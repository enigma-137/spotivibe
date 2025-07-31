"use client"

import { useAuth } from "../app/providers"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user } = useAuth()

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
  }

  return (
    <header className="bg-black backdrop-blur border-b border-green-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-100">Spotivibe</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            {/* Desktop: show avatar + name + sign out */}
            <div className="hidden sm:flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                <AvatarFallback>
                  {user.user_metadata?.full_name?.[0] || user.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-100">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-green-200 hover:bg-green-50 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile: show dropdown */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.[0] || user.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-900 dark:bg-gray-800">
                  <DropdownMenuItem className="text-sm text-gray-100 dark:text-gray-200">
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-sm text-red-600 dark:text-red-400 font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
