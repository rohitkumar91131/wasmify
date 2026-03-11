"use client"

import React, { createContext, useContext, useState } from "react"

const ImageContext = createContext()

export function ImageProvider({ children }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [toolSettings, setToolSettings] = useState({
    format: "png",
    resizeScale: 0.5,
    resizeMode: "scale",
    targetWidth: 1080,
    quality: 0.8,
    pdfPaperSize: "a4",
    pdfOrientation: "portrait",
    pdfMargin: 10
  })

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setSelectedFiles([])
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const handleMultiFileSelect = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray)
    setSelectedFile(fileArray[0])
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  const executeTool = async (toolName) => {
    if (!selectedFile && selectedFiles.length === 0) return;

    setIsProcessing(true)
    setProgress(10)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("tool", toolName)
      formData.append("settings", JSON.stringify(toolSettings))

      if (toolName === "Image to PDF") {
        selectedFiles.forEach(f => formData.append("files", f))
      } else {
        formData.append("file", selectedFile)
      }

      const response = await fetch("/api/image", { method: "POST", body: formData })
      setProgress(90)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const fileName = response.headers.get("X-File-Name") || `edited_${Date.now()}`
      const url = URL.createObjectURL(blob)

      setProgress(100)
      setResult({
        message: "Success",
        details: `Processed image`,
        downloadUrl: url,
        fileName
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <ImageContext.Provider value={{
      selectedFile,
      selectedFiles,
      handleFileSelect,
      handleMultiFileSelect,
      executeTool,
      isProcessing,
      progress,
      result,
      error,
      toolSettings,
      updateToolSettings
    }}>
      {children}
    </ImageContext.Provider>
  )
}

export const useImage = () => useContext(ImageContext)