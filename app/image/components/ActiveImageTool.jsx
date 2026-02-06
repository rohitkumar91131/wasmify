"use client"

import { useRouter } from "next/navigation"
import { Settings, CheckCircle, UploadCloud, Play, Loader2, Download, Image as ImageIcon, Layers } from "lucide-react"
import { getIcon, getDescription } from "../utils"

// Tool Components
import FormatConversion from "../tools/FormatConversion"
import ResizeScale from "../tools/ResizeScale"
import Compression from "../tools/Compression"
import Crop from "../tools/Crop"
import RotateFlip from "../tools/RotateFlip"
import BackgroundRemoval from "../tools/BackgroundRemoval"
import ImageToPDF from "../tools/ImageToPDF"
import Watermark from "../tools/Watermark"
import MetadataCleaner from "../tools/MetadataCleaner"
import { useImage } from "@/context/ImageContext"

export default function ActiveImageTool({ toolName }) {
  const router = useRouter()
  
  const { 
    selectedFile,
    selectedFiles, 
    handleFileSelect,
    handleMultiFileSelect, 
    executeTool, 
    isProcessing, 
    result,
    error
  } = useImage()

  // FIX: Case insensitive check (PDF, pdf, Pdf all work)
  const isMultiFileTool = toolName?.toLowerCase().includes("pdf");

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMultiFileTool) {
        handleMultiFileSelect(e.target.files);
      } else {
        handleFileSelect(e.target.files[0]);
      }
    }
  }

  const renderToolControls = () => {
    switch (toolName) {
      case "Format Conversion": return <FormatConversion />;
      case "Resize / Scale": return <ResizeScale />;
      case "Compression": return <Compression />;
      case "Crop": return <Crop />;
      case "Rotate / Flip": return <RotateFlip />;
      case "Background Removal": return <BackgroundRemoval />;
      case "Image to PDF": return <ImageToPDF />;
      case "Watermark": return <Watermark />;
      case "Metadata Cleaner": return <MetadataCleaner />;
      default: return null;
    }
  }

  // Helper logic for UI state
  const hasContent = isMultiFileTool 
    ? selectedFiles.length > 0 
    : !!selectedFile;

  return (
    <div className="max-w-5xl mx-auto w-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-6 md:p-12 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          <div className="p-4 md:p-6 bg-black border border-white/10 rounded-2xl shadow-2xl shrink-0">
             <div className="text-blue-400 w-12 h-12 md:w-16 md:h-16 [&>svg]:w-full [&>svg]:h-full">
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
               <span className="flex items-center gap-1.5 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full whitespace-nowrap">
                 <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> Client-Side Processing
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all h-64 md:h-80 relative group overflow-hidden
            ${hasContent ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
          >
            <input 
              // FIX: Add key to force re-render when switching tools
              key={isMultiFileTool ? "multi-enabled" : "single-only"}
              type="file" 
              accept="image/*"
              multiple={isMultiFileTool} 
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              disabled={isProcessing}
            />
            
            {/* Display Logic */}
            {selectedFiles.length > 0 && isMultiFileTool ? (
               <div className="z-10 space-y-3 px-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">
                      {selectedFiles.length} Images Selected
                    </p>
                    <p className="text-gray-400 text-xs">
                      Ready to combine
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
                  <p className="text-xs text-blue-400 mt-2 font-medium">Click to change selection</p>
               </div>
            ) : selectedFile ? (
              // Single File Display
              <div className="z-10 space-y-3 px-4 animate-in fade-in zoom-in duration-300">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 <div className="overflow-hidden">
                   <p className="text-white font-medium text-base md:text-lg truncate max-w-[250px] mx-auto">
                     {selectedFile.name}
                   </p>
                   <p className="text-gray-400 text-xs md:text-sm">
                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                   </p>
                 </div>
                 <p className="text-xs text-blue-400">Click to change image</p>
              </div>
            ) : (
              // Empty State
              <div className="z-10 space-y-3 px-4">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mx-auto transition-colors">
                    <UploadCloud className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 <div>
                   <p className="text-gray-300 font-medium text-base md:text-lg">
                     {isMultiFileTool ? "Select Multiple Images" : "Click or Drop Image Here"}
                   </p>
                   <p className="text-gray-500 text-xs md:text-sm">Supports JPG, PNG, WEBP</p>
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
                  ? "bg-blue-600/50 text-white cursor-wait"
                  : "bg-blue-500 hover:bg-blue-400 text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                {isMultiFileTool ? "Generating PDF..." : "Processing..."}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                {isMultiFileTool ? "Create PDF" : "Start Processing"}
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
             {!hasContent && <span className="text-gray-600">Waiting for files...</span>}
             
             {result && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                 <span className="text-green-400 block break-words">{'>'} {result.message}</span>
                 <span className="text-gray-400 block break-words">{'>'} {result.details}</span>
                 
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