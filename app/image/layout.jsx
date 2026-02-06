"use client"

import { ImageProvider } from "@/context/ImageContext"


export default function ImageLayout({ children }) {
  return (
    <ImageProvider>
       {/* Blue gradient background for Image section distinction */}
      <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative">
         <div className="fixed top-0 left-0 w-full h-[500px] bg-blue-900/10 blur-[100px] pointer-events-none" />
        {children}
      </div>
    </ImageProvider>
  )
}