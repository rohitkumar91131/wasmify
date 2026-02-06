/**
 * Helper to determine the correct MIME type for the output Blob
 */
const getMimeType = (extension) => {
  const ext = extension ? extension.toLowerCase() : 'mp3';
  switch (ext) {
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'aac': return 'audio/aac';
    case 'm4a': return 'audio/mp4';
    case 'ogg': return 'audio/ogg';
    default: return 'audio/mpeg';
  }
};

/**
 * Generates FFmpeg commands based on the selected tool and settings.
 * @param {string} toolName - The name of the tool
 * @param {string|string[]} inputFileNameOrArray - Single filename or Array of filenames
 * @param {object} settings - The settings object from the UI
 */
export const generateAudioCommand = (toolName, inputFileNameOrArray, settings = {}) => {
  const timestamp = Date.now();
  const outputBase = `audio_${timestamp}`;
  
  // Normalize tool name to handle variations
  const name = toolName.toLowerCase();

  // Handle Input: Can be string (single) or array (multi)
  const inputs = Array.isArray(inputFileNameOrArray) ? inputFileNameOrArray : [inputFileNameOrArray];
  const inputFileName = inputs[0]; // Default input for single-file tools

  // ==========================================
  // 1. FORMAT CONVERSION
  // ==========================================
  if (name.includes("format") || name.includes("convert")) {
    const format = settings.format || "mp3";
    const outputName = `${outputBase}.${format}`;
    return {
      args: ["-i", inputFileName, outputName],
      outputFile: outputName,
      mimeType: getMimeType(format)
    };
  }

  // ==========================================
  // 2. AUDIO COMPRESSION
  // ==========================================
  if (name.includes("compress")) {
    const bitrate = settings.bitrate || "128k";
    const outputName = `${outputBase}_compressed.mp3`;
    return {
      args: ["-i", inputFileName, "-b:a", bitrate, outputName],
      outputFile: outputName,
      mimeType: "audio/mpeg"
    };
  }

  // ==========================================
  // 3. TRIM AUDIO
  // ==========================================
  if (name.includes("trim") || name.includes("cut")) {
    const start = settings.startTime || "00:00:00";
    const end = settings.endTime || "00:00:10";
    const outputName = `${outputBase}_trimmed.mp3`;
    return {
      args: ["-i", inputFileName, "-ss", start, "-to", end, "-c", "copy", outputName],
      outputFile: outputName,
      mimeType: "audio/mpeg"
    };
  }

  // ==========================================
  // 4. VOLUME BOOST
  // ==========================================
  if (name.includes("volume") || name.includes("boost")) {
    const vol = settings.volume || 1.0; 
    const outputName = `${outputBase}_boosted.mp3`;
    return {
      args: ["-i", inputFileName, "-filter:a", `volume=${vol}`, outputName],
      outputFile: outputName,
      mimeType: "audio/mpeg"
    };
  }

  // ==========================================
  // 5. SPEED CONTROL
  // ==========================================
  if (name.includes("speed")) {
    const speed = settings.speed || 1.0;
    const outputName = `${outputBase}_speed.mp3`;
    // 'atempo' allows changing speed without changing pitch
    return {
      args: ["-i", inputFileName, "-filter:a", `atempo=${speed}`, outputName],
      outputFile: outputName,
      mimeType: "audio/mpeg"
    };
  }

  // ==========================================
  // 6. REVERSE AUDIO
  // ==========================================
  if (name.includes("reverse")) {
    const outputName = `${outputBase}_reverse.mp3`;
    return {
      args: ["-i", inputFileName, "-filter:a", "areverse", outputName],
      outputFile: outputName,
      mimeType: "audio/mpeg"
    };
  }

  // ==========================================
  // 7. NOISE REDUCTION
  // ==========================================
  if (name.includes("noise") || name.includes("denoise")) {
    const level = settings.noiseLevel || 12; 
    const outputName = `${outputBase}_denoised.mp3`;
    // 'afftdn' is FFmpeg's FFT-based noise reduction filter
    return {
      args: ["-i", inputFileName, "-filter:a", `afftdn=nr=${level}`, outputName],
      outputFile: outputName,
      mimeType: "audio/mpeg"
    };
  }

  // ==========================================
  // 8. MERGE AUDIO (Multiple Files)
  // ==========================================
  if (name.includes("merge") || name.includes("join")) {
    const format = settings.format || "mp3";
    const outputName = `${outputBase}_merged.${format}`;

    // Build the complex filter command
    // Example: -i input0.mp3 -i input1.wav -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[out]" -map "[out]"
    const inputArgs = [];
    let filterStreams = "";

    inputs.forEach((file, index) => {
      inputArgs.push("-i", file);
      filterStreams += `[${index}:a]`; 
    });

    const filterComplex = `${filterStreams}concat=n=${inputs.length}:v=0:a=1[out]`;

    return {
      args: [...inputArgs, "-filter_complex", filterComplex, "-map", "[out]", outputName],
      outputFile: outputName,
      mimeType: getMimeType(format)
    };
  }

  // ==========================================
  // 9. EXTRACT AUDIO FROM VIDEO
  // ==========================================
  if (name.includes("extract")) {
    const format = settings.format || "mp3";
    const outputName = `${outputBase}.${format}`;
    // -vn means "No Video"
    return {
      args: ["-i", inputFileName, "-vn", outputName],
      outputFile: outputName,
      mimeType: getMimeType(format)
    };
  }

  // Fallback
  throw new Error(`Logic for "${toolName}" not implemented yet.`);
};