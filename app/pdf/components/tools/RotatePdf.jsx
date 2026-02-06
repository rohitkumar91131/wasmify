"use client"
import React from "react"
import { usePdf } from "@/context/PdfContext"
import { RotateCw } from "lucide-react"

export default function RotatePdf() {
  const { toolSettings, updateToolSettings } = usePdf()
  const rot = toolSettings.rotation || 90;

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
      <div className="flex items-center gap-2 text-rose-400 mb-2">
         <RotateCw className="w-5 h-5" />
         <span className="font-bold">Rotation Angle</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[90, 180, 270].map(deg => (
           <button
             key={deg}
             onClick={() => updateToolSettings({ rotation: deg })}
             className={`py-2 rounded-lg text-sm border ${rot === deg ? "bg-rose-500 text-white border-rose-500" : "bg-black/40 text-gray-400 border-white/10"}`}
           >
             {deg}°
           </button>
        ))}
      </div>
    </div>
  )
}