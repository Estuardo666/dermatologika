import { CtaSection } from "@/features/home/components/cta-section";
import { CategoryGridSection } from "@/features/home/components/category-grid-section";
import { EditorialSplitSection } from "@/features/home/components/editorial-split-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { ProductShelfSection } from "@/features/home/components/product-shelf-section";
import { PromoBannerSection } from "@/features/home/components/promo-banner-section";
import { TrustHighlightsSection } from "@/features/home/components/trust-highlights-section";
import type { HomePageContentResult } from "@/types/content";

interface HomePageViewProps {
  contentResult: HomePageContentResult;
}

export function HomePageView({ contentResult }: HomePageViewProps) {
  const { content } = contentResult;

  return (
    <>
      <HeroSection content={content.hero} />
      <PromoBannerSection content={content.featuredCampaign} variant="immersive" />
      <ProductShelfSection content={content.featuredProducts} variant="featured" />
      <PromoBannerSection content={content.routinePromo} reversed />
      <CategoryGridSection content={content.featuredCategories} />
      <ProductShelfSection content={content.routineProducts} />
      <EditorialSplitSection content={content.editorial} />
      <TrustHighlightsSection content={content.trustHighlights} />
      <CtaSection content={content.cta} />
    </>
  );
}
