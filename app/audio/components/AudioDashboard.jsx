"use client"

import Link from "next/link"
import { navItems } from "@/data/navItems"
import { ArrowRight } from "lucide-react"
import { getIcon, getDescription, slugify } from "../utils"

export default function AudioDashboard() {
  const audioCategory = navItems.find(item => item.name === "Audio");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          Audio Tools
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Advanced audio processing powered by FFmpeg.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audioCategory?.features.map((feature, index) => (
          <Link
            key={index}
            href={`/audio/${slugify(feature)}`}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden"
          >
            {/* Violet Glow */}
            <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-black/50 rounded-lg border border-white/10 text-violet-400 group-hover:text-white group-hover:bg-violet-500 group-hover:border-violet-400 transition-colors duration-300">
                  {getIcon(feature)}
                </div>
                <div className="text-gray-500 group-hover:text-white -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-violet-400 transition-colors mb-2">
                {feature}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {getDescription(feature)}
              </p>

              <div className="mt-auto w-full h-[1px] bg-white/10 overflow-hidden rounded-full">
                 <div className="w-full h-full bg-violet-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}