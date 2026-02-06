"use client"
import { useImage } from "@/context/ImageContext"
import React from "react"

const RATIOS = [
  { label: "1:1 (Square)", value: 1.0 },
  { label: "16:9 (Landscape)", value: 1.77 },
  { label: "4:5 (Portrait)", value: 0.8 },
  { label: "9:16 (Story)", value: 0.56 },
]

export default function Crop() {
  const { toolSettings, updateToolSettings } = useImage()
  const ratio = toolSettings.aspectRatio || 1.77

  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium">Aspect Ratio Crop</h3>
      <div className="grid grid-cols-2 gap-2">
        {RATIOS.map((r) => (
          <button
            key={r.label}
            onClick={() => updateToolSettings({ aspectRatio: r.value })}
            className={`py-3 px-3 rounded-lg text-xs font-medium transition-all border ${
              Math.abs(ratio - r.value) < 0.01
                ? "bg-blue-500 text-white border-blue-400 shadow-lg"
                : "bg-black/40 text-gray-400 border-white/5 hover:border-white/20"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Image will be center-cropped to fit the selected aspect ratio.
      </p>
    </div>
  )
}