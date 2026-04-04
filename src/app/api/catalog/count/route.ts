import { NextResponse } from "next/server";

import { parsePublicCatalogSearchParams } from "@/services/catalog/get-public-catalog-data";
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

  const totalItems = await countPublicProductRecords({
    query: query.query,
    categorySlug: query.categorySlug,
    priceMin: query.priceMin,
    priceMax: query.priceMax,
    inStock: query.inStock,
    onSale: query.onSale,
    brandIds: query.brandIds,
  });

  return NextResponse.json({ totalItems });
}
