export default function Hero() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Zero <span className="text-green-400">Upload</span>
      </h1>

      <p className="mt-6 max-w-2xl text-gray-400 text-lg">
        Convert, compress, and process media files directly in your browser.
        <br />
        No uploads. No servers. No tracking.
      </p>

      <div className="mt-10 flex gap-4">
        <a
          href="/video"
          className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
        >
          Start Converting
        </a>

        <a
          href="#tools"
          className="px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition"
        >
          See Tools
        </a>
      </div>
    </section>
  )
}
