import { 
  FileVideo, Scaling, Minimize2, VolumeX, Music, Aperture, 
  Gauge, Crop, Scissors, Image as ImageIcon
} from "lucide-react"

export const getIcon = (featureName) => {
  switch (featureName) {
    case "Format Conversion": return <FileVideo className="w-8 h-8" />;
    case "Resize / Resolution": return <Scaling className="w-8 h-8" />;
    case "Compression (Quality)": return <Minimize2 className="w-8 h-8" />;
    case "Mute Audio": return <VolumeX className="w-8 h-8" />;
    case "Extract Audio": return <Music className="w-8 h-8" />;
    case "Frame Rate (FPS)": return <Aperture className="w-8 h-8" />;
    case "Speed Control": return <Gauge className="w-8 h-8" />;
    case "Aspect Ratio / Crop": return <Crop className="w-8 h-8" />;
    case "Trim Video": return <Scissors className="w-8 h-8" />;
    case "GIF Maker": return <ImageIcon className="w-8 h-8" />;
    default: return <FileVideo className="w-8 h-8" />;
  }
}

export const getDescription = (featureName) => {
  const map = {
    "Format Conversion": "Convert MP4, MKV, AVI, MOV and more.",
    "Resize / Resolution": "Change dimensions to 1080p, 4K, or custom.",
    "Compression (Quality)": "Reduce file size without losing visible quality.",
    "Mute Audio": "Remove sound track completely from video.",
    "Extract Audio": "Save audio track as MP3 or WAV.",
    "Frame Rate (FPS)": "Change 30fps to 60fps or cinematic 24fps.",
    "Speed Control": "Create slow-motion or time-lapse effects.",
    "Aspect Ratio / Crop": "Adjust for Instagram, TikTok, or YouTube.",
    "Trim Video": "Cut out unwanted parts from start or end.",
    "GIF Maker": "Turn video clips into looping GIFs."
  }
  return map[featureName] || "Process your video efficiently."
}

export const findClosestMatch = (input, validOptions) => {
  if (!input) return null;
  
  const lowerInput = input.toLowerCase().trim();

  const substringMatch = validOptions.find(opt => 
    opt.toLowerCase().includes(lowerInput)
  );
  if (substringMatch) return substringMatch;

  const levenshtein = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  let closest = null;
  let minDistance = Infinity;

  validOptions.forEach(option => {
    const cleanOption = option.split('(')[0].split('/')[0].trim().toLowerCase();

    const dist = levenshtein(lowerInput, cleanOption);
    
    if (dist < minDistance && dist < 5) {
      minDistance = dist;
      closest = option;
    }
  });

  return closest;
};

// ... (पुराने getIcon और getDescription वही रहेंगे)

// "Format Conversion" -> "format-conversion"
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Spaces to -
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars (like / or ())
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// "format-conversion" -> Original Tool Name ko dhundo
export const getToolFromSlug = (slug, allTools) => {
  return allTools.find(tool => slugify(tool) === slug);
}