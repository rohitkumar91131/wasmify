"use client"

import { UploadCloud, Play, Loader2, Download, Image as ImageIcon, Layers } from "lucide-react"

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

  const hasContent = isMultiFileTool 
    ? selectedFiles.length > 0 
    : !!selectedFile;

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
        ${hasContent ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
      >
        <input
          key={isMultiFileTool ? "multi-enabled" : "single-only"}
          type="file"
          accept="image/*"
          multiple={isMultiFileTool}
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          disabled={isProcessing}
        />

        {selectedFiles.length > 0 && isMultiFileTool ? (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-white font-medium">{selectedFiles.length} Images Selected</p>
            <p className="text-xs text-blue-400">Click to change selection</p>
          </div>
        ) : selectedFile ? (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-white font-medium truncate max-w-[220px] mx-auto">{selectedFile.name}</p>
            <p className="text-gray-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-xs text-blue-400">Click to change image</p>
          </div>
        ) : (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-white/10 text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mx-auto transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-gray-300 font-medium text-sm">
              {isMultiFileTool ? "Select Multiple Images" : "Click or Drop Image Here"}
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
              ? "bg-blue-600/50 text-white cursor-wait"
              : "bg-blue-500 hover:bg-blue-400 text-black"
          }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isMultiFileTool ? "Generating PDF..." : "Processing..."}
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            {isMultiFileTool ? "Create PDF" : "Start"}
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
            className="block w-full py-2 bg-white/10 hover:bg-white/20 text-center rounded-lg text-white flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Result
          </a>
        </div>
      )}
    </div>
  )
}