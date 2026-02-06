"use client"

import React from "react"
import { Music2 } from "lucide-react"
import { useVideo } from "@/context/VideoContext"

export default function ExtractAudio() {
  const { toolSettings, updateToolSettings } = useVideo()
  const format = toolSettings.audioFormat || "mp3"

  return (
    <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium flex items-center gap-2">
        <Music2 className="w-4 h-4 text-green-400" />
        Output Format
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        {["mp3", "wav", "aac"].map((fmt) => (
          <button
            key={fmt}
            onClick={() => updateToolSettings({ audioFormat: fmt })}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition-all uppercase ${
              format === fmt 
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20" 
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Extracts the audio stream and saves it as a separate file.
      </p>
    </div>
  )
}