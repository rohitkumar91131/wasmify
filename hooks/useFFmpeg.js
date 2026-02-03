"use client"

import { useState, useEffect, useRef } from "react"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"

export const useFFmpeg = () => {
  const [loaded, setLoaded] = useState(false)
  const [message, setMessage] = useState("Loading engine...")
  const ffmpegRef = useRef(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg()
    }
    
    const ffmpeg = ffmpegRef.current
    if (ffmpeg.loaded) return

    ffmpeg.on("log", ({ message }) => {
      setMessage(message)
    })

    try {
      // Local folder path
      const baseURL = `${window.location.origin}/ffmpeg`

      const coreURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript"
      )

      const wasmURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      )

      // NEW: Load the worker file for Multi-Threading
      const workerURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      )

      await ffmpeg.load({
        coreURL,
        wasmURL,
        workerURL // Yeh zaroori hai speed ke liye
      })

      setLoaded(true)
      setMessage("FFmpeg Ready (Multi-Threaded)")
    } catch (err) {
      console.error(err)
      setMessage("Failed: " + (err.message || err))
    }
  }

  return {
    ffmpeg: ffmpegRef.current,
    loaded,
    message
  }
}