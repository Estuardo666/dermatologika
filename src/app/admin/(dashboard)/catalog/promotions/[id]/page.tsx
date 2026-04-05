import { notFound } from "next/navigation";

import { PromotionAdminPanel } from "@/features/admin-promotions/components/promotion-admin-panel";
import { getPromotionAdminData } from "@/services/admin-promotions/get-promotion-admin-data";

interface AdminCatalogPromotionEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCatalogPromotionEditPage({ params }: AdminCatalogPromotionEditPageProps) {
  const { id } = await params;
  const data = await getPromotionAdminData();
  const promotion = data.promotions.find((item) => item.id === id) ?? null;

  if (!promotion) {
    notFound();
  }

  return <PromotionAdminPanel initialData={data} pageMode="edit" initialEditingPromotionId={promotion.id} />;
}