"use client"
import React from "react"
import { useAudio } from "@/context/AudioContext"
import { Volume2 } from "lucide-react"

export default function VolumeBoost() {
  const { toolSettings, updateToolSettings } = useAudio()
  const volume = toolSettings.volume || 1.0

  return (
    <div className="space-y-6 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Volume2 className="w-5 h-5 text-violet-400" />
           <h3 className="text-white font-medium">Volume Level</h3>
        </div>
        <span className="text-violet-400 font-mono font-bold">
          {Math.round(volume * 100)}%
        </span>
      </div>

      <input
        type="range"
        min="0.5"
        max="2.0"
        step="0.1"
        value={volume}
        onChange={(e) => updateToolSettings({ volume: parseFloat(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
      />

      <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
        <span>50% (Quiet)</span>
        <span>100% (Normal)</span>
        <span>200% (Boost)</span>
      </div>
    </div>
  )
}