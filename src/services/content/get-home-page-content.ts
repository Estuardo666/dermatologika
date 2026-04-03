import "server-only";

import { fallbackHomePageContent } from "@/server/content/home-page-content.fallback";
import { readStoredHomePageContent } from "@/server/content/home-page-content.source";
import type { HomePageContentResult } from "@/types/content";

export async function getHomePageContent(): Promise<HomePageContentResult> {
  const storedContent = await readStoredHomePageContent();

  if (storedContent) {
    return {
      content: storedContent,
      source: "database",
    };
  }

  return {
    content: fallbackHomePageContent,
    source: "fallback",
  };
}
