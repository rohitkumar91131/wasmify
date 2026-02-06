"use client"
import React from "react"
import { Unlock, ShieldCheck, KeyRound } from "lucide-react"
import { usePdf } from "@/context/PdfContext"

export default function UnlockPdf() {
  const { toolSettings, updateToolSettings } = usePdf() 
  return (
    <div className="space-y-5 p-4 bg-white/5 rounded-xl border border-white/10">
      
      {/* Header Info */}
      <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
        <Unlock className="w-8 h-8 text-green-400 shrink-0" />
        <div>
          <h3 className="text-green-400 font-bold text-sm mb-1">Remove Restrictions</h3>
          <p className="text-xs text-green-200/70">
            Automatically removes "Owner Passwords" (permissions) that prevent printing or editing.
          </p>
        </div>
      </div>

      {/* ✅ New Input Field for User Password */}
      <div className="space-y-2">
         <div className="flex items-center gap-2 text-gray-400">
            <KeyRound className="w-4 h-4" />
            <label className="text-xs uppercase font-bold">Open Password (Optional)</label>
         </div>
         <input 
            type="password" 
            placeholder="Enter password only if file cannot open..."
            value={toolSettings.password || ""}
            onChange={(e) => updateToolSettings({ password: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none placeholder:text-gray-600 transition-colors"
         />
      </div>

      {/* Helper Text */}
      <div className="p-4 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-center">
        <ShieldCheck className="w-5 h-5 text-gray-500 shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
           Most files just have permission locks—leave the password field <strong>empty</strong> for those. 
           Only enter a password if the file is completely locked and cannot be opened.
        </p>
      </div>
    </div>
  )
}