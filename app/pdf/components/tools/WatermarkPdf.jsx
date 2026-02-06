"use client"
import React from "react"
import { Stamp, Grid3x3, Droplets } from "lucide-react"
import { usePdf } from "@/context/PdfContext"

export default function WatermarkPdf() {
  const { toolSettings, updateToolSettings } = usePdf()
  
  // Default values
  const text = toolSettings.watermarkText || "CONFIDENTIAL"
  const position = toolSettings.watermarkPosition || "center"
  const opacity = toolSettings.watermarkOpacity || 0.3

  // 3x3 Grid Options
  const positions = [
    "top-left", "top-center", "top-right",
    "center-left", "center", "center-right",
    "bottom-left", "bottom-center", "bottom-right"
  ]

  return (
    <div className="space-y-6 p-4 bg-white/5 rounded-xl border border-white/10">
      
      {/* Header */}
      <div className="flex items-start gap-4 p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
        <Stamp className="w-8 h-8 text-rose-400 shrink-0" />
        <div>
          <h3 className="text-rose-400 font-bold text-sm mb-1">Add Watermark</h3>
          <p className="text-xs text-rose-200/70">
            Customize text, position, and transparency.
          </p>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Watermark Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => updateToolSettings({ watermarkText: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-rose-500 outline-none placeholder:text-gray-600"
          placeholder="CONFIDENTIAL"
        />
      </div>

      {/* Position Grid */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
           <Grid3x3 className="w-4 h-4" />
           <label className="text-xs uppercase font-bold">Position</label>
        </div>
        <div className="grid grid-cols-3 gap-2 w-fit mx-auto bg-black/40 p-2 rounded-xl border border-white/5">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => updateToolSettings({ watermarkPosition: pos })}
              className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all ${
                position === pos
                  ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-500"
              }`}
              title={pos.replace("-", " ")}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${position === pos ? "bg-white" : "bg-gray-600"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400 font-bold">
           <div className="flex items-center gap-2"><Droplets className="w-4 h-4" /> OPACITY</div>
           <span>{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={opacity}
          onChange={(e) => updateToolSettings({ watermarkOpacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
      </div>
    </div>
  )
}