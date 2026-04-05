import type { CheckoutShippingMethod } from "@/config/checkout";
import type {
  CheckoutPricingPreview,
  CheckoutPricingPreviewRequestItem,
} from "@/types/checkout-pricing";

export type PromotionTriggerType = "automatic" | "coupon";
export type PromotionRuleType = "buy_x_get_y" | "nth_item_percentage" | "volume_discount" | "free_shipping";
export type PromotionStackingMode = "exclusive" | "stackable";
export type PromotionItemMatchingMode = "same_product" | "mixed_scope";

export interface PromotionScopeSelection {
  productIds: string[];
  categoryIds: string[];
  brandIds: string[];
}

export interface BuyXGetYPromotionConfig {
  buyQuantity: number;
  getQuantity: number;
  percentOff: number;
  repeat: boolean;
  appliesToCheapest: boolean;
  matchingMode: PromotionItemMatchingMode;
}

export interface NthItemPercentagePromotionConfig {
  itemPosition: number;
  percentOff: number;
  repeat: boolean;
  appliesToCheapest: boolean;
  matchingMode: PromotionItemMatchingMode;
}

export interface VolumeDiscountTier {
  minQuantity: number;
  percentOff?: number | undefined;
  amountOffPerUnit?: number | undefined;
}

export interface VolumeDiscountPromotionConfig {
  tiers: VolumeDiscountTier[];
  matchingMode: PromotionItemMatchingMode;
}

export interface FreeShippingPromotionConfig {
  minQuantity?: number | undefined;
  minSubtotal?: number | undefined;
  shippingMethods: CheckoutShippingMethod[];
}

export type PromotionConfig =
  | BuyXGetYPromotionConfig
  | NthItemPercentagePromotionConfig
  | VolumeDiscountPromotionConfig
  | FreeShippingPromotionConfig;

export interface AdminPromotionFormData {
  name: string;
  description: string;
  isActive: boolean;
  triggerType: PromotionTriggerType;
  couponCode: string | null;
  ruleType: PromotionRuleType;
  stackingMode: PromotionStackingMode;
  priority: number;
  startsAt: string | null;
  endsAt: string | null;
  scope: PromotionScopeSelection;
  config: PromotionConfig;
}

export interface AdminPromotionItem {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  triggerType: PromotionTriggerType;
  couponCode: string | null;
  ruleType: PromotionRuleType;
  stackingMode: PromotionStackingMode;
  priority: number;
  startsAt: string | null;
  endsAt: string | null;
  scope: PromotionScopeSelection;
  config: PromotionConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPromotionReferenceCategory {
  id: string;
  name: string;
}

export interface AdminPromotionReferenceBrand {
  id: string;
  name: string;
}

export interface AdminPromotionReferenceProduct {
  id: string;
  name: string;
  brand: string;
  mediaAssetPublicUrl: string | null;
  mediaAssetAltText: string;
}

export interface AdminPromotionEditorData {
  promotions: AdminPromotionItem[];
  categories: AdminPromotionReferenceCategory[];
  brands: AdminPromotionReferenceBrand[];
  products: AdminPromotionReferenceProduct[];
}

export interface AdminPromotionListRouteResponse {
  success: boolean;
  data?: {
    promotions: AdminPromotionItem[];
  };
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface AdminPromotionRouteResponse {
  success: boolean;
  data?: {
    promotion: AdminPromotionItem;
  };
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface AdminPromotionPreviewRequest {
  items: CheckoutPricingPreviewRequestItem[];
  shippingMethod: CheckoutShippingMethod;
  couponCode?: string | null;
  editingPromotionId?: string | null;
  promotion: AdminPromotionFormData;
}

export interface AdminPromotionPreviewRouteResponse {
  success: boolean;
  data?: {
    preview: CheckoutPricingPreview;
  };
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}