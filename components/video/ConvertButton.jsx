import { useVideo } from "@/context/VideoContext"

export default function ConvertButton() {
  const { file, loading, convert, loaded, format } = useVideo()

  const isEngineReady = loaded
  const isFileSelected = !!file
  const isConverting = loading

  let label = "Convert Video"
  let disabled = true

  if (!isEngineReady) {
    label = "Loading Engine..."
    disabled = true
  } else if (isConverting) {
    label = "Converting..."
    disabled = true
  } else if (!isFileSelected) {
    label = "Select a Video"
    disabled = true
  } else {
    label = `Convert to ${format.toUpperCase()}`
    disabled = false
  }

  return (
    <button
      disabled={disabled}
      onClick={convert}
      className={`w-full px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2
        ${!disabled
          ? "bg-green-500 text-black hover:bg-green-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
          : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
        }`}
    >
      {isConverting && (
        <svg 
          className="animate-spin h-5 w-5 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {label}
    </button>
  )
}