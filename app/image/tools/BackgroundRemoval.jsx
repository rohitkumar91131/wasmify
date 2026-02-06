"use client"
import React from "react"
import { AlertTriangle } from "lucide-react"

export default function BackgroundRemoval() {
  return (
    <div className="p-5 bg-yellow-500/10 rounded-xl border border-yellow-500/20 flex items-start gap-4">
      <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
      <div>
        <h3 className="text-yellow-500 font-bold mb-2">Feature Unavailable</h3>
        <p className="text-sm text-yellow-200/70">
          Browser-based AI background removal requires downloading heavy models (20MB+). 
          To keep this app lightweight, please use a dedicated AI service for this task.
        </p>
      </div>
    </div>
  )
}