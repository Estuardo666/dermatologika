import type { MediaAsset } from "@/types/media";
import type { PublicCatalogCategoryReference } from "@/types/public-catalog";

export type PublicContentSource = "fallback" | "database";

export interface PublicActionLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface HomeHeroSpotlightCard {
  id: string;
  eyebrow: string;
  title: string;
  href: string;
  media: MediaAsset | null;
}

export interface HomeHeroSlide {
  id: string;
  announcement: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  supportingBadge: string;
  primaryCta: PublicActionLink;
  secondaryCta?: PublicActionLink;
  media: MediaAsset | null;
}

export interface HomeHeroContent {
  slides: HomeHeroSlide[];
  spotlightCards: HomeHeroSpotlightCard[];
}

export interface HomeSectionHeading {
  sectionId: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface FeaturedCategoryContent {
  id: string;
  name: string;
  description: string;
  href: string;
  media: MediaAsset | null;
}

export interface FeaturedProductContent {
  id: string;
  name: string;
  brand: string;
  description: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  price: number | null;
  discountPrice: number | null;
  category: PublicCatalogCategoryReference | null;
  media: MediaAsset | null;
}

export interface TrustHighlightContent {
  id: string;
  title: string;
  description: string;
}

export interface HomeSectionContent<TItem> extends HomeSectionHeading {
  items: TItem[];
}

export interface HomePromoBannerContent extends HomeSectionHeading {
  accentText?: string;
  primaryCta: PublicActionLink;
  secondaryCta?: PublicActionLink;
  media: MediaAsset | null;
}

export interface HomeProductShelfContent extends HomeSectionContent<FeaturedProductContent> {
  cta?: PublicActionLink;
}

export interface HomeCategoryGridContent extends HomeSectionContent<FeaturedCategoryContent> {
  cta?: PublicActionLink;
}

export interface HomeEditorialSectionContent extends HomeSectionHeading {
  accentText?: string;
  primaryCta: PublicActionLink;
  secondaryCta?: PublicActionLink;
  media: MediaAsset | null;
  items: TrustHighlightContent[];
}

export interface HomeCtaSectionContent extends HomeSectionHeading {
  primaryCta: PublicActionLink;
  secondaryCta?: PublicActionLink;
}

export interface HomePageContent {
  hero: HomeHeroContent;
  featuredCampaign: HomePromoBannerContent;
  featuredProducts: HomeProductShelfContent;
  routinePromo: HomePromoBannerContent;
  featuredCategories: HomeCategoryGridContent;
  routineProducts: HomeProductShelfContent;
  editorial: HomeEditorialSectionContent;
  trustHighlights: HomeSectionContent<TrustHighlightContent>;
  cta: HomeCtaSectionContent;
}

export interface HomePageContentResult {
  content: HomePageContent;
  source: PublicContentSource;
}
