"use client"

import { useVideo } from "@/context/VideoContext"
import React from "react"

const RESOLUTIONS = [
  { label: "1080p (FHD)", width: 1920 },
  { label: "720p (HD)", width: 1280 },
  { label: "480p (SD)", width: 854 },
  { label: "360p", width: 640 },
]

export default function ResizeResolution() {
  const { toolSettings, updateToolSettings } = useVideo()
  
  const resizeMode = toolSettings.resizeMode || "scale" 
  const scale = toolSettings.resizeScale || 0.5
  const width = toolSettings.targetWidth || 1280

  const toggleMode = (mode) => {
    updateToolSettings({ resizeMode: mode })
  }

  return (
    <div className="space-y-6 p-5 bg-white/5 rounded-xl border border-white/10">
      
      <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
        <button
          onClick={() => toggleMode("scale")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            resizeMode === "scale" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          By Percentage
        </button>
        <button
          onClick={() => toggleMode("fixed")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            resizeMode === "fixed" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Fixed Resolution
        </button>
      </div>

      {resizeMode === "scale" ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium">Scale Factor</h3>
            <span className="text-green-400 font-mono text-lg">{Math.round(scale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={scale}
            onChange={(e) => updateToolSettings({ resizeScale: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <p className="text-xs text-gray-500">Reduces size while keeping aspect ratio.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-white font-medium">Select Resolution</h3>
          <div className="grid grid-cols-2 gap-3">
            {RESOLUTIONS.map((res) => (
              <button
                key={res.label}
                onClick={() => updateToolSettings({ targetWidth: res.width })}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all border ${
                  width === res.width
                    ? "bg-green-500 text-black border-green-400 shadow-lg shadow-green-500/20"
                    : "bg-black/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">Video height will adjust automatically to maintain aspect ratio.</p>
        </div>
      )}
    </div>
  )
}