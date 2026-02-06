"use client"
import React from "react"
import { FileVideo } from "lucide-react"
import { useAudio } from "@/context/AudioContext"

export default function ExtractAudio() {
  const { toolSettings, updateToolSettings } = useAudio()
  const format = toolSettings.format || "mp3"

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      <div className="flex items-start gap-4 p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
        <FileVideo className="w-8 h-8 text-violet-400 shrink-0" />
        <div>
          <h3 className="text-violet-400 font-bold text-sm mb-1">Extraction Mode</h3>
          <p className="text-xs text-violet-200/70">
            This tool will strip the video track and save only the audio layer. 
            Works best with MP4, MOV, and MKV inputs.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase font-bold">Output Format</label>
        <div className="grid grid-cols-3 gap-2">
          {["mp3", "wav", "aac"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => updateToolSettings({ format: fmt })}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all uppercase ${
                format === fmt 
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                  : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}