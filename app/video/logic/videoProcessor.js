const getMimeType = (extension) => {
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'avi': return 'video/x-msvideo';
    case 'mkv': return 'video/x-matroska';
    case 'webm': return 'video/webm';
    case 'gif': return 'image/gif';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'aac': return 'audio/aac';
    default: return 'video/mp4';
  }
};

export const generateCommand = (toolName, inputFileName, settings = {}) => {
  const timestamp = Date.now();
  
  // 1. FORMAT CONVERSION
  if (toolName === "Format Conversion") {
    const targetFormat = settings.format || "mp4";
    const outputName = `output_${timestamp}.${targetFormat}`;
    return {
      args: ["-i", inputFileName, outputName],
      outputFile: outputName,
      mimeType: getMimeType(targetFormat)
    };
  }

  // 2. COMPRESSION
  if (toolName === "Compression (Quality)") {
    const outputName = `compressed_${timestamp}.mp4`;
    const crf = settings.compressionCrf || "23";
    return {
      args: ["-i", inputFileName, "-vcodec", "libx264", "-crf", String(crf), outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  // 3. MUTE AUDIO
  if (toolName === "Mute Audio") {
    const outputName = `muted_${timestamp}.mp4`;
    return {
      args: ["-i", inputFileName, "-c", "copy", "-an", outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  // 4. EXTRACT AUDIO
  if (toolName === "Extract Audio") {
    const audioFormat = settings.audioFormat || "mp3"; 
    const outputName = `audio_${timestamp}.${audioFormat}`;
    return {
      args: ["-i", inputFileName, "-vn", "-acodec", audioFormat === 'mp3' ? 'libmp3lame' : 'copy', outputName],
      outputFile: outputName,
      mimeType: getMimeType(audioFormat)
    };
  }

  // 5. RESIZE
  if (toolName === "Resize / Resolution") {
    const outputName = `resized_${timestamp}.mp4`;
    const mode = settings.resizeMode || "scale";
    let scaleFilter;
    if (mode === "fixed") {
      const width = settings.targetWidth || 1280;
      scaleFilter = `scale=${width}:-2`;
    } else {
      const scale = settings.resizeScale || 0.5;
      scaleFilter = `scale=iw*${scale}:-2`;
    }
    return {
      args: ["-i", inputFileName, "-vf", scaleFilter, outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  // 6. GIF MAKER
  if (toolName === "GIF Maker") {
    const outputName = `animation_${timestamp}.gif`;
    const fps = settings.gifFps || 10;
    const width = settings.gifWidth || 320;
    const filter = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
    
    return {
      args: ["-i", inputFileName, "-vf", filter, outputName],
      outputFile: outputName,
      mimeType: "image/gif"
    };
  }

  // 7. TRIM VIDEO
  if (toolName === "Trim Video") {
    const outputName = `trimmed_${timestamp}.mp4`;
    const start = settings.startTime || "00:00:00";
    const end = settings.endTime || "00:00:05";
    return {
      args: ["-i", inputFileName, "-ss", start, "-to", end, "-c", "copy", outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  // 8. SPEED CONTROL
  if (toolName === "Speed Control") {
    const outputName = `speed_${timestamp}.mp4`;
    const speed = parseFloat(settings.speed) || 1.0;
    // Video PTS inverted, Audio atempo
    const videoFilter = `setpts=${1/speed}*PTS`; 
    const audioFilter = `atempo=${speed}`;
    return {
      args: ["-i", inputFileName, "-filter:v", videoFilter, "-filter:a", audioFilter, outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  // 9. FRAME RATE
  if (toolName === "Frame Rate (FPS)") {
    const outputName = `fps_${timestamp}.mp4`;
    const fps = settings.fps || 30;
    return {
      args: ["-i", inputFileName, "-r", String(fps), outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  // 10. ASPECT RATIO / CROP
  if (toolName === "Aspect Ratio / Crop") {
    const outputName = `cropped_${timestamp}.mp4`;
    const ratio = settings.aspectRatio || "16:9";
    
    // Simple center crop logic approximation
    let cropFilter = "";
    if (ratio === "1:1") cropFilter = "crop='min(iw,ih):min(iw,ih)'";
    else if (ratio === "9:16") cropFilter = "crop='ih*(9/16):ih'"; // Vertical
    else if (ratio === "4:5") cropFilter = "crop='ih*(4/5):ih'";
    else cropFilter = "crop='iw:iw*(9/16)'"; // 16:9 (Horizontal crop)

    return {
      args: ["-i", inputFileName, "-vf", cropFilter, outputName],
      outputFile: outputName,
      mimeType: "video/mp4"
    };
  }

  throw new Error(`Logic for ${toolName} not implemented yet.`);
};