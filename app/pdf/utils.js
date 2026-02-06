import { 
  FileStack, Scissors, Lock, Unlock, RotateCw, Stamp, FileText
} from "lucide-react"

export const getIcon = (featureName) => {
  switch (featureName) {
    case "Merge PDF": return <FileStack className="w-8 h-8" />;
    case "Split PDF": return <Scissors className="w-8 h-8" />;
    case "Protect PDF": return <Lock className="w-8 h-8" />;
    case "Unlock PDF": return <Unlock className="w-8 h-8" />;
    case "Rotate PDF": return <RotateCw className="w-8 h-8" />;
    case "Watermark PDF": return <Stamp className="w-8 h-8" />;
    default: return <FileText className="w-8 h-8" />;
  }
}

export const getDescription = (featureName) => {
  const map = {
    "Merge PDF": "Combine multiple PDF files into one document.",
    "Split PDF": "Extract pages or split a document into parts.",
    "Protect PDF": "Encrypt your PDF with a password.",
    "Unlock PDF": "Remove password security from a PDF.",
    "Rotate PDF": "Rotate pages 90, 180 or 270 degrees.",
    "Watermark PDF": "Add text or image stamps to your pages."
  }
  return map[featureName] || "Process your PDF documents securey."
}

export const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '').replace(/-+$/, '');
}

export const getToolFromSlug = (slug, allTools) => {
  return allTools.find(tool => slugify(tool) === slug);
}