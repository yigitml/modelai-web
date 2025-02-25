"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface GoogleAuthButtonProps {
  variant?: "default" | "outline" | "gradient",
  size?: "default" | "lg"
  onClick?: () => void
}

export default function GoogleAuthButton({ 
  variant = "default",
   size = "default",
   onClick = () => {}
  }: GoogleAuthButtonProps) {
    const getButtonClasses = () => {
      const baseClasses = "transition-all duration-300 ease-in-out transform hover:scale-105"
      const sizeClasses = size === "lg" ? "text-lg py-8 px-10" : ""
      
      switch (variant) {
        case "outline":
          return `${baseClasses} ${sizeClasses} bg-white hover:bg-gray-100`
        case "gradient":
          return `${baseClasses} ${sizeClasses} text-white bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 animate-flow`
        default:
          return `${baseClasses} ${sizeClasses}`
      }
    }
  
    return (
      <Button 
        className={getButtonClasses()}
        onClick={onClick}
      >
        {variant !== "gradient" && (
          <Image
            src="/images/google_icon.png"
            alt="Google Icon"
            width={size === "lg" ? 32 : 20}
            height={size === "lg" ? 32 : 20}
            className="mr-2"
        /> 
        )}
      {variant === "gradient" ? "Get Started Now!" : "Sign in with Google"}
    </Button>
    )
  }