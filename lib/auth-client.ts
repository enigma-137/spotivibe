import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://127.0.0.1:3000/api/auth",
})

export const { signIn, signOut, useSession } = authClient
