"use client"

import React from "react"
import { useVideo } from "@/context/VideoContext"
import { Image } from "lucide-react"

export default function GifMaker() {
  const { toolSettings, updateToolSettings } = useVideo()
  const fps = toolSettings.gifFps || 10
  const width = toolSettings.gifWidth || 320

  return (
    <div className="space-y-5 p-5 bg-white/5 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Image className="w-4 h-4 text-green-400" />
          GIF Settings
        </h3>
        <span className="text-green-400 font-mono">{fps} FPS</span>
      </div>

      <input
        type="range"
        min="5"
        max="24"
        step="1"
        value={fps}
        onChange={(e) => updateToolSettings({ gifFps: parseInt(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
      />

      <div className="space-y-3 pt-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Width (px)</label>
        <div className="grid grid-cols-3 gap-2">
          {[240, 320, 480].map((val) => (
            <button
              key={val}
              onClick={() => updateToolSettings({ gifWidth: val })}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                width === val
                  ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                  : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {val}px
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}