import { notFound } from "next/navigation";

import { BrandAdminForm } from "@/features/admin-catalog/components/brand-admin-form";
import { getCatalogAdminData } from "@/services/admin-catalog/get-catalog-admin-data";

interface AdminCatalogBrandEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCatalogBrandEditPage({ params }: AdminCatalogBrandEditPageProps) {
  const { id } = await params;
  const data = await getCatalogAdminData();
  const brand = data.brands.find((item) => item.id === id) ?? null;

  if (!brand) {
    notFound();
  }

  return <BrandAdminForm initialData={data} mode="edit" brand={brand} />;
}
