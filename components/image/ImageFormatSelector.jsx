"use client"

import { useImage } from "@/context/ImageContext"

export default function ImageFormatSelector() {
  const { format, setFormat } = useImage()
  
  // Predefined popular formats
  const presets = ["jpg", "png", "webp", "gif", "ico", "bmp", "tiff"]
  
  // Check if current format is one of the presets
  const isCustom = !presets.includes(format)

  function handleCustomInput(e) {
    // User input se spaces aur dot (.) hata do (e.g., ".raw" -> "raw")
    const value = e.target.value.trim().toLowerCase().replace(".", "")
    if (value) {
      setFormat(value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Target Format
        </label>
        <span className="text-[10px] text-gray-600 uppercase">
          {isCustom ? "Custom Format Selected" : "Standard Format"}
        </span>
      </div>
      
      {/* 1. Preset Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {presets.map((fmt) => (
          <button
            key={fmt}
            onClick={() => setFormat(fmt)}
            className={`
              py-2 rounded-lg text-xs font-bold uppercase transition-all duration-200 border
              ${format === fmt
                ? "bg-white text-black border-white shadow-lg"
                : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
              }
            `}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* 2. Custom Input Field */}
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 transition-opacity duration-500 ${isCustom ? "opacity-100" : "opacity-0"}`}></div>
        
        <input
          type="text"
          placeholder="Type custom format (e.g. avif, tga, raw)"
          value={isCustom ? format : ""}
          onChange={handleCustomInput}
          className={`
            relative w-full bg-black border rounded-xl px-4 py-3 text-sm font-medium tracking-wide outline-none transition-all
            placeholder:text-gray-600 focus:border-blue-500
            ${isCustom 
              ? "border-blue-500 text-white" 
              : "border-white/10 text-gray-400"
            }
          `}
        />
        
        {/* Helper Text */}
        <div className="absolute right-4 top-3 text-xs text-gray-600 pointer-events-none uppercase font-bold">
          Custom
        </div>
      </div>
    </div>
  )
}