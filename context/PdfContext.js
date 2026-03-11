"use client"

import React, { createContext, useContext, useState } from "react"

const PdfContext = createContext()

export function PdfProvider({ children }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [toolSettings, setToolSettings] = useState({
    password: "",
    rotation: 90,
    splitRange: "all",
    watermarkText: "Confidential"
  })

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setSelectedFiles([])
    setResult(null)
    setError(null)
  }

  const handleMultiFileSelect = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray)
    setSelectedFile(fileArray[0])
    setResult(null)
    setError(null)
  }

  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  const executeTool = async (toolName) => {
    if (!selectedFile && selectedFiles.length === 0) return;

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("tool", toolName)
      formData.append("settings", JSON.stringify(toolSettings))

      const isMerge = toolName.toLowerCase().includes("merge")
      if (isMerge) {
        selectedFiles.forEach(f => formData.append("files", f))
      } else {
        formData.append("file", selectedFile)
      }

      const response = await fetch("/api/pdf", { method: "POST", body: formData })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const fileName = response.headers.get("X-File-Name") || `output_${Date.now()}.pdf`
      const url = URL.createObjectURL(blob)

      setResult({ downloadUrl: url, fileName, message: "Success" });

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <PdfContext.Provider value={{
      selectedFile,
      selectedFiles,
      handleFileSelect,
      handleMultiFileSelect,
      executeTool,
      isProcessing,
      result,
      error,
      toolSettings,
      updateToolSettings
    }}>
      {children}
    </PdfContext.Provider>
  )
}

export const usePdf = () => useContext(PdfContext)