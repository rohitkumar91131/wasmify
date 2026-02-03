let ffmpegPromise = null;

export async function getFFmpeg() {
  if (ffmpegPromise) return ffmpegPromise;

  // We store the promise itself so multiple calls wait for the same action
  ffmpegPromise = (async () => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js",
      wasmURL: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm"
    });
    return ffmpeg;
  })();

  return ffmpegPromise;
}