import { useVideo } from "@/context/VideoContext"

export default function ProgressBar() {
  const { progress, loading } = useVideo()

  if (!loading) return null

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-gray-400 uppercase font-bold">
        <span>Processing</span>
        <span>{progress}%</span>
      </div>
      
      {/* Track */}
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
        {/* Fill */}
        <div 
          className="h-full bg-green-500 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}