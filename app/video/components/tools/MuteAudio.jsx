"use client"

import React from "react"
import { VolumeX } from "lucide-react"

export default function MuteAudio() {
  return (
    <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
      <div className="p-3 bg-red-500/10 rounded-full text-red-400">
        <VolumeX className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-white font-medium">Remove Audio Track</h3>
        <p className="text-xs text-gray-500">
          This will completely remove sound from the video file.
        </p>
      </div>
    </div>
  )
}