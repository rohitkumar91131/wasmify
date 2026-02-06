"use client"
import React from "react"
import { Layers, Music } from "lucide-react"
import { useAudio } from "@/context/AudioContext"

export default function MergeAudio() {
  const { toolSettings, updateToolSettings, selectedFiles } = useAudio()
  
  // Default format is mp3
  const format = toolSettings.format || "mp3"

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      {/* Status Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
        <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
           <p className="text-white font-medium text-sm">
             {selectedFiles.length} Audio Files Loaded
           </p>
           <p className="text-xs text-gray-500">Files will be merged in the order selected.</p>
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-gray-400" />
            <label className="text-xs text-gray-400 uppercase font-bold">Output Format</label>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {["mp3", "wav", "m4a", "ogg", "aac"].map((fmt) => (
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

      {/* Helper Tip */}
      <div className="p-3 bg-violet-500/5 rounded-lg border border-violet-500/10">
        <p className="text-[10px] text-violet-300/80 leading-relaxed">
          <strong>Note:</strong> Merging works best when files have similar sample rates. 
          The tool automatically normalizes streams to ensure a smooth output.
        </p>
      </div>
    </div>
  )
}