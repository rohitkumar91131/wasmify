"use client"

import { processImageTool } from "@/app/image/logic/imageProcessor"
import React, { createContext, useContext, useState } from "react"

const ImageContext = createContext()

export function ImageProvider({ children }) {
  const [selectedFile, setSelectedFile] = useState(null)
  
  // --- NEW: Multiple Files State ---
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
    // PDF Settings
    pdfPaperSize: "a4",
    pdfOrientation: "portrait",
    pdfMargin: 10
  })

  // Handle Single File
  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setSelectedFiles([]) // Clear multi
    setResult(null)
    setError(null)
    setProgress(0)
  }

  // --- NEW: Handle Multiple Files ---
  const handleMultiFileSelect = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray)
    setSelectedFile(fileArray[0]) // Preview the first file
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  const executeTool = async (toolName) => {
    // Check if we have EITHER a single file OR multiple files
    if (!selectedFile && selectedFiles.length === 0) return;

    setIsProcessing(true)
    setProgress(10)
    setError(null)
    setResult(null)

    try {
      await new Promise(r => setTimeout(r, 100));
      
      // Decide payload: Array for PDF, Single File for others
      const inputPayload = toolName === "Image to PDF" ? selectedFiles : selectedFile;

      const output = await processImageTool(toolName, inputPayload, toolSettings);
      
      setProgress(100);
      setResult(output);
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