"use client"
import React from "react"
import { FileText, Layers } from "lucide-react"
import { useImage } from "@/context/ImageContext"

export default function ImageToPDF() {
  const { toolSettings, updateToolSettings, selectedFiles } = useImage()
  
  const paper = toolSettings.pdfPaperSize || "a4"
  const margin = toolSettings.pdfMargin || 10

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      <div className="flex items-center gap-3 pb-2 border-b border-white/5">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
           <p className="text-white font-medium text-sm">
             {selectedFiles.length} Images Loaded
           </p>
           <p className="text-xs text-gray-500">Will be stitched into one PDF</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase font-bold">Paper Size</label>
        <div className="grid grid-cols-3 gap-2">
           {["a4", "letter", "legal"].map(p => (
             <button
               key={p}
               onClick={() => updateToolSettings({ pdfPaperSize: p })}
               className={`py-2 text-xs uppercase rounded border ${
                 paper === p ? "bg-blue-500 text-white border-blue-500" : "bg-black/40 border-white/10 text-gray-500"
               }`}
             >
               {p}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs">
           <span className="text-gray-400 uppercase font-bold">Margin (mm)</span>
           <span className="text-blue-400">{margin}mm</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={margin}
          onChange={(e) => updateToolSettings({ pdfMargin: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  )
}