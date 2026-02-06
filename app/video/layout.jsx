"use client"

import { VideoProvider } from "@/context/VideoContext"


export default function VideoLayout({ children }) {
  return (
    <VideoProvider>
      <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        {children}
      </div>
    </VideoProvider>
  )
}