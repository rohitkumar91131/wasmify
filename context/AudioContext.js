"use client"

import { createContext, useContext, useState } from "react"

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [toolSettings, setToolSettings] = useState({
    format: "mp3",
    bitrate: "128k",
    startTime: "00:00:00",
    endTime: "00:00:10",
    volume: 1.5,
    speed: 1.5,
    noiseLevel: 12
  })

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setSelectedFiles([])
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const handleMultiFileSelect = (files) => {
    const fileArray = Array.from(files)
    setSelectedFiles(fileArray)
    setSelectedFile(fileArray[0])
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  async function executeTool(toolName) {
    if (!selectedFile && selectedFiles.length === 0) {
      setError("Please select a file first.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("tool", toolName)
      formData.append("settings", JSON.stringify(toolSettings))

      if (toolName === "Merge Audio") {
        selectedFiles.forEach(f => formData.append("files", f))
      } else {
        formData.append("file", selectedFile)
      }

      setProgress(10)
      const response = await fetch("/api/audio", { method: "POST", body: formData })
      setProgress(90)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const fileName = response.headers.get("X-File-Name") || `output_${Date.now()}.mp3`
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
    <AudioContext.Provider 
      value={{ 
        loaded: true, ffmpegStatus: "Ready",
        selectedFile, selectedFiles,
        handleFileSelect, handleMultiFileSelect,
        executeTool,
        isProcessing, progress, result, error,
        toolSettings, updateToolSettings
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}