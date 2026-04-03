import { ProductAdminForm } from "@/features/admin-catalog/components/product-admin-form";
import { getCatalogAdminData } from "@/services/admin-catalog/get-catalog-admin-data";

export const metadata = {
  title: "Admin New Product — Dermatologika",
  description: "Crear producto del catálogo local.",
};

export default async function AdminCatalogProductNewPage() {
  const data = await getCatalogAdminData();

  return <ProductAdminForm initialData={data} mode="create" />;
}