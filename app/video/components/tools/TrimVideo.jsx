"use client"

import React from "react"
import { useVideo } from "@/context/VideoContext"
import { Scissors } from "lucide-react"

export default function TrimVideo() {
  const { toolSettings, updateToolSettings } = useVideo()
  const start = toolSettings.startTime || "00:00:00"
  const end = toolSettings.endTime || "00:00:10"

  const handleChange = (key, val) => {
    updateToolSettings({ [key]: val })
  }

  return (
    <div className="space-y-5 p-5 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-white font-medium flex items-center gap-2">
        <Scissors className="w-4 h-4 text-green-400" />
        Trim Video
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase font-bold">Start Time</label>
          <input
            type="text"
            value={start}
            placeholder="00:00:00"
            onChange={(e) => handleChange("startTime", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-green-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase font-bold">End Time</label>
          <input
            type="text"
            value={end}
            placeholder="00:00:10"
            onChange={(e) => handleChange("endTime", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-green-500 focus:outline-none transition-colors"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Format: HH:MM:SS. Example: 00:01:30 for 1 minute 30 seconds.
      </p>
    </div>
  )
}