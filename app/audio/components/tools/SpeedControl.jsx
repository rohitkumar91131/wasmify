"use client"
import React from "react"
import { useAudio } from "@/context/AudioContext"
import { Gauge } from "lucide-react"

export default function SpeedControl() {
  const { toolSettings, updateToolSettings } = useAudio()
  const speed = toolSettings.speed || 1.0

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Gauge className="w-5 h-5 text-violet-400" />
           <h3 className="text-white font-medium">Playback Speed</h3>
        </div>
        <span className="text-violet-400 font-mono font-bold">{speed}x</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[0.5, 1.0, 1.5, 2.0].map((val) => (
          <button
            key={val}
            onClick={() => updateToolSettings({ speed: val })}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              speed === val
                ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {val}x
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500">
        Pitch correction is automatically applied.
      </p>
    </div>
  )
}