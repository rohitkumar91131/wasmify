import { useVideo } from "@/context/VideoContext"

export default function FormatSelector() {
  const { format, setFormat } = useVideo()

  return (
    <div className="border border-white/10 rounded-xl p-6 space-y-2">
      <label className="text-sm text-gray-400">Output Format</label>

      <select
        value={format}
        onChange={e => setFormat(e.target.value)}
        className="bg-black border border-white/20 rounded-lg px-4 py-2 w-full"
      >
        <option value="mp4">MP4</option>
        <option value="webm">WebM</option>
        <option value="mkv">MKV</option>
        <option value="avi">AVI</option>
      </select>
    </div>
  )
}