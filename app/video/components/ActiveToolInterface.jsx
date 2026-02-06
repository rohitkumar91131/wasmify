"use client"

import { useRouter } from "next/navigation"
import {
  Settings,
  CheckCircle,
  UploadCloud,
  Play,
  Loader2,
  Download,
  FileVideo
} from "lucide-react"

import { getIcon, getDescription } from "../utils"

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
  const router = useRouter()

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
    <div className="max-w-5xl mx-auto w-full px-3 sm:px-4">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* ===== MOBILE-COMPACT HEADER ===== */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-2xl sm:rounded-3xl
        p-3 sm:p-6 md:p-12 relative overflow-hidden mb-4 sm:mb-8">

        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex items-center gap-3 sm:gap-6 md:gap-8">

          <div className="p-2 sm:p-4 md:p-6 bg-black border border-white/10 rounded-xl sm:rounded-2xl shrink-0">
            <div className="text-green-400 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 [&>svg]:w-full [&>svg]:h-full">
              {getIcon(toolName)}
            </div>
          </div>

          <div className="space-y-1 sm:space-y-3 w-full">
            <h1 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
              {toolName}
            </h1>

            <p className="text-xs sm:text-base md:text-xl text-gray-400 leading-snug line-clamp-2 sm:line-clamp-none">
              {getDescription(toolName)}
            </p>

            <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-400/10
              px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              Browser Native
            </span>
          </div>
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

        {/* Upload */}
        <div className="lg:col-span-2 space-y-5">

          <div
            className={`border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center
              min-h-[200px] sm:min-h-[260px] md:min-h-[320px] transition-all relative
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
                <p className="text-gray-300 font-medium text-sm">
                  Click or Drop Video
                </p>
              </div>
            )}
          </div>

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
                Start {toolName}
              </>
            )}
          </button>
        </div>

        {/* Console */}
        <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col min-h-[260px]">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Output Console
          </h3>

          {selectedFile && <div className="mb-4">{renderToolControls()}</div>}

          <div className="flex-1 bg-black/40 rounded-xl p-3 font-mono text-xs overflow-y-auto border border-white/5 max-h-[240px] sm:max-h-[300px] lg:max-h-none">
            {!selectedFile && <span className="text-gray-600">Waiting for file…</span>}

            {isProcessing && (
              <span className="text-yellow-400">{">"} Processing {progress.toFixed(0)}%</span>
            )}

            {result && (
              <div className="space-y-3">
                <span className="text-green-400">{">"} {result.message}</span>
                <span className="text-gray-400">{">"} {result.details}</span>

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
        </div>
      </div>
    </div>
  )
}
