import { BrandAdminList } from "@/features/admin-catalog/components/brand-admin-list";
import { getCatalogAdminData } from "@/services/admin-catalog/get-catalog-admin-data";

export const metadata = {
  title: "Admin Brands — Dermatologika",
  description: "Gestionar marcas del catálogo local.",
};

export default async function AdminCatalogBrandsPage() {
  const data = await getCatalogAdminData();

  return <BrandAdminList brands={data.brands} />;
}
