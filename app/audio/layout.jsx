"use client"

import { AudioProvider } from "@/context/AudioContext"


export default function AudioLayout({ children }) {
  return (
    <AudioProvider>
      <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative">
         {/* Violet Ambient Light */}
         <div className="fixed top-0 left-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />
        {children}
      </div>
    </AudioProvider>
  )
}