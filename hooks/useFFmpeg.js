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
      // ✅ Local folder path (No CDN)
      const baseURL = `${window.location.origin}/ffmpeg`

      const coreURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript"
      )

      const wasmURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      )

      // ❌ Worker URL hata diya hai (Single Threaded mode ke liye)
      // Isse memory crash aur header issues solve ho jayenge.

      await ffmpeg.load({
        coreURL,
        wasmURL
      })

      setLoaded(true)
      setMessage("FFmpeg Ready")
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