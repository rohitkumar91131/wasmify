"use client"
import React from "react"
import { Scissors } from "lucide-react"
import { usePdf } from "@/context/PdfContext"

export default function SplitPdf() {
  const { toolSettings, updateToolSettings } = usePdf()
  const range = toolSettings.splitRange || ""

  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      <div className="flex items-start gap-4 p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
        <Scissors className="w-8 h-8 text-rose-400 shrink-0" />
        <div>
          <h3 className="text-rose-400 font-bold text-sm mb-1">Split / Extract Pages</h3>
          <p className="text-xs text-rose-200/70">
            Enter the page numbers you want to keep. The rest will be removed.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Page Range</label>
        <input
          type="text"
          value={range}
          placeholder="e.g. 1-5, 8, 10-12"
          onChange={(e) => updateToolSettings({ splitRange: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-rose-500 outline-none placeholder:text-gray-600"
        />
        <p className="text-[10px] text-gray-500">
          Leave empty to keep all pages.
        </p>
      </div>

      {/* Examples Helper */}
      <div className="grid grid-cols-2 gap-2">
         <div className="p-2 bg-white/5 rounded text-[10px] text-gray-400">
            <span className="text-white block mb-0.5 font-bold">Single Page</span>
            Example: "5" (Extracts only page 5)
         </div>
         <div className="p-2 bg-white/5 rounded text-[10px] text-gray-400">
            <span className="text-white block mb-0.5 font-bold">Range & Mix</span>
            Example: "1-3, 7" (Pages 1, 2, 3 and 7)
         </div>
      </div>
    </div>
  )
}