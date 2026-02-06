"use client"

import Link from "next/link"
import { SearchX, ArrowRight, Music } from "lucide-react"
import { slugify } from "../utils"

export default function ToolNotFound({ invalidToolName, recommendedTool }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <div className="inline-flex p-6 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
        <SearchX className="w-12 h-12 text-red-500" />
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">
        Audio Tool Not Found
      </h2>
      <p className="text-gray-400 text-lg mb-8">
        We couldn't find <span className="text-red-400 font-mono bg-red-500/10 px-2 py-0.5 rounded">"{invalidToolName}"</span>.
      </p>

      {recommendedTool && (
        <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Did you mean?</p>
          
          <Link 
            href={`/audio/${slugify(recommendedTool)}`}
            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-violet-500/10 border border-white/10 hover:border-violet-500/50 rounded-xl transition-all duration-300"
          >
            <span className="font-semibold text-white group-hover:text-violet-400">
              {recommendedTool}
            </span>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      )}

      <Link 
        href="/audio"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Music className="w-4 h-4" />
        Return to Audio Tools
      </Link>
    </div>
  )
}