import type { Session } from "@/lib/auth"

declare module "better-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    spotify?: {
      accessToken: string
      refreshToken: string
      expiresAt: number
    }
  }
} 