"use client"

import { UploadCloud, Play, Loader2, Download, FileText, Layers } from "lucide-react"

// --- TOOL SETTINGS IMPORTS ---
import MergePdf from "./tools/MergePdf"
import SplitPdf from "./tools/SplitPdf"
import ProtectPdf from "./tools/ProtectPdf"
import UnlockPdf from "./tools/UnlockPdf"
import RotatePdf from "./tools/RotatePdf"
import WatermarkPdf from "./tools/WatermarkPdf"
import { usePdf } from "@/context/PdfContext"

export default function ActivePdfTool({ toolName }) {
  const { 
    selectedFile,
    selectedFiles, 
    handleFileSelect,
    handleMultiFileSelect, 
    executeTool, 
    isProcessing, 
    result,
    error
  } = usePdf()

  const name = toolName.toLowerCase();
  const isMergeTool = name.includes("merge");

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMergeTool) {
        handleMultiFileSelect(e.target.files);
      } else {
        handleFileSelect(e.target.files[0]);
      }
    }
  }

  const renderToolControls = () => {
    if (name.includes("merge")) return <MergePdf />;
    if (name.includes("split")) return <SplitPdf />;
    if (name.includes("protect")) return <ProtectPdf />;
    if (name.includes("unlock")) return <UnlockPdf />;
    if (name.includes("rotate")) return <RotatePdf />;
    if (name.includes("watermark")) return <WatermarkPdf />;
    return null;
  }

  const hasContent = isMergeTool ? selectedFiles.length > 0 : !!selectedFile;

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-white">{toolName}</h1>

      {/* Upload */}
      <div className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center
        min-h-[200px] transition-all relative group overflow-hidden
        ${hasContent ? "border-rose-500/50 bg-rose-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
      >
        <input
          key={isMergeTool ? "multi-input" : "single-input"}
          type="file"
          accept=".pdf"
          multiple={isMergeTool}
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          disabled={isProcessing}
        />

        {hasContent ? (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              {isMergeTool ? <Layers className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <p className="text-white font-medium truncate max-w-[220px] mx-auto">
              {isMergeTool ? `${selectedFiles.length} PDFs Selected` : selectedFile.name}
            </p>
            <p className="text-gray-400 text-xs">
              {isMergeTool ? "Ready to Combine" : `${(selectedFile.size/1024/1024).toFixed(2)} MB`}
            </p>
            <p className="text-xs text-rose-400">Click to change selection</p>
          </div>
        ) : (
          <div className="z-10 space-y-2 px-4">
            <div className="w-12 h-12 bg-white/10 text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mx-auto transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-gray-300 font-medium text-sm">
              {isMergeTool ? "Select Multiple PDFs" : "Click or Drop PDF Here"}
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
              ? "bg-rose-600/50 text-white cursor-wait"
              : "bg-rose-500 hover:bg-rose-400 text-black"
          }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            {isMergeTool ? "Merge PDFs" : "Process PDF"}
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
            className="block w-full py-2 bg-white/10 hover:bg-white/20 text-center rounded-lg text-white flex items-center justify-center gap-2 border border-white/10"
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>
        </div>
      )}
    </div>
  )
}