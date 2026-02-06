"use client"
import React from "react"
import { RotateCw, FlipHorizontal, FlipVertical, RotateCcw } from "lucide-react"
import { useImage } from "@/context/ImageContext"

export default function RotateFlip() {
  const { toolSettings, updateToolSettings } = useImage()
  const rotate = toolSettings.rotate || 0
  const flipH = toolSettings.flipH || false
  const flipV = toolSettings.flipV || false

  const toggleSetting = (key) => {
    updateToolSettings({ [key]: !toolSettings[key] })
  }

  const setRotation = (deg) => {
    let newRot = rotate + deg;
    if (newRot >= 360) newRot = 0;
    if (newRot < 0) newRot = 270;
    updateToolSettings({ rotate: newRot })
  }

  return (
    <div className="space-y-6 p-4 bg-white/5 rounded-xl border border-white/10">
      
      {/* Rotation Controls */}
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase font-bold">Rotation ({rotate}°)</label>
        <div className="flex gap-2">
           <button onClick={() => setRotation(-90)} className="flex-1 py-3 bg-black/40 hover:bg-blue-500/20 hover:text-blue-400 border border-white/10 rounded-lg flex justify-center transition-colors">
             <RotateCcw className="w-5 h-5" />
           </button>
           <button onClick={() => setRotation(90)} className="flex-1 py-3 bg-black/40 hover:bg-blue-500/20 hover:text-blue-400 border border-white/10 rounded-lg flex justify-center transition-colors">
             <RotateCw className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Flip Controls */}
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase font-bold">Flip</label>
        <div className="flex gap-2">
           <button 
             onClick={() => toggleSetting("flipH")} 
             className={`flex-1 py-3 border border-white/10 rounded-lg flex justify-center transition-colors ${flipH ? "bg-blue-500 text-white" : "bg-black/40 text-gray-400 hover:text-white"}`}
           >
             <FlipHorizontal className="w-5 h-5" />
           </button>
           <button 
             onClick={() => toggleSetting("flipV")} 
             className={`flex-1 py-3 border border-white/10 rounded-lg flex justify-center transition-colors ${flipV ? "bg-blue-500 text-white" : "bg-black/40 text-gray-400 hover:text-white"}`}
           >
             <FlipVertical className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  )
}