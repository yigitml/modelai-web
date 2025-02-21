"use client"

import React from "react";
import { Card } from "@/components/ui/card"
import { Camera, Video, Sparkles, Upload, Heart } from "lucide-react"
import GoogleAuthButton from "@/components/GoogleAuthButton"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect } from "react";

export default function Home() {
  const { user, accessToken } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user && accessToken) {
      router.push("/home")
    }
  }, [user, accessToken])
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[...Array(30)].map((_, i) => (
            <Image
              key={i}
              src={`/banner_images/img_${(i % 15) + 1}.jpg`}
              alt={`Background ${i + 1}`}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold cursor-pointer"
                onClick={() => router.push("/home")}
              >
                TakeAIPhotos
              </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
              <a href="/features" className="hover:text-sky-500 transition-colors">
                Features
              </a>
              <GoogleAuthButton
                variant="outline"
                size="default"
                onClick={() => router.push("/auth/signin")}
              />
          </nav>
        </header>

        <section className="container mx-auto px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-m font-medium">#1 AI Photo App</span>
              <div className="flex">
                <Sparkles className="h-6 w-6 text-sky-500" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Create stunning photos with
              <span className="ml-2 font-bold bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text selection:text-transparent selection:bg-clip-text">TakeAIPhotos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
              Generate professional-quality photos in seconds. No expensive equipment or photography skills needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <GoogleAuthButton
                  variant="gradient"
                  size="lg"
                  onClick={() => router.push("/auth/signin")}
                />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Upload className="h-8 w-8" />,
                title: "Upload & Transform",
                description: "Upload your photos and transform them with AI magic"
              },
              {
                icon: <Camera className="h-8 w-8" />,
                title: "Professional Quality",
                description: "Get studio-quality results in seconds"
              },
              {
                icon: <Video className="h-8 w-8" />,
                title: "Video Generation",
                description: "Turn your photos into stunning videos"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Style Presets",
                description: "Choose from hundreds of AI-powered styles"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-8 bg-white/5 backdrop-blur-sm border-0 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="h-16 w-16 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-lg">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>
        
        <footer className="container mx-auto px-4 py-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="TakeAIPhotos Logo" width={32} height={32} />
              <span className="font-semibold">TakeAIPhotos</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
            <a href="/legal/acceptable-use" className="hover:text-white transition-colors">
                Acceptable Use
              </a>
            <a href="/legal/cookies" className="hover:text-white transition-colors">
                Cookies
              </a>
            <a href="/legal/disclaimer" className="hover:text-white transition-colors">
                Disclaimer
              </a>
            <a href="/legal/eula" className="hover:text-white transition-colors">
                EULA
              </a>
              <a href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              {/*
              <a href="/legal/return" className="hover:text-white transition-colors">
                Return
              </a>
              */}
              <a href="/legal/tos" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/legal/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <div className="text-sm text-gray-400">
              ©{new Date().getFullYear()} TakeAIPhotos. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}