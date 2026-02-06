"use client"

import { useRouter } from "next/navigation"
import { Settings, CheckCircle, UploadCloud, Play, Loader2, Download, FileAudio, Music as MusicIcon, Layers, FileVideo } from "lucide-react"
import { getIcon, getDescription } from "../utils"

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
  const router = useRouter()
  
  const { 
    selectedFile, 
    selectedFiles, // Destructure multi-files
    handleFileSelect, 
    handleMultiFileSelect, // Destructure multi-handler
    executeTool, 
    isProcessing, 
    progress, 
    result,
    error,
    loaded,
    ffmpegStatus
  } = useAudio()

  // --- LOGIC: Determine Tool Type ---
  const name = toolName.toLowerCase()
  const isMergeTool = name.includes("merge") || name.includes("join")
  const isVideoTool = name.includes("extract")
  
  // Set accept type: Video for extraction, Audio for everything else
  const acceptType = isVideoTool ? "video/*,audio/*" : "audio/*"

  // --- HANDLER: File Input ---
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMergeTool) {
        handleMultiFileSelect(e.target.files)
      } else {
        handleFileSelect(e.target.files[0])
      }
    }
  }

  // --- RENDER: Settings Component Switch ---
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

    return <div className="text-gray-500">Settings not found for {toolName}.</div>;
  }

  // --- LOADING STATE ---
  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
         <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
         <p className="text-violet-400">Initializing Audio Engine...</p>
         <span className="text-xs text-gray-500 font-mono">{ffmpegStatus}</span>
      </div>
    )
  }

  // Helper to determine if we have ANY content loaded (Single or Multi)
  const hasContent = isMergeTool ? selectedFiles.length > 0 : !!selectedFile;

  return (
    <div className="max-w-5xl mx-auto w-full">
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-6 md:p-12 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          <div className="p-4 md:p-6 bg-black border border-white/10 rounded-2xl shadow-2xl shrink-0">
             <div className="text-violet-400 w-12 h-12 md:w-16 md:h-16 [&>svg]:w-full [&>svg]:h-full">
               {getIcon(toolName)}
             </div>
          </div>
          
          <div className="space-y-2 md:space-y-4 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white break-words leading-tight">
              {toolName}
            </h1>
            <p className="text-sm md:text-xl text-gray-400 leading-relaxed">
              {getDescription(toolName)}
            </p>
            <div className="flex flex-wrap gap-3 text-xs md:text-sm font-medium pt-2">
               <span className="flex items-center gap-1.5 text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full whitespace-nowrap">
                 <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> Browser Native (FFmpeg)
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all h-64 md:h-80 relative group overflow-hidden
            ${hasContent ? "border-violet-500/50 bg-violet-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
          >
            <input 
              // Force re-render input if switching between multi/single to reset internal state
              key={isMergeTool ? "multi-input" : "single-input"} 
              type="file" 
              accept={acceptType}
              multiple={isMergeTool}
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              disabled={isProcessing}
            />
            
            {/* DISPLAY LOGIC: MULTIPLE FILES */}
            {isMergeTool && selectedFiles.length > 0 ? (
               <div className="z-10 space-y-3 px-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">
                      {selectedFiles.length} Audio Files Selected
                    </p>
                    <p className="text-gray-400 text-xs">
                      Ready to merge
                    </p>
                  </div>
                  <div className="flex justify-center -space-x-2 mt-2">
                    {selectedFiles.slice(0, 5).map((f, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-[8px] text-white font-mono shadow-lg relative z-10">
                         {i+1}
                      </div>
                    ))}
                    {selectedFiles.length > 5 && (
                       <div className="w-8 h-8 rounded-full bg-neutral-700 border border-white/20 flex items-center justify-center text-[8px] text-white font-mono shadow-lg relative z-20">
                         +{selectedFiles.length - 5}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-violet-400 mt-2">Click to change selection</p>
               </div>

            /* DISPLAY LOGIC: SINGLE FILE */
            ) : selectedFile ? (
              <div className="z-10 space-y-3 px-4 animate-in fade-in zoom-in duration-300">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center mx-auto">
                    {isVideoTool ? <FileVideo className="w-6 h-6 md:w-8 md:h-8" /> : <MusicIcon className="w-6 h-6 md:w-8 md:h-8" />}
                 </div>
                 <div className="overflow-hidden">
                   <p className="text-white font-medium text-base md:text-lg truncate max-w-[250px] mx-auto">
                     {selectedFile.name}
                   </p>
                   <p className="text-gray-400 text-xs md:text-sm">
                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                   </p>
                 </div>
                 <p className="text-xs text-violet-400">Click to change file</p>
              </div>

            /* DISPLAY LOGIC: EMPTY STATE */
            ) : (
              <div className="z-10 space-y-3 px-4">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mx-auto transition-colors">
                    <UploadCloud className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 <div>
                   <p className="text-gray-300 font-medium text-base md:text-lg">
                     {isMergeTool ? "Select Multiple Audio Files" : (isVideoTool ? "Click or Drop Video Here" : "Click or Drop Audio Here")}
                   </p>
                   <p className="text-gray-500 text-xs md:text-sm">
                     {isVideoTool ? "Supports MP4, MOV, MKV" : "Supports MP3, WAV, AAC"}
                   </p>
                 </div>
              </div>
            )}
          </div>

          <button
            onClick={() => executeTool(toolName)}
            disabled={!hasContent || isProcessing}
            className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]
              ${!hasContent
                ? "bg-white/5 text-gray-600 cursor-not-allowed" 
                : isProcessing
                  ? "bg-violet-600/50 text-white cursor-wait"
                  : "bg-violet-500 hover:bg-violet-400 text-black shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                Processing {progress.toFixed(0)}%
              </>
            ) : (
              <>
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                Start Process
              </>
            )}
          </button>
        </div>

        {/* Right: Settings & Console */}
        <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-5 md:p-6 h-full min-h-[320px] flex flex-col order-last lg:order-none">
          <h3 className="text-gray-400 font-medium mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </h3>

          <div className="mb-4">
            {hasContent && renderToolControls()}
          </div>

          <div className="flex-1 bg-black/40 rounded-xl p-3 md:p-4 font-mono text-xs md:text-sm overflow-y-auto space-y-2 border border-white/5 max-h-[300px] lg:max-h-none">
             {!hasContent && <span className="text-gray-600">Waiting for file...</span>}
             
             {hasContent && !isProcessing && !result && (
               <span className="text-violet-400">File loaded. Configure settings.</span>
             )}

             {isProcessing && (
               <div className="space-y-2">
                 <span className="text-yellow-400 block">{'>'} Processing... {progress.toFixed(0)}%</span>
               </div>
             )}

             {result && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                 <span className="text-green-400 block break-words">{'>'} {result.message}</span>
                 
                 <a 
                  href={result.downloadUrl}
                  download={result.fileName}
                  className="mt-4 block w-full py-2 bg-white/10 hover:bg-white/20 text-center rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                 >
                   <Download className="w-4 h-4" /> Download Result
                 </a>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}