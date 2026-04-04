import { NextResponse } from "next/server";

import { parsePublicCatalogSearchParams, resolveBrandIdsFromValues } from "@/services/catalog/get-public-catalog-data";
import { listPublicBrandOptions } from "@/server/catalog/public-catalog.repository";
import { countPublicProductRecords } from "@/server/catalog/public-catalog.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parsePublicCatalogSearchParams({
    q: searchParams.get("q") ?? undefined,
    categoria: searchParams.get("categoria") ?? undefined,
    precioMin: searchParams.get("precioMin") ?? undefined,
    precioMax: searchParams.get("precioMax") ?? undefined,
    enStock: searchParams.get("enStock") ?? undefined,
    enOferta: searchParams.get("enOferta") ?? undefined,
    marcas: searchParams.get("marcas") ?? undefined,
  });

  const rawBrandOptions = await listPublicBrandOptions(query.categorySlug || undefined);
  const brandOptions = rawBrandOptions.map((brand) => ({
    id: brand.id,
    slug: brand.name
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, ""),
    name: brand.name,
    logoUrl: brand.mediaAsset?.publicUrl ?? null,
  }));
  const resolvedBrandIds = resolveBrandIdsFromValues(query.brandValues, brandOptions);

  const totalItems = await countPublicProductRecords({
    query: query.query,
    categorySlug: query.categorySlug,
    priceMin: query.priceMin,
    priceMax: query.priceMax,
    inStock: query.inStock,
    onSale: query.onSale,
    brandIds: resolvedBrandIds,
  });

  return NextResponse.json({ totalItems });
}
