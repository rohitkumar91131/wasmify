export default function Tools() {
  const tools = [
    { title: "Convert Media", desc: "Video, audio & image formats" },
    { title: "Image Tools", desc: "PNG ↔ JPG ↔ WebP" },
    { title: "Audio Tools", desc: "Extract, normalize, compress" },
    { title: "Subtitles", desc: "Burn, extract, convert" },
    { title: "Metadata", desc: "Edit or strip metadata" }
  ]

  return (
    <section id="tools" className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">
        What You Can Do
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tools.map(t => (
          <div
            key={t.title}
            className="border border-white/10 rounded-xl p-6 hover:border-green-400/40 transition"
          >
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="mt-2 text-gray-400 text-sm">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
