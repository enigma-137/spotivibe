---

# SpotiVibes 🎧

SpotiVibes is a music-powered web application built with Next.js, Supabase, and the Spotify API. It allows users to log in with Spotify, fetch and interact with their playlists, and enjoy a custom music dashboard experience.

---

## 🧪 Tech Stack
- **Next.js App Router**
- **Supabase Auth & Database**
- **Spotify Web API**
- **Tailwind CSS & ShadCN UI**
- **Framer Motion (for animations)**

---

## ⚙️ Setup Instructions

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/enigma-137/spotivibe.git
cd spotivibes
````

### 2. 🔐 Environment Variables

Create a `.env.local` file by copying the example below:

```bash
cp .env.example .env.local
```

Then fill in the values as described below.

---

## 🔑 Create Spotify Developer Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

2. Create a new application.

3. Copy the **Client ID** and **Client Secret** and paste into `.env.local`.

4. Under "Redirect URIs", add:

```
http://localhost:3000
[your Supabase project URL]/auth/v1/callback
```

You’ll get your Supabase URL in the next section.

---

## 🧰 Set Up Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign in.

2. Create a new project.

3. Go to **Project Settings → API** and copy:

   * `SUPABASE_URL`
   * `SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`

4. Navigate to **Authentication → Providers → Spotify**

   * Enable it.
   * Paste your **Spotify Client ID** and **Secret**.
   * Set the **Redirect URL** to:

```
[your Supabase URL]/auth/v1/callback
```

> ⚠️ Make sure this matches what you set in the Spotify dashboard.

---

## 🌍 Add to `.env.local`

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

---

## 🚀 Run the Dev Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:3000` in your browser.

---

## 🙌 Contributions

Feel free to fork this project and submit a pull request. Open an issue if you encounter any bugs or have feature suggestions.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

````

---

### ✅ `.env.example`

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
````

---


