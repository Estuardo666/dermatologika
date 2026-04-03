import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";
import type { PublicProductCatalogSort } from "@/types/public-catalog";

export const PUBLIC_CATALOG_PAGE_SIZE = 12;

interface PublicProductListQuery {
  query: string;
  categorySlug: string;
  page: number;
  pageSize: number;
  sortBy: PublicProductCatalogSort;
}

function buildPublicProductVisibilityFilter(): Prisma.ProductWhereInput {
  return {
    isActive: true,
    OR: [
      { categoryId: null },
      {
        category: {
          isActive: true,
        },
      },
    ],
  };
}

function buildPublicCategoryVisibilityFilter(): Prisma.CategoryWhereInput {
  return {
    isActive: true,
  };
}

function buildPublicProductSearchFilter(query: string): Prisma.ProductWhereInput | undefined {
  if (!query) {
    return undefined;
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { badge: { contains: query, mode: "insensitive" } },
      {
        category: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
    ],
  };
}

function buildPublicProductCategoryFilter(categorySlug: string): Prisma.ProductWhereInput | undefined {
  if (!categorySlug) {
    return undefined;
  }

  return {
    category: {
      slug: categorySlug,
      isActive: true,
    },
  };
}

function combineWhere(
  ...conditions: Array<Prisma.ProductWhereInput | Prisma.CategoryWhereInput | undefined>
) {
  const activeConditions = conditions.filter(Boolean);
  if (activeConditions.length === 0) {
    return undefined;
  }

  if (activeConditions.length === 1) {
    return activeConditions[0];
  }

  return {
    AND: activeConditions,
  };
}

function buildPublicProductOrderBy(
  sortBy: PublicProductCatalogSort,
): Prisma.ProductOrderByWithRelationInput[] {
  if (sortBy === "name") {
    return [{ name: "asc" }, { updatedAt: "desc" }];
  }

  return [{ updatedAt: "desc" }, { name: "asc" }];
}

const publicCategoryInclude = {
  mediaAsset: {
    select: {
      id: true,
      kind: true,
      publicUrl: true,
      storageKey: true,
      altText: true,
      mimeType: true,
      posterUrl: true,
      width: true,
      height: true,
      durationSeconds: true,
    },
  },
  _count: {
    select: {
      products: {
        where: {
          isActive: true,
        },
      },
    },
  },
} satisfies Prisma.CategoryInclude;

const publicProductInclude = {
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
      href: true,
    },
  },
  mediaAsset: {
    select: {
      id: true,
      kind: true,
      publicUrl: true,
      storageKey: true,
      altText: true,
      mimeType: true,
      posterUrl: true,
      width: true,
      height: true,
      durationSeconds: true,
    },
  },
} satisfies Prisma.ProductInclude;

export async function listPublicCategoryRecords() {
  return prisma.category.findMany({
    where: buildPublicCategoryVisibilityFilter(),
    include: publicCategoryInclude,
    orderBy: [{ name: "asc" }],
  });
}

export async function listPublicCategoryOptions() {
  return prisma.category.findMany({
    where: buildPublicCategoryVisibilityFilter(),
    select: {
      id: true,
      slug: true,
      name: true,
      href: true,
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function findPublicCategoryRecordBySlug(slug: string) {
  return prisma.category.findFirst({
    where: {
      ...buildPublicCategoryVisibilityFilter(),
      slug,
    },
    include: publicCategoryInclude,
  });
}

export async function listPublicProductRecords(query: PublicProductListQuery) {
  const where = combineWhere(
    buildPublicProductVisibilityFilter(),
    buildPublicProductSearchFilter(query.query),
    buildPublicProductCategoryFilter(query.categorySlug),
  ) as Prisma.ProductWhereInput | undefined;

  const skip = (query.page - 1) * query.pageSize;
  const filteredCountQuery = where ? prisma.product.count({ where }) : prisma.product.count();

  const [filteredCount, items] = await prisma.$transaction([
    filteredCountQuery,
    prisma.product.findMany({
      ...(where ? { where } : {}),
      include: publicProductInclude,
      orderBy: buildPublicProductOrderBy(query.sortBy),
      skip,
      take: query.pageSize,
    }),
  ]);

  return {
    filteredCount,
    items,
  };
}

export async function findPublicProductRecordBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      ...buildPublicProductVisibilityFilter(),
      slug,
    },
    include: publicProductInclude,
  });
}

export async function listRelatedPublicProductRecords(input: {
  productId: string;
  categoryId: string | null;
}) {
  if (!input.categoryId) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      ...buildPublicProductVisibilityFilter(),
      id: {
        not: input.productId,
      },
      categoryId: input.categoryId,
    },
    include: publicProductInclude,
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    take: 4,
  });
}