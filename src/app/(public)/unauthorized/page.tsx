"use client"

import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        
        <h1 className="text-4xl font-bold tracking-tight">
          Unauthorized Access
        </h1>
        
        <p className="text-xl text-gray-400">
          You don't have permission to access this page. Please sign in or contact support if you believe this is an error.
        </p>

        <div className="space-y-4 pt-4">
          <Button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 hover:from-sky-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Sign In
          </Button>
          
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}
