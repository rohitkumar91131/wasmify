"use client"

export default function ToolsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      
      {/* --- Header Skeleton --- */}
      <div className="mb-16 text-center space-y-4 flex flex-col items-center">
        {/* Title Bar */}
        <div className="h-12 w-64 md:w-96 bg-white/10 rounded-xl animate-pulse" />
        {/* Subtitle Bar (2 lines) */}
        <div className="h-5 w-full max-w-lg bg-white/5 rounded-lg animate-pulse" />
        <div className="h-5 w-2/3 max-w-md bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* --- Grid Skeleton --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 6 Dummy Cards generate कर रहे हैं ताकी ग्रिड भरा दिखे */}
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="p-6 rounded-2xl bg-white/5 border border-white/10 h-[220px] flex flex-col animate-pulse"
          >
            {/* Icon & Arrow Row */}
            <div className="flex justify-between items-start mb-6">
              {/* Icon Box */}
              <div className="w-14 h-14 bg-white/10 rounded-lg" />
              {/* Arrow Placeholder */}
              <div className="w-6 h-6 bg-white/5 rounded-full" />
            </div>

            {/* Title Line */}
            <div className="h-7 w-3/4 bg-white/10 rounded-lg mb-3" />

            {/* Description Lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}