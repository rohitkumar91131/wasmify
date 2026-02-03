"use client"

import { VideoProvider, useVideo } from "@/context/VideoContext"
import VideoHeader from "./VideoHeader"
import VideoPicker from "./VideoPicker"
import FormatSelector from "./FormatSelector"
import ConvertButton from "./ConvertButton"
import ProgressBar from "./ProgressBar" // Import it

function ConverterUI() {
  const { loaded, message, loading } = useVideo()

  return (
    <div className="space-y-8 w-full max-w-xl mx-auto">
      <VideoHeader />

      <div className="text-sm text-gray-400">
        {loaded ? "FFmpeg Ready" : message}
      </div>

      <VideoPicker />
      <FormatSelector />
      
      {/* Show Progress Bar only when loading */}
      {loading && <ProgressBar />}
      
      <ConvertButton />
    </div>
  )
}

export default function VideoConverter() {
  return (
    <VideoProvider>
      <ConverterUI />
    </VideoProvider>
  )
}