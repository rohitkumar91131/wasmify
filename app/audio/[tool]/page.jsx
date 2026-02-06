"use client"

import React, { use } from "react"
import { navItems } from "@/data/navItems"
import ActiveAudioTool from "../components/ActiveAudioTool"
import ToolNotFound from "../components/ToolNotFound"
import { getToolFromSlug, findClosestMatch } from "../utils"

export default function AudioToolPage({ params }) {
  const { tool } = use(params);
  const slug = tool;

  const audioToolsList = navItems.find(item => item.name === "Audio")?.features || [];
  const exactToolName = getToolFromSlug(slug, audioToolsList);

  if (exactToolName) {
    return <ActiveAudioTool toolName={exactToolName} />
  } else {
    const readableSlug = slug.replace(/-/g, " ");
    const closestTool = findClosestMatch(readableSlug, audioToolsList);

    return (
      <ToolNotFound 
        invalidToolName={readableSlug} 
        recommendedTool={closestTool} 
      />
    );
  }
}