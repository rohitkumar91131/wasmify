"use client"

import { createContext, useContext, useState } from "react"
import { useFFmpeg } from "@/hooks/useFFmpeg"
import { fetchFile } from "@ffmpeg/util"

const VideoContext = createContext()

export function VideoProvider({ children }) {
  const { ffmpeg, loaded, message } = useFFmpeg()
  
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState("mp4")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function convert() {
    if (!file || !loaded || !ffmpeg) return

    setLoading(true)
    setProgress(0)

    try {
      // 1. Setup file names
      const fileExt = file.name.split('.').pop()
      const inputName = `input.${fileExt}`
      const outputName = `output.${format}`

      // 2. Write file to memory
      const fileData = await fetchFile(file)
      await ffmpeg.writeFile(inputName, fileData)

      // 3. Progress Listener
      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100))
      })

      // 4. Run FFmpeg Command
      await ffmpeg.exec([
        "-i", inputName,
        "-preset", "ultrafast",
        "-crf", "28",
        outputName
      ])

      // 5. Read Output
      const data = await ffmpeg.readFile(outputName)

      // 6. Standard Download (Blob)
      // This is the simplest, most compatible method
      const blob = new Blob([data.buffer], { type: `video/${format}` })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement("a")
      a.href = url
      a.download = outputName
      document.body.appendChild(a) // Required for Firefox sometimes
      a.click()
      
      // Clean up the DOM and Memory
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // 7. Cleanup FFmpeg Memory
      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)

    } catch (err) {
      console.error(err)
      if (err.message && err.message.includes("memory")) {
        alert("File too big! Browser ran out of memory. Try a smaller file.")
      } else {
        alert("Conversion Error: " + (err.message || "Unknown error"))
      }
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <VideoContext.Provider 
      value={{ 
        file, setFile, 
        format, setFormat, 
        loading, 
        progress,
        convert,
        loaded, message 
      }}
    >
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  return useContext(VideoContext)
}