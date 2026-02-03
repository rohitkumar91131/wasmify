"use client"

import { createContext, useContext, useState } from "react"
import { useFFmpeg } from "@/hooks/useFFmpeg"
import { fetchFile } from "@ffmpeg/util"

const ImageContext = createContext()

export function ImageProvider({ children }) {
  const { ffmpeg, loaded, message } = useFFmpeg()
  
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState("jpg")
  const [loading, setLoading] = useState(false)
  
  // ✅ NEW: Error State
  const [error, setError] = useState(null)

  async function convert() {
    if (!file || !loaded || !ffmpeg) return

    setLoading(true)
    setError(null) // Nayi conversion start hone par purana error saaf karo

    try {
      const fileExt = file.name.split('.').pop()
      const inputName = `image_input.${fileExt}`
      const outputName = `image_output.${format}`

      const fileData = await fetchFile(file)
      await ffmpeg.writeFile(inputName, fileData)

      await ffmpeg.exec([
        "-i", inputName,
        outputName
      ])

      const data = await ffmpeg.readFile(outputName)

      const blob = new Blob([data.buffer], { type: `image/${format}` })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = outputName
      document.body.appendChild(a)
      a.click()
      
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)

    } catch (err) {
      console.error(err)
      
      // ✅ Smart Error Message Logic
      // Agar "undefined" ya khali error aaye, to iska matlab codec missing hai (e.g. AVIF)
      const errString = err.message ? err.message.toString() : ""
      
      if (!errString || errString.includes("undefined") || errString.includes("function")) {
        setError(`Failed! The format '${format.toUpperCase()}' is not supported by this browser.`)
      } else {
        setError(`Conversion Failed: ${errString}`)
      }
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageContext.Provider 
      value={{ 
        file, setFile, 
        format, setFormat, 
        loading, 
        error, // Export Error
        convert,
        loaded, message 
      }}
    >
      {children}
    </ImageContext.Provider>
  )
}

export function useImage() {
  return useContext(ImageContext)
}