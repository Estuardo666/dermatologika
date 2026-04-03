import "server-only";

import { prisma } from "@/server/db/prisma";

export async function findHomePageContentRecord() {
  return prisma.homePageContent.findUnique({
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
}

export async function listMediaAssetRecords() {
  return prisma.mediaAsset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function listCategoryRecords() {
  return prisma.category.findMany({
    include: {
      mediaAsset: {
        select: {
          publicUrl: true,
        },
      },
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function listProductRecords() {
  return prisma.product.findMany({
    include: {
      mediaAsset: {
        select: {
          publicUrl: true,
        },
      },
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        name: "asc",
      },
    ],
  });
}
