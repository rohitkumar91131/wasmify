"use client"
import React from "react"
import { useAudio } from "@/context/AudioContext"
import { Scissors } from "lucide-react"

export default function TrimAudio() {
  const { toolSettings, updateToolSettings } = useAudio()
  const start = toolSettings.startTime || "00:00:00"
  const end = toolSettings.endTime || "00:00:10"

  const handleChange = (key, val) => {
    updateToolSettings({ [key]: val })
  }

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Scissors className="w-5 h-5 text-violet-400" />
        <h3 className="text-white font-medium">Trim Range</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase font-bold">Start</label>
          <input
            type="text"
            value={start}
            placeholder="00:00:00"
            onChange={(e) => handleChange("startTime", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase font-bold">End</label>
          <input
            type="text"
            value={end}
            placeholder="00:00:10"
            onChange={(e) => handleChange("endTime", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Format: HH:MM:SS. Example: 00:01:30
      </p>
    </div>
  )
}