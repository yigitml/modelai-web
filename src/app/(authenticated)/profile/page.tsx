"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, PlusCircle, Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { Header } from "@/components/Header";

export default function ProfilePage() {
  const { user, credits } = useAppContext();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="min-h-screen bg-black text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Your <span className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text animate-flow">Profile</span>
          </h1>
            <p className="text-gray-400 mb-8">You can manage your account, billing, and team settings here.</p>

            <div className="grid gap-6">
              <div className="bg-zinc-900/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="relative group">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-zinc-800">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="Profile"
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-full w-full p-4 text-gray-400" />
                      )}
                    </div>
                    <button 
                      onClick={() => {/* TODO: Edit avatar */}}
                      className="absolute bottom-0 left-0 p-1 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700"
                    >
                      <Pen className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <Label htmlFor="name" className="text-gray-400 block mb-2">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={user?.name || ""}
                        disabled
                        className="bg-zinc-800/50 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-400 block mb-2">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-zinc-800/50 border-zinc-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Credits</h2>
                <div className="space-y-4">
                  {credits.map((credit) => (
                    <div key={credit.type} className="flex justify-between items-center">
                      <span className="text-gray-400">{credit.type.charAt(0).toUpperCase() + credit.type.slice(1).toLowerCase()}</span>
                      <span className="text-xl font-semibold">{credit.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/20 hover:bg-emerald-900/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <PlusCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">Buy More Credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

