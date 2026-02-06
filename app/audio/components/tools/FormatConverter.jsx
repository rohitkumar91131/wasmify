"use client"
import { useAudio } from "@/context/AudioContext"
import React from "react"
// 👇 CHANGE THIS LINE

export default function FormatConverter() {
  const { toolSettings, updateToolSettings } = useAudio()
  const format = toolSettings.format || "mp3"

  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium">Target Format</h3>
      <div className="grid grid-cols-3 gap-2">
        {["mp3", "wav", "aac", "m4a", "ogg"].map((fmt) => (
          <button
            key={fmt}
            onClick={() => updateToolSettings({ format: fmt })}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all uppercase ${
              format === fmt 
                ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Selected: <span className="text-violet-400 font-mono uppercase">{format}</span>
      </p>
    </div>
  )
}