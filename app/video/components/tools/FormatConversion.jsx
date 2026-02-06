"use client"

import { useVideo } from "@/context/VideoContext"
import React from "react"

export default function FormatConversion() {
  // Destructure new generic settings
  const { toolSettings, updateToolSettings } = useVideo()
  
  // Safe access default
  const format = toolSettings?.format || "mp4"

  const handleFormatChange = (fmt) => {
    updateToolSettings({ format: fmt })
  }

  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium">Target Format</h3>
      <div className="grid grid-cols-3 gap-2">
        {["mp4", "mov", "avi", "mkv", "webm", "gif"].map((fmt) => (
          <button
            key={fmt}
            onClick={() => handleFormatChange(fmt)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all uppercase ${
              format === fmt 
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20" 
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Selected: <span className="text-green-400 font-mono uppercase">{format}</span>
      </p>
    </div>
  )
}