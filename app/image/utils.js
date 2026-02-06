import { 
  FileImage, Scaling, Minimize2, Crop, RotateCw, 
  Eraser, FileText, Stamp, Fingerprint
} from "lucide-react"

export const getIcon = (featureName) => {
  switch (featureName) {
    case "Format Conversion": return <FileImage className="w-8 h-8" />;
    case "Resize / Scale": return <Scaling className="w-8 h-8" />;
    case "Compression": return <Minimize2 className="w-8 h-8" />;
    case "Crop": return <Crop className="w-8 h-8" />;
    case "Rotate / Flip": return <RotateCw className="w-8 h-8" />;
    case "Background Removal": return <Eraser className="w-8 h-8" />;
    case "Image to PDF": return <FileText className="w-8 h-8" />;
    case "Watermark": return <Stamp className="w-8 h-8" />;
    case "Metadata Cleaner": return <Fingerprint className="w-8 h-8" />;
    default: return <FileImage className="w-8 h-8" />;
  }
}

export const getDescription = (featureName) => {
  const map = {
    "Format Conversion": "Convert between JPG, PNG, WEBP, and AVIF.",
    "Resize / Scale": "Upscale or downscale images pixel-perfectly.",
    "Compression": "Compress images up to 80% without quality loss.",
    "Crop": "Crop specific areas for social media or profile pics.",
    "Rotate / Flip": "Fix orientation or mirror images instantly.",
    "Background Removal": "Remove backgrounds automatically using AI.",
    "Image to PDF": "Combine multiple images into a single PDF document.",
    "Watermark": "Add text or logo watermarks to protect your work.",
    "Metadata Cleaner": "Remove GPS and camera data for privacy."
  }
  return map[featureName] || "Process your images instantly."
}

// Slug Helper (Same as Video)
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const getToolFromSlug = (slug, allTools) => {
  return allTools.find(tool => slugify(tool) === slug);
}

// Matching Algo (Same as Video)
export const findClosestMatch = (input, validOptions) => {
  if (!input) return null;
  const lowerInput = input.toLowerCase().trim();
  const substringMatch = validOptions.find(opt => opt.toLowerCase().includes(lowerInput));
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
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
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