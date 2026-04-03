import { z } from "zod";

const optionalSlugSchema = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value.length === 0 || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    "Slug must use lowercase letters, numbers, and hyphens only",
  );

const optionalHrefSchema = z
  .string()
  .trim()
  .default("")
  .refine((value) => value.length === 0 || value.startsWith("/"), "Href must start with '/'");

const mediaAssetIdSchema = z.string().trim().default("");

const currencyAmountSchema = z
  .coerce
  .number()
  .finite("Price must be a valid number")
  .min(0, "Price cannot be negative")
  .refine((value) => Number.isInteger(value * 100), "Price must have at most 2 decimal places");

const optionalCurrencyAmountSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  },
  currencyAmountSchema.nullable(),
);

const stockSchema = z.coerce.number().int("Stock must be an integer").min(0, "Stock cannot be negative");

export const adminCategoryFormSchema = z.object({
  slug: optionalSlugSchema,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  href: optionalHrefSchema,
  isActive: z.boolean(),
  mediaAssetId: mediaAssetIdSchema,
});

export const adminProductFormSchema = z.object({
  slug: optionalSlugSchema,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  href: optionalHrefSchema,
  badge: z.string().trim().default(""),
  price: currencyAmountSchema.default(0),
  discountPrice: optionalCurrencyAmountSchema.default(null),
  stock: stockSchema.default(0),
  isActive: z.boolean(),
  categoryId: z.string().trim().min(1, "Category is required"),
  mediaAssetId: mediaAssetIdSchema,
}).superRefine((value, context) => {
  if (value.discountPrice !== null && value.discountPrice > value.price) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["discountPrice"],
      message: "Discount price cannot be greater than price",
    });
  }
});

export const adminCatalogBulkActionSchema = z.object({
  ids: z.array(z.string().trim().min(1, "Record id is required")).min(1, "Select at least one record."),
  action: z.enum(["activate", "deactivate", "delete"]),
});

export type AdminCategoryFormInput = z.infer<typeof adminCategoryFormSchema>;
export type AdminProductFormInput = z.infer<typeof adminProductFormSchema>;
export type AdminCatalogBulkActionInput = z.infer<typeof adminCatalogBulkActionSchema>;
