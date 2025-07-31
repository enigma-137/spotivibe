import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Read refreshToken from httpOnly cookie
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "Missing refresh token in cookie" }, { status: 401 });
  }

  // NOTE: In production, never expose your client secret in frontend code!
  // Store these securely in environment variables on the server.
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();
  // data will contain: access_token, token_type, expires_in, scope, (maybe refresh_token)
  return NextResponse.json(data);
}
