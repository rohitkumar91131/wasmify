"use client"
import React from "react"
import { Layers } from "lucide-react"
import { usePdf } from "@/context/PdfContext"

export default function MergePdf() {
  const { selectedFiles } = usePdf()
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
      <div className="flex items-center gap-2 text-rose-400">
        <Layers className="w-5 h-5" />
        <span className="font-bold">Merge Sequence</span>
      </div>
      <p className="text-xs text-gray-400">
        {selectedFiles.length} files loaded. They will be merged in the order you selected them.
      </p>
    </div>
  )
}