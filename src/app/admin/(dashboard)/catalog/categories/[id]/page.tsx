import { notFound } from "next/navigation";

import { CategoryAdminForm } from "@/features/admin-catalog/components/category-admin-form";
import { getCatalogAdminData } from "@/services/admin-catalog/get-catalog-admin-data";

interface AdminCatalogCategoryEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCatalogCategoryEditPage({ params }: AdminCatalogCategoryEditPageProps) {
  const { id } = await params;
  const data = await getCatalogAdminData();
  const category = data.categories.find((item) => item.id === id) ?? null;

  if (!category) {
    notFound();
  }

  return <CategoryAdminForm initialData={data} mode="edit" category={category} />;
}