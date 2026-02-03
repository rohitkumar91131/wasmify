"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { name: "Videos", path: "/video" },
  { name: "Images", path: "/image" },
  { name: "Audio", path: "/audio" },
  { name: "Subtitles", path: "/subtitles" },
  { name: "Metadata", path: "/metadata" }
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          Wasmify
        </Link>

        <nav className="hidden md:flex gap-6">
          {links.map(l => (
            <Link
              key={l.path}
              href={l.path}
              className={
                pathname === l.path
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="flex flex-col px-4 py-4 gap-4">
            {links.map(l => (
              <Link
                key={l.path}
                href={l.path}
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
