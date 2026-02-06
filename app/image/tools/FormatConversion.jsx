"use client"
import React from "react"
import { useImage } from "@/context/ImageContext"

export default function FormatConversion() {
  const { toolSettings, updateToolSettings } = useImage()
  const format = toolSettings.format || "png"

  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium">Target Format</h3>
      <div className="grid grid-cols-3 gap-2">
        {["png", "jpg", "webp"].map((fmt) => (
          <button
            key={fmt}
            onClick={() => updateToolSettings({ format: fmt })}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all uppercase ${
              format === fmt 
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>
    </div>
  )
}