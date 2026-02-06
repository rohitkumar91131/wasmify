"use client"
import React from "react"
import { Mic2 } from "lucide-react"
import { useAudio } from "@/context/AudioContext"

export default function AudioCompression() {
  const { toolSettings, updateToolSettings } = useAudio()
  const bitrate = toolSettings.bitrate || "128k"

  const options = [
    { label: "High Quality (320k)", value: "320k" },
    { label: "Standard (128k)", value: "128k" },
    { label: "Low Size (64k)", value: "64k" },
  ]

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Mic2 className="w-5 h-5 text-violet-400" />
        <h3 className="text-white font-medium">Bitrate Quality</h3>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateToolSettings({ bitrate: opt.value })}
            className={`w-full py-3 px-4 rounded-lg text-sm font-medium text-left transition-all border ${
              bitrate === opt.value
                ? "bg-violet-500 text-white border-violet-500 shadow-lg"
                : "bg-black/40 text-gray-400 border-white/5 hover:border-white/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Lower bitrate reduces file size significantly but may affect audio clarity.
      </p>
    </div>
  )
}