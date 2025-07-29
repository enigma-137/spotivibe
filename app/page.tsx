"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Sparkles, Users, PlayCircle, Headphones, Mic, Radio } from "lucide-react"
import { motion } from "framer-motion"
// import heroImage from "@/assets/hero-audio-studio.jpg"
import Image from "next/image"

// import { createAuthClient } from "better-auth/client"

import { useAuth } from "./providers"
import { supabase } from "@/lib/supabase"



// import { useSession, signIn } from "@/lib/auth-client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()


//  useEffect(() => {
  
//   }, [user, router])

  const signInWithSpotify = async () => {

    if (user) {
      router.push("/dashboard")
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({


      provider: "spotify",
      
      options: {
        
        scopes: [
          "user-read-email",
          "user-read-private",
          "user-top-read",
          "user-read-recently-played",
          "playlist-modify-public",
          "playlist-modify-private",
        ].join(" "),
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      console.error("Error signing in:", error)
    }
  }
  // useEffect(() => {
  //   if (session) {
  //     router.push("/dashboard")
  //   }
  // }, [session, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-emerald-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Music className="w-8 h-8 text-green-600" />
        </motion.div>
      </div>
    )
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Audio Studio"
            className="w-full h-full object-cover opacity-10"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-green-500 opacity-30 drop-shadow-glow">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Music className="w-16 h-16" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 text-green-500 opacity-30 drop-shadow-glow">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Headphones className="w-12 h-12" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center mb-8">
              <div className="relative">
      
                <div className="absolute inset-0 w-16 h-16 text-green-400 opacity-40 animate-ping" />
              </div>
              <h1 className="text-3xl  md:text-7xl font-bold bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent drop-shadow-glow">
                SpotiVibe
              </h1>
                        <Music className="w-16 h-16 text-green-400 mr-4 animate-glow-pulse drop-shadow-glow" />
            </motion.div>

            <motion.p variants={fadeInUp} className="text-sm md:text-2xl text-green-200 mb-12 leading-relaxed">
              Create personalized playlists. Connect with Spotify and let our intelligent 
              algorithm curate the perfect sonic experience tailored to your taste.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => signInWithSpotify()}
                size="lg"
                className="px-12 py-6 text-lg font-semibold rounded-full shadow-lg bg-green-500 hover:bg-green-400 text-black transition-all duration-200 drop-shadow-glow"
              >
                <Radio className="w-6 h-6 mr-1" />
                Connect with Spotify
                
              </Button>
              <p className="text-sm text-green-300 mt-6 opacity-80">
                Secure connection • Only accesses your music preferences
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-green-400 to-transparent rounded-full drop-shadow-glow" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 text-green-300 drop-shadow-glow">
              How It <span className="text-green-400">Works</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-green-200 max-w-2xl mx-auto">
              Three simple steps to build your perfect playlist
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature Cards */}
            {/* Change bg and border for dark/glow look */}
            <motion.div variants={fadeInUp}>
              <Card className="group text-center p-8 bg-black/70 backdrop-blur-sm border-green-700 hover:border-green-400 transition-all duration-300 hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="relative mb-6">
                    <Users className="w-16 h-16 text-green-400 mx-auto group-hover:animate-float drop-shadow-glow" />
                    <div className="absolute inset-0 w-16 h-16 text-green-400 opacity-0 group-hover:opacity-30 mx-auto animate-ping" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-green-200">Select Artists</h3>
                  <p className="text-green-300 leading-relaxed">
                    Choose from your favorite artists, recently played tracks, or discover new ones from our vast music database.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="group text-center p-8 bg-black/70 backdrop-blur-sm border-green-700 hover:border-green-400 transition-all duration-300 hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="relative mb-6">
                    <Sparkles className="w-16 h-16 text-green-400 mx-auto group-hover:animate-float drop-shadow-glow" />
                    <div className="absolute inset-0 w-16 h-16 text-green-400 opacity-0 group-hover:opacity-30 mx-auto animate-ping" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-green-200">Magic</h3>
                  <p className="text-green-300 leading-relaxed">
                    The algorithm analyzes your preferences and creates a harmonious blend of tracks that flow perfectly together.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="group text-center p-8 bg-black/70 backdrop-blur-sm border-green-700 hover:border-green-400 transition-all duration-300 hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="relative mb-6">
                    <PlayCircle className="w-16 h-16 text-green-400 mx-auto group-hover:animate-float drop-shadow-glow" />
                    <div className="absolute inset-0 w-16 h-16 text-green-400 opacity-0 group-hover:opacity-30 mx-auto animate-ping" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-green-200">Save & Enjoy</h3>
                  <p className="text-green-300 leading-relaxed">
                    Your custom playlist is automatically saved to your Spotify account, ready to enjoy wherever you go.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-green-700/5 to-green-900/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-300 drop-shadow-glow">
              Ready to Experience the <span className="text-green-400">Future</span> of Music?
            </h2>
            <p className="text-xl text-green-200 mb-12">
              Join other music lovers who have already discovered their perfect sound with Spotivibes  .
            </p>
            <Button
              onClick={() => signInWithSpotify()}
              size="lg"
              className="px-12 py-6 text-lg font-semibold rounded-full bg-green-500 hover:bg-green-400 text-black animate-glow-pulse drop-shadow-glow"
            >
              <Mic className="w-6 h-6 mr-1" />
              Start Vibing!
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-green-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 text-green-400">
            <Music className="w-6 h-6 text-green-400" />
            <span className="text-lg font-semibold"> SpotiVibe</span>
            <span>•</span>
            <span className="text-xs">Powered by <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">Spotify</a></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
