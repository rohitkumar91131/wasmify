"use client"
import React from "react"
import { useImage } from "@/context/ImageContext"

export default function Compression() {
  const { toolSettings, updateToolSettings } = useImage()
  const quality = toolSettings.quality || 0.8

  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">Quality Level</h3>
        <span className="text-blue-400 font-mono">{Math.round(quality * 100)}%</span>
      </div>
      
      <input
        type="range"
        min="0.1"
        max="1.0"
        step="0.05"
        value={quality}
        onChange={(e) => updateToolSettings({ quality: parseFloat(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      
      <p className="text-xs text-gray-500">
        Lower percentage = smaller file size but lower quality.
      </p>
    </div>
  )
}