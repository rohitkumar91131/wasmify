"use client"

import React, { use } from "react"
import { navItems } from "@/data/navItems"
import ActiveImageTool from "../components/ActiveImageTool"
import ToolNotFound from "../components/ToolNotFound"
import { getToolFromSlug, findClosestMatch } from "../utils"

export default function ImageToolPage({ params }) {
  const { tool } = use(params);
  const slug = tool;

  const imageToolsList = navItems.find(item => item.name === "Images")?.features || [];
  const exactToolName = getToolFromSlug(slug, imageToolsList);

  if (exactToolName) {
    return <ActiveImageTool toolName={exactToolName} />
  } else {
    const readableSlug = slug.replace(/-/g, " ");
    const closestTool = findClosestMatch(readableSlug, imageToolsList);

    return (
      <ToolNotFound 
        invalidToolName={readableSlug} 
        recommendedTool={closestTool} 
      />
    );
  }
}