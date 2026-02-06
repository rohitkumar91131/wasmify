"use client"

import React from "react"
import { useVideo } from "@/context/VideoContext"
import { Gauge } from "lucide-react"

export default function SpeedControl() {
  const { toolSettings, updateToolSettings } = useVideo()
  const speed = toolSettings.speed || 1.0

  return (
    <div className="space-y-5 p-5 bg-white/5 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Gauge className="w-4 h-4 text-green-400" />
          Playback Speed
        </h3>
        <span className="text-green-400 font-mono text-lg">{speed}x</span>
      </div>

      <input
        type="range"
        min="0.25"
        max="4.0"
        step="0.25"
        value={speed}
        onChange={(e) => updateToolSettings({ speed: parseFloat(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
      />

      <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
        <span>Slow Motion (0.25x)</span>
        <span>Normal</span>
        <span>Fast (4x)</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        {[0.5, 1.0, 2.0].map((val) => (
          <button
            key={val}
            onClick={() => updateToolSettings({ speed: val })}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              speed === val
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {val}x
          </button>
        ))}
      </div>
    </div>
  )
}