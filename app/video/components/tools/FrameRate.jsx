"use client"

import React from "react"
import { useVideo } from "@/context/VideoContext"
import { Aperture } from "lucide-react"

export default function FrameRate() {
  const { toolSettings, updateToolSettings } = useVideo()
  const fps = toolSettings.fps || 30

  const presets = [24, 30, 60]

  return (
    <div className="space-y-5 p-5 bg-white/5 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Aperture className="w-4 h-4 text-green-400" />
          Frame Rate
        </h3>
        <span className="text-green-400 font-mono text-lg">{fps} FPS</span>
      </div>

      <input
        type="range"
        min="10"
        max="60"
        step="1"
        value={fps}
        onChange={(e) => updateToolSettings({ fps: parseInt(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
      />

      <div className="grid grid-cols-3 gap-2">
        {presets.map((val) => (
          <button
            key={val}
            onClick={() => updateToolSettings({ fps: val })}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              fps === val
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {val} FPS
          </button>
        ))}
      </div>
    </div>
  )
}