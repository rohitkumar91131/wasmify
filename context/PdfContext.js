"use client"

import { processPdfTool } from "@/app/pdf/logic/pdfProcessor"
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

  // Single File
  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setSelectedFiles([])
    setResult(null)
    setError(null)
  }

  // Multi File (Merge)
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
      // Delay for UI feedback
      await new Promise(r => setTimeout(r, 500));
      
      const isMerge = toolName.toLowerCase().includes("merge");
      const input = isMerge ? selectedFiles : selectedFile;

      const output = await processPdfTool(toolName, input, toolSettings);
      
      setResult({
          downloadUrl: output.url,
          fileName: output.fileName,
          message: output.message
      });

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