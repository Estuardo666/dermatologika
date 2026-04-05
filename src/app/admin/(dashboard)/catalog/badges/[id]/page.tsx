import { notFound } from "next/navigation";

import { BadgePresetAdminPanel } from "@/features/admin-catalog/components/badge-preset-admin-panel";
import { getProductBadgePresetAdminData } from "@/services/admin-catalog/get-catalog-admin-data";

interface AdminCatalogBadgeEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCatalogBadgeEditPage({ params }: AdminCatalogBadgeEditPageProps) {
  const { id } = await params;
  const presets = await getProductBadgePresetAdminData();
  const preset = presets.find((item) => item.id === id) ?? null;

  if (!preset) {
    notFound();
  }

  return <BadgePresetAdminPanel initialPresets={presets} pageMode="edit" initialEditingPresetId={preset.id} />;
}