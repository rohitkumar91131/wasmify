"use client"

import { useImage } from "@/context/ImageContext"

export default function ImagePicker() {
  const { file, setFile } = useImage()

  function onChange(e) {
    const f = e.target.files[0]
    if (f && f.type.startsWith("image/")) {
      setFile(f)
    } else {
      alert("Please select a valid image file")
    }
    e.target.value = null // Reset input
  }

  return (
    <div className="group relative">
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className={`
        border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
        ${file 
          ? "border-green-500/50 bg-green-500/5" 
          : "border-white/10 hover:border-white/20 hover:bg-white/5"
        }
      `}>
        {file ? (
          <div className="space-y-2">
            <div className="text-3xl">🖼️</div>
            <p className="font-medium text-white">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP supported</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}