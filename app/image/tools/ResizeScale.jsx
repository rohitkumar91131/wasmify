"use client"
import { useImage } from "@/context/ImageContext"
import React from "react"

export default function ResizeScale() {
  const { toolSettings, updateToolSettings } = useImage()
  const mode = toolSettings.resizeMode || "scale"
  const scale = toolSettings.resizeScale || 0.5

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      {/* Mode Toggle */}
      <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
        <button
          onClick={() => updateToolSettings({ resizeMode: "scale" })}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            mode === "scale" ? "bg-white/10 text-white" : "text-gray-500"
          }`}
        >
          Percentage
        </button>
        <button
          onClick={() => updateToolSettings({ resizeMode: "fixed" })}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            mode === "fixed" ? "bg-white/10 text-white" : "text-gray-500"
          }`}
        >
          Fixed Width
        </button>
      </div>

      {mode === "scale" ? (
        <div className="space-y-3">
           <div className="flex justify-between text-sm">
             <span className="text-white">Scale</span>
             <span className="text-blue-400">{Math.round(scale * 100)}%</span>
           </div>
           <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={scale}
            onChange={(e) => updateToolSettings({ resizeScale: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      ) : (
        <div className="space-y-3">
           <label className="text-xs text-gray-400 uppercase">Target Width (px)</label>
           <input
             type="number"
             className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
             placeholder="1080"
             onChange={(e) => updateToolSettings({ targetWidth: parseInt(e.target.value) })}
           />
        </div>
      )}
    </div>
  )
}