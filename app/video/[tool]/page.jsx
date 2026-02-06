"use client"

import React, { use } from "react" // 1. 'use' import करें
import { navItems } from "@/data/navItems"
import ActiveToolInterface from "../components/ActiveToolInterface"
import ToolNotFound from "../components/ToolNotFound"
import { getToolFromSlug, findClosestMatch } from "../utils"

export default function ToolPage({ params }) {
  // 2. Params Promise को unwrap करें
  // Next.js 15+ में params एक Promise होता है
  const { tool } = use(params);
  const slug = tool;

  // 3. Data list निकालें
  const videoToolsList = navItems.find(item => item.name === "Videos")?.features || [];

  // 4. Slug से असली नाम ढूँढें
  const exactToolName = getToolFromSlug(slug, videoToolsList);

  if (exactToolName) {
    // A. अगर सही टूल मिल गया
    return <ActiveToolInterface toolName={exactToolName} />
  } else {
    // B. अगर टूल नहीं मिला (Recommendation Logic)
    const readableSlug = slug.replace(/-/g, " ");
    const closestTool = findClosestMatch(readableSlug, videoToolsList);

    return (
      <ToolNotFound 
        invalidToolName={readableSlug} 
        recommendedTool={closestTool} 
      />
    );
  }
}