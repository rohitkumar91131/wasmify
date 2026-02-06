"use client"

import Link from "next/link"
import { SearchX, ArrowRight, Home } from "lucide-react"
import { slugify } from "../utils"

export default function ToolNotFound({ invalidToolName, recommendedTool }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <div className="inline-flex p-6 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
        <SearchX className="w-12 h-12 text-red-500" />
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">
        Tool Not Found
      </h2>
      <p className="text-gray-400 text-lg mb-8">
        We couldn't find an image tool named <span className="text-red-400 font-mono bg-red-500/10 px-2 py-0.5 rounded">"{invalidToolName}"</span>.
      </p>

      {recommendedTool && (
        <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Did you mean?</p>
          
          <Link 
            href={`/image/${slugify(recommendedTool)}`}
            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all duration-300"
          >
            <span className="font-semibold text-white group-hover:text-blue-400">
              {recommendedTool}
            </span>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      )}

      <Link 
        href="/image"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
        Return to Image Tools
      </Link>
    </div>
  )
}