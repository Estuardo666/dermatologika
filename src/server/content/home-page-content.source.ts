import "server-only";

import { mapStoredHomePageContent } from "@/server/content/home-page-content.persistence";
import { prisma } from "@/server/db/prisma";
import type { HomePageContent } from "@/types/content";

export async function readStoredHomePageContent(): Promise<HomePageContent | null> {
  const storedContent = await prisma.homePageContent.findUnique({
    where: {
      slug: "home",
    },
    include: {
      heroMedia: true,
      heroSecondaryMedia: true,
      heroTertiaryMedia: true,
      featuredCategorySelections: {
        orderBy: {
          position: "asc",
        },
        include: {
          category: {
            include: {
              mediaAsset: true,
            },
          },
        },
      },
      featuredProductSelections: {
        orderBy: {
          position: "asc",
        },
        include: {
          product: {
            include: {
              category: true,
              mediaAsset: true,
            },
          },
        },
      },
    },
  });

  if (!storedContent) {
    return null;
  }

  return mapStoredHomePageContent(storedContent);
}
