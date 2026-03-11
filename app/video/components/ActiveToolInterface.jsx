"use client"

import {
  UploadCloud,
  Play,
  Loader2,
  Download,
  FileVideo
} from "lucide-react"

import FormatConversion from "./tools/FormatConversion"
import ResizeResolution from "./tools/ResizeResolution"
import Compression from "./tools/Compression"
import MuteAudio from "./tools/MuteAudio"
import ExtractAudio from "./tools/ExtractAudio"
import FrameRate from "./tools/FrameRate"
import SpeedControl from "./tools/SpeedControl"
import AspectRatioCrop from "./tools/AspectRatioCrop"
import TrimVideo from "./tools/TrimVideo"
import GifMaker from "./tools/GifMaker"

import { useVideo } from "@/context/VideoContext"

export default function ActiveToolInterface({ toolName }) {
  const {
    selectedFile,
    handleFileSelect,
    executeTool,
    isProcessing,
    progress,
    result,
    error,
    loaded,
    ffmpegStatus
  } = useVideo()

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const renderToolControls = () => {
    switch (toolName) {
      case "Format Conversion": return <FormatConversion />
      case "Resize / Resolution": return <ResizeResolution />
      case "Compression (Quality)": return <Compression />
      case "Mute Audio": return <MuteAudio />
      case "Extract Audio": return <ExtractAudio />
      case "Frame Rate (FPS)": return <FrameRate />
      case "Speed Control": return <SpeedControl />
      case "Aspect Ratio / Crop": return <AspectRatioCrop />
      case "Trim Video": return <TrimVideo />
      case "GIF Maker": return <GifMaker />
      default: return null
    }
  }

  if (!loaded) {
    return (
      <div className="text-center mt-20 text-yellow-500">
        Loading Core Engine... ({ffmpegStatus})
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-3 sm:px-4 space-y-6">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-white">{toolName}</h1>

      {/* Upload */}
      <div
        className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center
          min-h-[200px] transition-all relative
          ${selectedFile
            ? "border-green-500/50 bg-green-500/5"
            : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
      >
        <input
          type="file"
          accept="video/*"
          onChange={onFileChange}
          disabled={isProcessing}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />

        {selectedFile ? (
          <div className="space-y-2 px-4">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
              <FileVideo className="w-6 h-6" />
            </div>
            <p className="text-white font-medium truncate max-w-[220px] mx-auto">
              {selectedFile.name}
            </p>
            <p className="text-gray-400 text-xs">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2 px-4">
            <div className="w-12 h-12 bg-white/10 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-gray-300 font-medium text-sm">Click or Drop Video</p>
          </div>
        )}
      </div>

      {/* Tool Settings */}
      {renderToolControls()}

      {/* Process Button */}
      <button
        onClick={() => executeTool(toolName)}
        disabled={!selectedFile || isProcessing}
        className={`w-full py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2
          ${!selectedFile
            ? "bg-white/5 text-gray-600 cursor-not-allowed"
            : isProcessing
              ? "bg-green-600/50 text-white cursor-wait"
              : "bg-green-500 hover:bg-green-400 text-black"
          }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing {progress.toFixed(0)}%
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            Start
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-3 bg-neutral-900/50 border border-white/10 rounded-2xl p-4">
          <p className="text-green-400 text-sm">{result.message}</p>
          {result.details && <p className="text-gray-400 text-xs">{result.details}</p>}
          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="block w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-center text-white flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Result
          </a>
        </div>
      )}
    </div>
  )
}
