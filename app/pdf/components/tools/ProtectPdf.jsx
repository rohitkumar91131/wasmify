"use client"
import React from "react"
import { usePdf } from "@/context/PdfContext"

export default function ProtectPdf() {
  const { toolSettings, updateToolSettings } = usePdf()
  
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
      <label className="text-xs text-gray-400 uppercase font-bold">Set Password</label>
      <input 
        type="text" 
        placeholder="Enter password"
        value={toolSettings.password || ""}
        onChange={(e) => updateToolSettings({ password: e.target.value })}
        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-rose-500 outline-none"
      />
    </div>
  )
}