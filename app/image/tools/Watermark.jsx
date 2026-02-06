"use client"
import React from "react"
import { useImage } from "@/context/ImageContext"

export default function Watermark() {
  const { toolSettings, updateToolSettings } = useImage()
  
  const text = toolSettings.watermarkText || ""
  const pos = toolSettings.watermarkPos || "center"

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Watermark Text</label>
        <input 
          type="text" 
          placeholder="© Copyright 2024"
          value={text}
          onChange={(e) => updateToolSettings({ watermarkText: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Position</label>
        <div className="grid grid-cols-3 gap-2">
           {["tl", "center", "tr", "bl", "br"].map(p => (
             <button
               key={p}
               onClick={() => updateToolSettings({ watermarkPos: p })}
               className={`py-2 text-xs uppercase rounded border ${
                 pos === p ? "bg-blue-500 text-white border-blue-500" : "bg-black/40 border-white/10 text-gray-500"
               }`}
             >
               {p}
             </button>
           ))}
        </div>
      </div>
    </div>
  )
}