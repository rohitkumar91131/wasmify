"use client"

import { createContext, useContext, useState } from "react"
import { useFFmpeg } from "@/hooks/useFFmpeg"
import { fetchFile } from "@ffmpeg/util"
import { generateCommand } from "@/app/video/logic/videoProcessor"

const VideoContext = createContext()

export function VideoProvider({ children }) {
  const { ffmpeg, loaded, message: ffmpegStatus } = useFFmpeg()
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // --- NEW: Universal Tool Settings ---
  // यह एक ऑब्जेक्ट है जो हर टूल की सेटिंग्स रखेगा
  const [toolSettings, setToolSettings] = useState({
    format: "mp4",      // For Format Conversion
    quality: "medium",  // For Compression
    resizeScale: 1,     // For Resize
    volume: 1,          // For Audio
    // ... add more defaults as needed
  })

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  // Settings update helper
  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  async function executeTool(toolName) {
    if (!selectedFile || !loaded || !ffmpeg) {
      setError("Engine not loaded or file missing.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const fileExt = selectedFile.name.split('.').pop()
      const inputName = `input.${fileExt}`

      await ffmpeg.writeFile(inputName, await fetchFile(selectedFile))

      // --- CRITICAL CHANGE ---
      // अब हम generateCommand में toolSettings भेज रहे हैं
      const { args, outputFile, mimeType } = generateCommand(toolName, inputName, toolSettings)

      const handleProgress = ({ progress: p }) => setProgress(Math.round(p * 100))
      ffmpeg.on("progress", handleProgress)

      console.log(`Command: ${args.join(" ")}`)
      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputFile)
      const blob = new Blob([data.buffer], { type: mimeType })
      const url = URL.createObjectURL(blob)

      setResult({
        message: "Success",
        details: `Created ${outputFile}`,
        downloadUrl: url,
        fileName: outputFile
      })

      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputFile)
      ffmpeg.off("progress", handleProgress)

    } catch (err) {
      console.error(err)
      setError(err.message || "Processing Failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <VideoContext.Provider 
      value={{ 
        loaded, ffmpegStatus,
        selectedFile, handleFileSelect,
        executeTool,
        isProcessing, progress, result, error,
        // New Exports
        toolSettings, updateToolSettings
      }}
    >
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  return useContext(VideoContext)
}