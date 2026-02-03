"use client"

import { ImageProvider, useImage } from "@/context/ImageContext"
import ImageHeader from "./ImageHeader"
import ImagePicker from "./ImagePicker"
import ImageFormatSelector from "./ImageFormatSelector"
import ImageConvertButton from "./ImageConvertButton"

function ConverterUI() {
  const { loaded, message, error } = useImage() // Error import karo

  return (
    <div className="space-y-8 w-full max-w-xl mx-auto">
      <ImageHeader />

      <div className="text-xs text-center font-mono text-gray-500 uppercase tracking-widest">
        {loaded ? (
          <span className="text-green-500">● Engine Ready</span>
        ) : (
          <span className="animate-pulse">{message}</span>
        )}
      </div>

      <ImagePicker />
      <ImageFormatSelector />

      {/* 🔴 ERROR DISPLAY BOX */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <ImageConvertButton />
    </div>
  )
}

export default function ImageConverter() {
  return (
    <ImageProvider>
      <ConverterUI />
    </ImageProvider>
  )
}