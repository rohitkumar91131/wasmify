"use client"
import Link from "next/link"
import { SearchX, FileText } from "lucide-react"

export default function ToolNotFound({ invalidToolName }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <div className="inline-flex p-6 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
        <SearchX className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Tool Not Found</h2>
      <p className="text-gray-400 text-lg mb-8">
        We couldn't find <span className="text-rose-400 font-mono">"{invalidToolName}"</span>.
      </p>
      <Link href="/pdf" className="inline-flex items-center gap-2 text-rose-400 hover:text-white transition-colors">
        <FileText className="w-4 h-4" /> Return to PDF Tools
      </Link>
    </div>
  )
}