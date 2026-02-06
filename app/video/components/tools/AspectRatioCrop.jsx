"use client"

import React from "react"
import { useVideo } from "@/context/VideoContext"
import { Crop } from "lucide-react"

const RATIOS = [
  { label: "16:9 (YouTube)", value: "16:9" },
  { label: "9:16 (TikTok)", value: "9:16" },
  { label: "1:1 (Square)", value: "1:1" },
  { label: "4:5 (Portrait)", value: "4:5" },
]

export default function AspectRatioCrop() {
  const { toolSettings, updateToolSettings } = useVideo()
  const ratio = toolSettings.aspectRatio || "16:9"

  return (
    <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium flex items-center gap-2">
        <Crop className="w-4 h-4 text-green-400" />
        Aspect Ratio
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {RATIOS.map((item) => (
          <button
            key={item.value}
            onClick={() => updateToolSettings({ aspectRatio: item.value })}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition-all border text-left ${
              ratio === item.value
                ? "bg-green-500 text-black border-green-400 shadow-lg shadow-green-500/20"
                : "bg-black/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Video will be cropped from the center to fit the ratio.
      </p>
    </div>
  )
}