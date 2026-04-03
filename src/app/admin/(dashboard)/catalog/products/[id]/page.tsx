import { notFound } from "next/navigation";

import { ProductAdminForm } from "@/features/admin-catalog/components/product-admin-form";
import { getCatalogAdminData } from "@/services/admin-catalog/get-catalog-admin-data";

interface AdminCatalogProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCatalogProductEditPage({ params }: AdminCatalogProductEditPageProps) {
  const { id } = await params;
  const data = await getCatalogAdminData();
  const product = data.products.find((item) => item.id === id) ?? null;

  if (!product) {
    notFound();
  }

  return <ProductAdminForm initialData={data} mode="edit" product={product} />;
}