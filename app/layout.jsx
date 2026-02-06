import "./globals.css"
import Navbar from "@/components/layout/Navbar"

export const metadata = {
  title: {
    default: "Wasmify | All-in-One Browser-Based File Tools",
    template: "%s | Wasmify"
  },
  description: "Free, private, and fast browser-based tools to edit Video, Audio, PDF, and Images. No file uploads to server.",
  keywords: ["video editor", "audio converter", "pdf tools", "image compressor", "browser tools", "wasmify"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen text-white bg-black overflow-x-hidden">
        
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full 
            bg-green-500/20 blur-[160px]" />

          <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full 
            bg-cyan-400/20 blur-[160px]" />
        </div>

        <Navbar />

        <main className="relative max-w-7xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
