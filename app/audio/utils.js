import { 
  Music, Mic2, Scissors, Zap, FastForward, Rewind, FileAudio, Volume2
} from "lucide-react"

export const getIcon = (featureName) => {
  switch (featureName) {
    case "Format Converter": return <FileAudio className="w-8 h-8" />;
    case "Compression": return <Mic2 className="w-8 h-8" />;
    case "Trim Audio": return <Scissors className="w-8 h-8" />;
    case "Volume Boost": return <Volume2 className="w-8 h-8" />;
    case "Speed Control": return <FastForward className="w-8 h-8" />;
    case "Reverse Audio": return <Rewind className="w-8 h-8" />;
    default: return <Music className="w-8 h-8" />;
  }
}

export const getDescription = (featureName) => {
  const map = {
    "Format Converter": "Convert between MP3, WAV, AAC, M4A, and OGG.",
    "Compression": "Reduce file size by adjusting bitrate.",
    "Trim Audio": "Cut specific parts of an audio file.",
    "Volume Boost": "Increase audio volume up to 200%.",
    "Speed Control": "Change playback speed (0.5x to 2x).",
    "Reverse Audio": "Play audio backwards for cool effects."
  }
  return map[featureName] || "Process your audio instantly."
}

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

export const findClosestMatch = (input, validOptions) => {
  if (!input) return null;
  const lowerInput = input.toLowerCase().trim();
  const substringMatch = validOptions.find(opt => opt.toLowerCase().includes(lowerInput));
  if (substringMatch) return substringMatch;
  return validOptions[0]; // Fallback simple
};