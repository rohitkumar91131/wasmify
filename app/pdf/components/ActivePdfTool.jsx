"use client"

import { useRouter } from "next/navigation"
import { Settings, CheckCircle, UploadCloud, Play, Loader2, Download, FileText, Layers, ShieldCheck, Unlock, Stamp, Scissors, RotateCw } from "lucide-react"
import { getIcon, getDescription } from "../utils"

// --- TOOL SETTINGS IMPORTS ---
import MergePdf from "./tools/MergePdf"
import SplitPdf from "./tools/SplitPdf"
import ProtectPdf from "./tools/ProtectPdf"
import UnlockPdf from "./tools/UnlockPdf"
import RotatePdf from "./tools/RotatePdf"
import WatermarkPdf from "./tools/WatermarkPdf"
import { usePdf } from "@/context/PdfContext"

export default function ActivePdfTool({ toolName }) {
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
  } = usePdf()

  const name = toolName.toLowerCase();
  const isMergeTool = name.includes("merge");

  // --- FILE INPUT HANDLER ---
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMergeTool) {
        handleMultiFileSelect(e.target.files);
      } else {
        handleFileSelect(e.target.files[0]);
      }
    }
  }

  // --- COMPONENT SWITCHER ---
  const renderToolControls = () => {
    if (name.includes("merge")) return <MergePdf />;
    if (name.includes("split")) return <SplitPdf />;
    if (name.includes("protect")) return <ProtectPdf />;
    if (name.includes("unlock")) return <UnlockPdf />;
    if (name.includes("rotate")) return <RotatePdf />;
    if (name.includes("watermark")) return <WatermarkPdf />;

    return <div className="text-gray-500">Settings not found for {toolName}</div>;
  }

  // --- CONTENT CHECK ---
  const hasContent = isMergeTool ? selectedFiles.length > 0 : !!selectedFile;

  return (
    <div className="max-w-5xl mx-auto w-full">
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Header Section (Rose Theme) */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-6 md:p-12 relative overflow-hidden mb-8">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          <div className="p-4 md:p-6 bg-black border border-white/10 rounded-2xl shadow-2xl shrink-0">
             <div className="text-rose-400 w-12 h-12 md:w-16 md:h-16 [&>svg]:w-full [&>svg]:h-full">
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
               <span className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full whitespace-nowrap">
                 <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> Client-Side Processing
               </span>
               <span className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full whitespace-nowrap">
                 <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> 100% Private
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all h-64 md:h-80 relative group overflow-hidden
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
            
            {/* Display Logic */}
            {hasContent ? (
               <div className="z-10 space-y-3 px-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                    {isMergeTool ? <Layers className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg truncate max-w-[250px] mx-auto">
                      {isMergeTool ? `${selectedFiles.length} PDFs Selected` : selectedFile.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                       {isMergeTool ? "Ready to Combine" : `${(selectedFile.size/1024/1024).toFixed(2)} MB`}
                    </p>
                  </div>
                  <p className="text-xs text-rose-400 mt-2">Click to change selection</p>
               </div>
            ) : (
              <div className="z-10 space-y-3 px-4">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mx-auto transition-colors">
                    <UploadCloud className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 <div>
                   <p className="text-gray-300 font-medium text-base md:text-lg">
                     {isMergeTool ? "Select Multiple PDFs" : "Click or Drop PDF Here"}
                   </p>
                   <p className="text-gray-500 text-xs md:text-sm">
                     Supports .pdf documents
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
                  ? "bg-rose-600/50 text-white cursor-wait"
                  : "bg-rose-500 hover:bg-rose-400 text-black shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                {isMergeTool ? "Merge PDFs" : "Process PDF"}
              </>
            )}
          </button>
        </div>

        {/* RIGHT: Settings & Output */}
        <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-5 md:p-6 h-full min-h-[320px] flex flex-col order-last lg:order-none">
          <h3 className="text-gray-400 font-medium mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </h3>

          {/* Settings Component Render */}
          <div className="mb-4">
            {hasContent ? renderToolControls() : (
              <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-gray-600 text-sm">
                Upload a file to configure settings.
              </div>
            )}
          </div>

          {/* Console / Result Area */}
          <div className="flex-1 bg-black/40 rounded-xl p-3 md:p-4 font-mono text-xs md:text-sm overflow-y-auto space-y-2 border border-white/5 max-h-[300px] lg:max-h-none">
             {!hasContent && <span className="text-gray-600">Waiting for input...</span>}
             
             {hasContent && !isProcessing && !result && (
               <span className="text-rose-400">File loaded. Configure & Start.</span>
             )}

             {isProcessing && (
               <div className="space-y-2">
                 <span className="text-yellow-400 block">{'>'} Reading file structure...</span>
                 <span className="text-yellow-400 block">{'>'} Applying transformations...</span>
               </div>
             )}

             {result && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                 <span className="text-green-400 block break-words">{'>'} {result.message}</span>
                 <span className="text-gray-500 block text-[10px]">{result.fileName} generated.</span>
                 
                 <a 
                  href={result.downloadUrl}
                  download={result.fileName}
                  className="mt-4 block w-full py-2 bg-white/10 hover:bg-white/20 text-center rounded-lg text-white transition-colors flex items-center justify-center gap-2 border border-white/10"
                 >
                   <Download className="w-4 h-4" /> Download PDF
                 </a>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}