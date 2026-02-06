"use client"

import { PdfProvider } from "@/context/PdfContext"


export default function PdfLayout({ children }) {
  return (
    <PdfProvider>
      <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative">
         {/* Rose/Red Ambient Light for PDF Theme */}
         <div className="fixed top-0 left-0 w-full h-[500px] bg-rose-900/10 blur-[100px] pointer-events-none" />
        {children}
      </div>
    </PdfProvider>
  )
}