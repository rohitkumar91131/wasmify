"use client"

import { createContext, useContext, useState } from "react"
import { useFFmpeg } from "@/hooks/useFFmpeg"
import { fetchFile } from "@ffmpeg/util"
import { generateAudioCommand } from "@/app/audio/logic/audioProcessor"

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const { ffmpeg, loaded, message: ffmpegStatus } = useFFmpeg()
  
  const [selectedFile, setSelectedFile] = useState(null)
  // 👇 NEW: Store multiple files
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

  // Single File Handler
  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setSelectedFiles([]) 
    setResult(null)
    setError(null)
    setProgress(0)
  }

  // 👇 NEW: Multi File Handler
  const handleMultiFileSelect = (files) => {
    const fileArray = Array.from(files)
    setSelectedFiles(fileArray)
    setSelectedFile(fileArray[0]) // Preview the first one
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const updateToolSettings = (newSettings) => {
    setToolSettings(prev => ({ ...prev, ...newSettings }))
  }

  async function executeTool(toolName) {
    if ((!selectedFile && selectedFiles.length === 0) || !loaded || !ffmpeg) {
      setError("Engine not loaded or file missing.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      let commandData;

      // ==========================================
      // SCENARIO A: MERGE AUDIO (Multi-File)
      // ==========================================
      if (toolName === "Merge Audio") {
        const inputs = []
        
        // 1. Write ALL files to FFmpeg FS
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          const ext = file.name.split('.').pop()
          const inputName = `input${i}.${ext}`
          await ffmpeg.writeFile(inputName, await fetchFile(file))
          inputs.push(inputName)
        }

        // 2. Generate Command using the list of filenames
        commandData = generateAudioCommand(toolName, inputs, toolSettings)
      } 
      
      // ==========================================
      // SCENARIO B: SINGLE FILE TOOLS
      // ==========================================
      else {
        const fileExt = selectedFile.name.split('.').pop()
        const inputName = `input.${fileExt}`
        await ffmpeg.writeFile(inputName, await fetchFile(selectedFile))
        
        commandData = generateAudioCommand(toolName, inputName, toolSettings)
      }

      const { args, outputFile, mimeType } = commandData

      // 3. Execution
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

      // Cleanup logic (Generic)
      try {
         // Delete output
         await ffmpeg.deleteFile(outputFile);
         // Delete inputs
         if (toolName === "Merge Audio") {
            for (let i = 0; i < selectedFiles.length; i++) {
              const ext = selectedFiles[i].name.split('.').pop()
              await ffmpeg.deleteFile(`input${i}.${ext}`)
            }
         } else {
            const ext = selectedFile.name.split('.').pop()
            await ffmpeg.deleteFile(`input.${ext}`)
         }
      } catch(e) { console.warn("Cleanup warning", e) }

      ffmpeg.off("progress", handleProgress)

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
        loaded, ffmpegStatus,
        selectedFile, selectedFiles, // Exported
        handleFileSelect, handleMultiFileSelect, // Exported
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