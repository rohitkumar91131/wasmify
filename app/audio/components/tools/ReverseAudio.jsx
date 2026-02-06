"use client"
import React from "react"
import { Rewind } from "lucide-react"

export default function ReverseAudio() {
  return (
    <div className="p-5 bg-violet-500/10 rounded-xl border border-violet-500/20 flex items-start gap-4">
      <Rewind className="w-8 h-8 text-violet-400 shrink-0" />
      <div>
        <h3 className="text-violet-400 font-bold mb-1">Reverse Effect</h3>
        <p className="text-sm text-violet-200/70 leading-relaxed">
          Clicking "Start Audio Process" will reverse the entire audio track. Great for sound design or finding hidden messages!
        </p>
      </div>
    </div>
  )
}