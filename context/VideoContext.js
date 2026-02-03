"use client"

import { createContext, useContext, useState } from "react"
import { useFFmpeg } from "@/hooks/useFFmpeg"
// 1. fetchFile import karo memory bachane ke liye
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

    const inputName = "input.mp4"
    const outputName = `output.${format}`

    try {
      // ✅ FIX 1: Better Memory Handling
      // 'file.arrayBuffer()' ki jagah 'fetchFile' use karein.
      // Ye internally memory chunks ko better manage karta hai.
      const fileData = await fetchFile(file)
      await ffmpeg.writeFile(inputName, fileData)

      // Listen for progress
      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100))
      })

      // ✅ FIX 2: RAM-Safe Command
      // Agar file badi hai to 'ultrafast' preset aur 'scale' zaroori hai
      // taaki processing ke time RAM overflow na ho.
      await ffmpeg.exec([
        "-i", inputName,
        "-preset", "ultrafast",  // Uses minimal RAM
        "-crf", "28",            // Thodi quality kam karke crash rokta hai
        outputName
      ])

      const data = await ffmpeg.readFile(outputName)

      // ✅ FIX 3: Save File (Native Picker)
      try {
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
          // Fallback
          const blob = new Blob([data.buffer], { type: `video/${format}` })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = outputName
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch (saveErr) {
        if (saveErr.name !== 'AbortError') console.error(saveErr)
      }

      // Cleanup
      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)

    } catch (err) {
      console.error(err)
      // User ko clear error dikhao
      if (err.message.includes("memory")) {
        alert("File too big for browser! Try a smaller file or close other tabs.")
      } else {
        alert("Error: " + err.message)
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