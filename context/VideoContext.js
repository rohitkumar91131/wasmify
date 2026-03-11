"use client"

import { createContext, useContext, useState } from "react"

const VideoContext = createContext()

export function VideoProvider({ children }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [toolSettings, setToolSettings] = useState({
    format: "mp4",
    quality: "medium",
    resizeScale: 1,
    volume: 1,
  })

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  async function executeTool(toolName) {
    if (!selectedFile) {
      setError("Please select a file first.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("tool", toolName)
      formData.append("settings", JSON.stringify(toolSettings))

      setProgress(10)
      const response = await fetch("/api/video", { method: "POST", body: formData })
      setProgress(90)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const fileName = response.headers.get("X-File-Name") || `output_${Date.now()}.mp4`
      const url = URL.createObjectURL(blob)

      setProgress(100)
      setResult({ message: "Success", details: `Created ${fileName}`, downloadUrl: url, fileName })

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
        loaded: true, ffmpegStatus: "Ready",
        selectedFile, handleFileSelect,
        executeTool,
        isProcessing, progress, result, error,
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