# Pricing and Promotions

Backend guide for configurable offers and checkout pricing preview.

## Goal

Promotions are implemented as a calculation layer on top of the product base price.

Base price resolution remains:

* `discountPrice` when present and lower than `price`
* otherwise `price`

This design preserves the existing rule that synchronized product pricing remains the source of truth and avoids mutating `Product.price` just to represent temporary offers.

## Data Model

New Prisma entities:

* `Promotion`
* `PromotionProduct`
* `PromotionCategory`
* `PromotionBrand`

Key promotion fields:

* `triggerType`: `automatic` or `coupon`
* `ruleType`: `buy_x_get_y`, `nth_item_percentage`, `volume_discount`, `free_shipping`
* `stackingMode`: `exclusive` or `stackable`
* `priority`
* `startsAt`
* `endsAt`
* `config` as validated JSON

Scope rules:

* empty scope means the promotion applies to the full cart
* populated scope works as a union across products, categories, and brands

## Admin API

Dashboard route:

* `/admin/catalog/promotions`

Authenticated endpoints:

* `GET /api/admin/promotions`
* `POST /api/admin/promotions`
* `PUT /api/admin/promotions/:id`
* `DELETE /api/admin/promotions/:id`

All responses use the standard envelope:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-04-04T00:00:00.000Z"
}
```

## Rule Examples

### A. 3x2 or 2x1

Use `ruleType: "buy_x_get_y"`.

Example 3x2:

```json
{
  "name": "3x2 en limpiadores",
  "description": "El tercer producto elegible es gratis",
  "isActive": true,
  "triggerType": "automatic",
  "couponCode": null,
  "ruleType": "buy_x_get_y",
  "stackingMode": "exclusive",
  "priority": 100,
  "startsAt": null,
  "endsAt": null,
  "scope": {
    "productIds": [],
    "categoryIds": ["cat_limpiadores"],
    "brandIds": []
  },
  "config": {
    "buyQuantity": 2,
    "getQuantity": 1,
    "percentOff": 100,
    "repeat": true,
    "appliesToCheapest": true
  }
}
```

Example 2x1:

* same structure
* `buyQuantity: 1`
* `getQuantity: 1`

### B. Segundo o tercero al 50%

Use `ruleType: "nth_item_percentage"`.

Segundo al 50%:

```json
{
  "name": "Segundo al 50%",
  "description": "Aplica sobre productos elegibles",
  "isActive": true,
  "triggerType": "automatic",
  "couponCode": null,
  "ruleType": "nth_item_percentage",
  "stackingMode": "exclusive",
  "priority": 90,
  "startsAt": null,
  "endsAt": null,
  "scope": {
    "productIds": [],
    "categoryIds": [],
    "brandIds": ["brand_derma"]
  },
  "config": {
    "itemPosition": 2,
    "percentOff": 50,
    "repeat": true,
    "appliesToCheapest": true
  }
}
```

Tercero al 50%:

* same structure
* `itemPosition: 3`

### C. Bulk por escalas

Use `ruleType: "volume_discount"`.

```json
{
  "name": "Descuento por volumen",
  "description": "Escalas progresivas para protectores",
  "isActive": true,
  "triggerType": "coupon",
  "couponCode": "BULK10",
  "ruleType": "volume_discount",
  "stackingMode": "stackable",
  "priority": 80,
  "startsAt": null,
  "endsAt": null,
  "scope": {
    "productIds": [],
    "categoryIds": ["cat_protectores"],
    "brandIds": []
  },
  "config": {
    "tiers": [
      { "minQuantity": 3, "percentOff": 10 },
      { "minQuantity": 6, "percentOff": 15 }
    ]
  }
}
```

The highest matching tier is applied to all eligible lines.

### D. Envío gratis por cantidad o monto

Use `ruleType: "free_shipping"`.

Por cantidad:

```json
{
  "name": "Envío gratis desde 4 unidades",
  "description": "Solo para envío estándar",
  "isActive": true,
  "triggerType": "automatic",
  "couponCode": null,
  "ruleType": "free_shipping",
  "stackingMode": "exclusive",
  "priority": 70,
  "startsAt": null,
  "endsAt": null,
  "scope": {
    "productIds": [],
    "categoryIds": [],
    "brandIds": []
  },
  "config": {
    "minQuantity": 4,
    "shippingMethods": ["standard"]
  }
}
```

Por monto:

```json
{
  "name": "Envío gratis desde $120",
  "description": "Solo para checkout estándar",
  "isActive": true,
  "triggerType": "automatic",
  "couponCode": null,
  "ruleType": "free_shipping",
  "stackingMode": "exclusive",
  "priority": 70,
  "startsAt": null,
  "endsAt": null,
  "scope": {
    "productIds": [],
    "categoryIds": [],
    "brandIds": []
  },
  "config": {
    "minSubtotal": 120,
    "shippingMethods": ["standard"]
  }
}
```

## Checkout Pricing Preview API

Public endpoint:

* `POST /api/checkout/price-preview`

Request body:

```json
{
  "items": [
    { "productId": "prod_1", "quantity": 2 },
    { "productId": "prod_2", "quantity": 1 }
  ],
  "shippingMethod": "standard",
  "couponCode": "BULK10"
}
```

Response shape:

```json
{
  "success": true,
  "data": {
    "preview": {
      "currency": "USD",
      "couponCode": "BULK10",
      "invalidCouponCode": null,
      "lines": [],
      "appliedPromotions": [],
      "totals": {
        "totalItemCount": 3,
        "merchandiseSubtotal": 100,
        "discountTotal": 10,
        "shippingBase": 6,
        "shippingDiscount": 6,
        "shippingTotal": 0,
        "total": 90
      }
    }
  },
  "timestamp": "2026-04-04T00:00:00.000Z"
}
```

## Checkout Integration Notes

Current checkout now fetches the preview from backend and renders:

* line-level discount adjustments
* applied promotions list
* coupon validation feedback
* free shipping adjustments
* final total from backend

This prevents the UI from trusting local subtotal math for advanced offers.

## Operational Notes

After pulling this change into an environment with a real database, apply the new migration before running checkout against that database.

Typical command sequence:

```bash
npm run prisma:migrate:deploy
npm run build
```