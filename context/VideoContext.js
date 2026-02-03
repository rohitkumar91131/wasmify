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
      // 1. Get the correct file extension (e.g., 'mov', 'avi')
      const fileExt = file.name.split('.').pop()
      const inputName = `input.${fileExt}`
      const outputName = `output.${format}`

      // 2. Write file to memory (Using fetchFile for better memory management)
      const fileData = await fetchFile(file)
      await ffmpeg.writeFile(inputName, fileData)

      // 3. Progress Listener
      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100))
      })

      // 4. Run FFmpeg Command (Single-Threaded Optimized)
      // Note: We removed '-threads' flag because we are using single-threaded mode
      await ffmpeg.exec([
        "-i", inputName,
        "-preset", "ultrafast",  // Critical for browser speed
        "-crf", "28",            // Balances quality vs memory usage
        outputName
      ])

      // 5. Read Output
      const data = await ffmpeg.readFile(outputName)

      // 6. Save File (Native Picker with Fallback)
      try {
        // Try Native Save (Chrome/Edge) - bypasses RAM limits significantly
        if (window.showSaveFilePicker) {
          const handle = await window.showSaveFilePicker({
            suggestedName: outputName,
            types: [{
              description: 'Video File',
              accept: { [`video/${format}`]: [`.${format}`] },
            }],
          })
          const writable = await handle.createWritable()
          await writable.write(data)
          await writable.close()
        } else {
          // Legacy Download (Firefox/Safari)
          const blob = new Blob([data.buffer], { type: `video/${format}` })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = outputName
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch (saveErr) {
        // Ignore abort errors (user clicked cancel)
        if (saveErr.name !== 'AbortError') {
          console.error("Save failed:", saveErr)
        }
      }

      // 7. Cleanup (Vital for Vercel/Browser memory)
      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)

    } catch (err) {
      console.error(err)
      // Friendly error handling
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