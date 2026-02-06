"use client"
import React from "react"
import { AudioWaveform } from "lucide-react"
import { useAudio } from "@/context/AudioContext"

export default function NoiseReduction() {
  const { toolSettings, updateToolSettings } = useAudio()
  
  // Default to 12dB reduction
  const level = toolSettings.noiseLevel || 12

  return (
    <div className="space-y-6 p-4 bg-white/5 rounded-xl border border-white/10">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <AudioWaveform className="w-5 h-5 text-violet-400" />
           <h3 className="text-white font-medium">Reduction Level (dB)</h3>
        </div>
        <span className="text-violet-400 font-mono font-bold">{level} dB</span>
      </div>

      <input
        type="range"
        min="0"
        max="30"
        step="1"
        value={level}
        onChange={(e) => updateToolSettings({ noiseLevel: parseInt(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
      />

      <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
        <span>0 dB (None)</span>
        <span>15 dB (Balanced)</span>
        <span>30 dB (Strong)</span>
      </div>

      <p className="text-xs text-gray-400 mt-2 bg-black/20 p-2 rounded">
        {/* FIX: Changed > to &gt; */}
        <strong>Tip:</strong> Too much reduction (&gt;20dB) might make the audio sound "robotic" or "underwater". Start with 10-12dB.
      </p>
    </div>
  )
}