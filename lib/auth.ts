import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    provider: "mongodb",
    url: process.env.MONGODB_URL!,
  },
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      scope: [
        "user-read-email",
        "user-read-private",
        "user-top-read",
        "user-read-recently-played",
        "playlist-modify-public",
        "playlist-modify-private",
      ],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
})

export type Session = typeof auth.$Infer.Session


