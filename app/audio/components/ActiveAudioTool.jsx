"use client"

import { UploadCloud, Play, Loader2, Download, Music as MusicIcon, Layers, FileVideo } from "lucide-react"

// Tool Settings Imports
import FormatConverter from "../components/tools/FormatConverter"
import AudioCompression from "../components/tools/AudioCompression"
import TrimAudio from "../components/tools/TrimAudio"
import VolumeBoost from "../components/tools/VolumeBoost"
import SpeedControl from "../components/tools/SpeedControl"
import ReverseAudio from "../components/tools/ReverseAudio"
import NoiseReduction from "../components/tools/NoiseReduction"
import ExtractAudio from "../components/tools/ExtractAudio"
import MergeAudio from "../components/tools/MergeAudio"
import { useAudio } from "@/context/AudioContext"

export default function ActiveAudioTool({ toolName }) {
  const { 
    selectedFile, 
    selectedFiles,
    handleFileSelect, 
    handleMultiFileSelect,
    executeTool, 
    isProcessing, 
    progress, 
    result,
    error,
    loaded,
    ffmpegStatus
  } = useAudio()

  const name = toolName.toLowerCase()
  const isMergeTool = name.includes("merge") || name.includes("join")
  const isVideoTool = name.includes("extract")
  const acceptType = isVideoTool ? "video/*,audio/*" : "audio/*"

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMergeTool) {
        handleMultiFileSelect(e.target.files)
      } else {
        handleFileSelect(e.target.files[0])
      }
    }
  }

  const renderToolControls = () => {
    if (name.includes("format") || name.includes("convert")) return <FormatConverter />;
    if (name.includes("compress")) return <AudioCompression />;
    if (name.includes("trim") || name.includes("cut")) return <TrimAudio />;
    if (name.includes("volume") || name.includes("boost")) return <VolumeBoost />;
    if (name.includes("speed")) return <SpeedControl />;
    if (name.includes("reverse")) return <ReverseAudio />;
    if (name.includes("noise") || name.includes("denoise")) return <NoiseReduction />;
    if (name.includes("extract")) return <ExtractAudio />;
    if (name.includes("merge") || name.includes("join")) return <MergeAudio />;
    return null;
  }

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-violet-400">Initializing Audio Engine...</p>
        <span className="text-xs text-gray-500 font-mono">{ffmpegStatus}</span>
      </div>
    )
  }

  const hasContent = isMergeTool ? selectedFiles.length > 0 : !!selectedFile;

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-white">{toolName}</h1>

      {/* Upload */}
      <div className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center
        min-h-[200px] transition-all relative group overflow-hidden
        ${hasContent ? "border-violet-500/50 bg-violet-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
      >
        <input
          key={isMergeTool ? "multi-input" : "single-input"}
          type="file"
          accept={acceptType}
          multiple={isMergeTool}
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          disabled={isProcessing}
        />

        {isMergeTool && selectedFiles.length > 0 ? (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-white font-medium">{selectedFiles.length} Audio Files Selected</p>
            <p className="text-xs text-violet-400">Click to change selection</p>
          </div>
        ) : selectedFile ? (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center mx-auto">
              {isVideoTool ? <FileVideo className="w-6 h-6" /> : <MusicIcon className="w-6 h-6" />}
            </div>
            <p className="text-white font-medium truncate max-w-[220px] mx-auto">{selectedFile.name}</p>
            <p className="text-gray-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-xs text-violet-400">Click to change file</p>
          </div>
        ) : (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-white/10 text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mx-auto transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-gray-300 font-medium text-sm">
              {isMergeTool ? "Select Multiple Audio Files" : (isVideoTool ? "Click or Drop Video Here" : "Click or Drop Audio Here")}
            </p>
          </div>
        )}
      </div>

      {/* Tool Settings */}
      {renderToolControls()}

      {/* Process Button */}
      <button
        onClick={() => executeTool(toolName)}
        disabled={!hasContent || isProcessing}
        className={`w-full py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
          ${!hasContent
            ? "bg-white/5 text-gray-600 cursor-not-allowed"
            : isProcessing
              ? "bg-violet-600/50 text-white cursor-wait"
              : "bg-violet-500 hover:bg-violet-400 text-black"
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
          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="block w-full py-2 bg-white/10 hover:bg-white/20 text-center rounded-lg text-white flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Result
          </a>
        </div>
      )}
    </div>
  )
}