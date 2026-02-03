import { useVideo } from "@/context/VideoContext"

export default function VideoPicker() {
  const { file, setFile } = useVideo()

  function onChange(e) {
    const f = e.target.files[0]
    if (f && f.type.startsWith("video/")) {
      setFile(f)
    }
    // Reset value so same file can be selected again if needed
    e.target.value = null 
  }

  return (
    <div className="border border-white/10 rounded-xl p-6 space-y-4">
      <input
        type="file"
        accept="video/*"
        onChange={onChange}
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:bg-white/10 file:text-white
          hover:file:bg-white/20"
      />

      {file && (
        <p className="text-sm text-gray-400">
          {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      )}
    </div>
  )
}