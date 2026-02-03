export default function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8 text-center text-gray-400">
        <div>
          <h3 className="text-green-400 font-semibold mb-2">1. Select File</h3>
          <p>Choose media from your device</p>
        </div>
        <div>
          <h3 className="text-green-400 font-semibold mb-2">2. Process</h3>
          <p>FFmpeg runs locally in your browser</p>
        </div>
        <div>
          <h3 className="text-green-400 font-semibold mb-2">3. Download</h3>
          <p>Get your processed file instantly</p>
        </div>
      </div>
    </section>
  )
}
