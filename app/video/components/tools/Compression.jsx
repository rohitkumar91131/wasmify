"use client"

import React from "react"
import { HardDrive, TrendingDown } from "lucide-react"
import { useVideo } from "@/context/VideoContext"

export default function Compression() {
  const { toolSettings, updateToolSettings } = useVideo()
  
  const crf = toolSettings.compressionCrf || 23

  const getQualityLabel = (val) => {
    if (val <= 20) return "High Quality (Larger Size)"
    if (val <= 25) return "Balanced (Recommended)"
    if (val <= 30) return "High Compression (Small Size)"
    return "Extreme Compression (Low Quality)"
  }

  const presets = [
    { label: "High Quality", value: 18 },
    { label: "Balanced", value: 23 },
    { label: "Small Size", value: 28 },
  ]

  return (
    <div className="space-y-6 p-5 bg-white/5 rounded-xl border border-white/10">
      
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-white font-medium flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            Compression Level
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Current: <span className="text-gray-300">{getQualityLabel(crf)}</span>
          </p>
        </div>
        <span className="text-green-400 font-mono text-xl font-bold">
          CRF {crf}
        </span>
      </div>

      <input
        type="range"
        min="18"
        max="35"
        step="1"
        value={crf}
        onChange={(e) => updateToolSettings({ compressionCrf: parseInt(e.target.value) })}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 dir-rtl"
      />
      <div className="flex justify-between text-[10px] text-gray-600 uppercase font-bold tracking-wider">
        <span>Better Quality</span>
        <span>Smaller Size</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => updateToolSettings({ compressionCrf: preset.value })}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
              crf === preset.value
                ? "bg-green-500 text-black border-green-400 shadow-lg shadow-green-500/20"
                : "bg-black/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 p-3 bg-black/40 rounded-lg border border-white/5 items-center">
        <HardDrive className="w-5 h-5 text-gray-500" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Lower CRF means better quality but larger file size. 
          <br/>CRF 23 is the standard for web video.
        </p>
      </div>
    </div>
  )
}