"use client"

import React, { use } from "react"
import { navItems } from "@/data/navItems"
import ActivePdfTool from "../components/ActivePdfTool"
import ToolNotFound from "../components/ToolNotFound"
import { getToolFromSlug, slugify } from "../utils"

export default function PdfToolPage({ params }) {
  const { tool } = use(params);
  
  const pdfToolsList = navItems.find(item => item.name === "PDF")?.features || [];
  
  // Find exact tool name from slug (e.g. "merge-pdf" -> "Merge PDF")
  const exactToolName = getToolFromSlug(tool, pdfToolsList);

  if (exactToolName) {
    return <ActivePdfTool toolName={exactToolName} />
  } else {
    return (
      <ToolNotFound 
        invalidToolName={tool.replace(/-/g, " ")} 
        recommendedTool={pdfToolsList[0]} 
      />
    );
  }
}