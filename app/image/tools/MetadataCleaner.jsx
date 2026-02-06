"use client"
import React from "react"
import { ShieldCheck } from "lucide-react"

export default function MetadataCleaner() {
  return (
    <div className="p-5 bg-green-500/10 rounded-xl border border-green-500/20 flex items-start gap-4">
      <ShieldCheck className="w-8 h-8 text-green-400 shrink-0" />
      <div>
        <h3 className="text-green-400 font-bold mb-1">Privacy Protection Active</h3>
        <p className="text-sm text-green-200/70 leading-relaxed">
          Clicking "Process" will create a fresh copy of your image. This automatically strips invisible data like:
        </p>
        <ul className="mt-2 text-xs text-green-200/50 list-disc list-inside space-y-1">
          <li>GPS Location Data</li>
          <li>Camera Model & Settings</li>
          <li>Date & Time Stamps</li>
        </ul>
      </div>
    </div>
  )
}