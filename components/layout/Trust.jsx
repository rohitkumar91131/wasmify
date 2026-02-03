export default function Trust() {
  return (
    <section className="border-y border-white/10 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center text-sm text-gray-400">
        <div>
          <span className="text-green-400 font-semibold">100% Local</span>
          <p>Your files never leave your device</p>
        </div>
        <div>
          <span className="text-green-400 font-semibold">Offline Ready</span>
          <p>Works without internet after load</p>
        </div>
        <div>
          <span className="text-green-400 font-semibold">FFmpeg Powered</span>
          <p>Professional-grade media engine</p>
        </div>
      </div>
    </section>
  )
}
