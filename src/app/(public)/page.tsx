import type { Metadata } from "next";

import { HomePageView } from "@/features/home/components/home-page-view";
import { getHomePageContent } from "@/services/content/get-home-page-content";

export const metadata: Metadata = {
  title: "Home",
  description: "Dermatologika storefront base with dynamic-content-ready public architecture.",
};

export default async function HomePage() {
  const contentResult = await getHomePageContent();

  return <HomePageView contentResult={contentResult} />;
}
