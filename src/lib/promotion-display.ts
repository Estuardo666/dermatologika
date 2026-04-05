import type {
  BuyXGetYPromotionConfig,
  NthItemPercentagePromotionConfig,
  PromotionConfig,
  PromotionRuleType,
  VolumeDiscountPromotionConfig,
} from "@/types/admin-promotions";

function formatOrdinal(value: number): string {
  if (value === 1) {
    return "1ro";
  }

  if (value === 2) {
    return "2do";
  }

  if (value === 3) {
    return "3ro";
  }

  if (value === 4) {
    return "4to";
  }

  return `${value}°`;
}

export interface PromotionDisplayContent {
  shortLabel: string;
  badgeParts: string[];
  tooltip: string;
}

export function resolvePromotionShortLabel(
  ruleType: PromotionRuleType,
  config: PromotionConfig,
): string {
  return resolvePromotionDisplayContent(ruleType, config).shortLabel;
}

export function resolvePromotionDisplayContent(
  ruleType: PromotionRuleType,
  config: PromotionConfig,
): PromotionDisplayContent {
  switch (ruleType) {
    case "buy_x_get_y": {
      const parsedConfig = config as BuyXGetYPromotionConfig;
      const mainPart = `${parsedConfig.buyQuantity} + ${parsedConfig.getQuantity}`;

      if (parsedConfig.percentOff === 100 && parsedConfig.getQuantity === 1) {
        return {
          shortLabel: mainPart,
          badgeParts: [`${parsedConfig.buyQuantity}`, `+ ${parsedConfig.getQuantity}`],
          tooltip: `Lleva ${parsedConfig.buyQuantity} y recibe ${parsedConfig.getQuantity} gratis. Se aplica automáticamente al agregar la cantidad necesaria.`,
        };
      }

      return {
        shortLabel: `${mainPart} al ${parsedConfig.percentOff}%`,
        badgeParts: [mainPart, `${parsedConfig.percentOff}%`],
        tooltip: `Comprando ${parsedConfig.buyQuantity} obtienes ${parsedConfig.getQuantity} adicional con ${parsedConfig.percentOff}% de descuento.`,
      };
    }
    case "nth_item_percentage": {
      const parsedConfig = config as NthItemPercentagePromotionConfig;
      const buyQuantity = Math.max(1, parsedConfig.itemPosition - 1);
      const mainPart = `${buyQuantity} + 1`;

      return {
        shortLabel: `${mainPart} al ${parsedConfig.percentOff}%`,
        badgeParts: [mainPart, `${parsedConfig.percentOff}%`],
        tooltip: `Al llevar ${buyQuantity}, la ${formatOrdinal(parsedConfig.itemPosition)} unidad recibe ${parsedConfig.percentOff}% de descuento.`,
      };
    }
    case "volume_discount": {
      const parsedConfig = config as VolumeDiscountPromotionConfig;
      const highestTier = [...parsedConfig.tiers].sort((left, right) => right.minQuantity - left.minQuantity)[0];

      if (highestTier?.percentOff !== undefined) {
        return {
          shortLabel: `${highestTier.percentOff}%`,
          badgeParts: [`${highestTier.percentOff}%`],
          tooltip: `Descuento por volumen de hasta ${highestTier.percentOff}% según la cantidad comprada.`,
        };
      }

      if (highestTier?.amountOffPerUnit !== undefined && highestTier.amountOffPerUnit > 0) {
        return {
          shortLabel: "Ahorro",
          badgeParts: ["Ahorro"],
          tooltip: "Descuento por volumen aplicado según la cantidad comprada.",
        };
      }

      return {
        shortLabel: "Promo",
        badgeParts: ["Promo"],
        tooltip: "Promoción por volumen activa para este producto.",
      };
    }
    case "free_shipping":
      return {
        shortLabel: "Envío gratis",
        badgeParts: ["Envío gratis"],
        tooltip: "Envío gratis al cumplir las condiciones de la promoción.",
      };
    default:
      return {
        shortLabel: "Promoción",
        badgeParts: ["Promoción"],
        tooltip: "Promoción activa para este producto.",
      };
  }
}