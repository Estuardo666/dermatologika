/* eslint-disable no-console */
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const TARGET_SOURCE_ID = "local-product-images";

const CATEGORY_DEFINITIONS = [
  {
    slug: "medicamentos-dermatologicos",
    name: "Medicamentos dermatológicos",
    description: "Productos farmacéuticos y tratamientos de prescripción o soporte médico dermatológico.",
    href: "/productos",
  },
  {
    slug: "kits-y-packs",
    name: "Kits y packs",
    description: "Sets, presentaciones especiales y agrupaciones comerciales para rutinas completas.",
    href: "/productos",
  },
  {
    slug: "estetica-y-procedimientos",
    name: "Estética y procedimientos",
    description: "Productos y referencias vinculadas a procedimientos estéticos y cuidado post intervención.",
    href: "/productos",
  },
];

const CATEGORY_RULES = [
  {
    slug: "medicamentos-dermatologicos",
    keywords: [
      "azitromicina",
      "clobesol",
      "iloticina",
      "tacroz",
      "terbilazar",
      "presacor",
      "tranexam",
      "sindrometa",
      "isoface",
      "momed",
      "ketocon",
      "medypiel",
      "udox",
    ],
  },
  {
    slug: "estetica-y-procedimientos",
    keywords: ["radiesse", "prp", "rejuvenator", "elixir", "mesa de trabajo", "thumbnail", "render"],
  },
  {
    slug: "kits-y-packs",
    keywords: ["pack", "kit", "set", "duo", "combo"],
  },
  {
    slug: "protectores-solares",
    keywords: ["solar", "sun", "spf", "uveblock", "photoderm", "anthelios", "bloqueador", "protector"],
  },
  {
    slug: "limpieza-facial",
    keywords: ["cleanser", "limpiador", "micelar", "water", "mousse", "foam", "milk", "gel", "toner", "hig"],
  },
  {
    slug: "serums-y-tratamientos",
    keywords: ["serum", "retinol", "rederm", "recovery", "repair", "elixir", "fusion", "anti aging"],
  },
  {
    slug: "hidratacion-y-cremas",
    keywords: ["cream", "crema", "baume", "hidr", "hydra", "emoliente", "unguento", "cicaplast", "lipikar"],
  },
  {
    slug: "cabello-y-capilar",
    keywords: ["shampoo", "champu", "capil", "hair", "anti caida", "pilopeptan", "revita", "megacistin"],
  },
  {
    slug: "maquillaje-dermocosmetico",
    keywords: ["makeup", "maquillaje", "base", "compact", "rubor", "tint", "tono", "blur"],
  },
  {
    slug: "despigmentantes",
    keywords: ["neotone", "melan", "spot", "pigment", "txa", "vitamin c", "clar", "white"],
  },
];

const BRAND_RULES = [
  { name: "La Roche-Posay", keywords: ["la roche", "laroche", "roche posay", "anthelios", "effaclar", "lipikar", "cicaplast"] },
  { name: "Bioderma", keywords: ["bioderma", "sensibio", "photoderm", "atoderm"] },
  { name: "Sensilis", keywords: ["sensilis", "upgrade", "sunsecret", "arcamia"] },
  { name: "Uriage", keywords: ["uriage", "bariederm", "roseliane", "urelia"] },
  { name: "TiZO", keywords: ["tizo"] },
  { name: "Pilopeptan", keywords: ["pilopeptan"] },
  { name: "Isdin", keywords: ["lambdapil", "fotoprotector", "isdin"] },
  { name: "Mesoestetic", keywords: ["mesoestetic", "cosmelan"] },
  { name: "Leti", keywords: ["leti", "letixer", "at4"] },
  { name: "Medypiel", keywords: ["medypiel"] },
];

const DEFAULT_BRAND = "Dermatologika";

const BASE_PRICE_BY_CATEGORY = {
  "protectores-solares": 32.9,
  "limpieza-facial": 24.9,
  "serums-y-tratamientos": 46.9,
  "hidratacion-y-cremas": 36.9,
  "contorno-de-ojos": 39.9,
  "acne-y-piel-grasa": 34.9,
  "despigmentantes": 44.9,
  "cabello-y-capilar": 29.9,
  "cuerpo-y-corporal": 27.9,
  "maquillaje-dermocosmetico": 33.9,
  "salud-capilar-y-suplementos": 28.9,
  "medicamentos-dermatologicos": 18.9,
  "kits-y-packs": 49.9,
  "estetica-y-procedimientos": 54.9,
  "dermatologika-general": 31.9,
};

const BASE_STOCK_BY_CATEGORY = {
  "protectores-solares": 12,
  "limpieza-facial": 14,
  "serums-y-tratamientos": 9,
  "hidratacion-y-cremas": 10,
  "contorno-de-ojos": 8,
  "acne-y-piel-grasa": 11,
  "despigmentantes": 7,
  "cabello-y-capilar": 10,
  "cuerpo-y-corporal": 9,
  "maquillaje-dermocosmetico": 8,
  "salud-capilar-y-suplementos": 12,
  "medicamentos-dermatologicos": 6,
  "kits-y-packs": 5,
  "estetica-y-procedimientos": 4,
  "dermatologika-general": 6,
};

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => (segment.length <= 3 && /^[A-Z0-9]+$/.test(segment)
      ? segment
      : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()))
    .join(" ");
}

function normalizeSourceName(fileName) {
  const base = path.basename(fileName || "", path.extname(fileName || ""));
  const sanitized = base
    .replace(/^medypiel-producto-/i, "")
    .replace(/^product_show_/i, "")
    .replace(/^product_picture_/i, "")
    .replace(/^product_/i, "")
    .replace(/^pim-ie-/i, "")
    .replace(/^la-roche-posay-productpage-/i, "la roche posay ")
    .replace(/^larocheposay-product-/i, "la roche posay ")
    .replace(/^larocheposay/i, "la roche posay ")
    .replace(/^lrp/i, "la roche posay ")
    .replace(/[_\-.]+/g, " ")
    .replace(/\b(?:scaled|orig|original|front|back|render|thumbnail|web|nuevo|new|optimiz(?:ed)?|copy|copia)\b/gi, " ")
    .replace(/\b\d{2,4}x\d{2,4}\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!sanitized || sanitized.length < 3) {
    return null;
  }

  return toTitleCase(sanitized);
}

function inferCategorySlugFromText(text) {
  const normalized = slugify(text).replace(/-/g, " ");

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.slug;
    }
  }

  return "dermatologika-general";
}

function inferBrandFromText(text) {
  const normalized = slugify(text).replace(/-/g, " ");

  const match = BRAND_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  if (match) {
    return match.name;
  }

  return DEFAULT_BRAND;
}

async function ensureCategory(category) {
  return prisma.category.upsert({
    where: { slug: category.slug },
    update: {
      name: category.name,
      description: category.description,
      href: category.href,
      isActive: true,
    },
    create: {
      slug: category.slug,
      name: category.name,
      description: category.description,
      href: category.href,
      isActive: true,
    },
  });
}

async function ensureBrand(name) {
  return prisma.brand.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function main() {
  await Promise.all(CATEGORY_DEFINITIONS.map((definition) => ensureCategory(definition)));

  const products = await prisma.product.findMany({
    where: { externalSourceId: TARGET_SOURCE_ID },
    include: {
      category: {
        select: {
          slug: true,
        },
      },
    },
  });

  let refinedNames = 0;
  let recategorized = 0;
  let brandsAssigned = 0;

  for (const product of products) {
    const metadata = (product.externalMetadata && typeof product.externalMetadata === "object")
      ? product.externalMetadata
      : {};
    const sourceFile = metadata.sourceFile && typeof metadata.sourceFile === "string"
      ? metadata.sourceFile
      : null;

    const referenceText = `${product.name} ${sourceFile || ""}`;
    const inferredBrand = inferBrandFromText(referenceText);
    const brandRecord = await ensureBrand(inferredBrand);

    let nextName = product.name;
    let nextCategorySlug = product.category?.slug || "dermatologika-general";

    if (nextCategorySlug === "dermatologika-general") {
      const normalizedName = sourceFile ? normalizeSourceName(sourceFile) : null;
      if (normalizedName && normalizedName !== product.name) {
        nextName = normalizedName;
        refinedNames += 1;
      }

      nextCategorySlug = inferCategorySlugFromText(`${nextName} ${sourceFile || ""}`);
      if (nextCategorySlug !== (product.category?.slug || "dermatologika-general")) {
        recategorized += 1;
      }
    }

    const nextCategory = await prisma.category.findUnique({
      where: { slug: nextCategorySlug },
      select: { id: true, slug: true },
    });

    if (!nextCategory) {
      throw new Error(`No se encontró categoría para slug ${nextCategorySlug}`);
    }

    const slugSuffix = product.slug.split("-").slice(-1)[0] || product.id.slice(-8);
    const nextSlugBase = slugify(nextName) || `producto-${product.id.slice(-8)}`;
    const nextSlug = `${nextSlugBase}-${slugSuffix}`;
    const basePrice = BASE_PRICE_BY_CATEGORY[nextCategory.slug] ?? 31.9;
    const baseStock = BASE_STOCK_BY_CATEGORY[nextCategory.slug] ?? 6;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        slug: nextSlug,
        name: nextName,
        categoryId: nextCategory.id,
        categoryAssignments: {
          deleteMany: {},
          create: [
            {
              categoryId: nextCategory.id,
              position: 0,
            },
          ],
        },
        brand: inferredBrand,
        brandId: brandRecord.id,
        price: basePrice,
        discountPrice: null,
        stock: baseStock,
        externalMetadata: {
          ...metadata,
          refinement: {
            pass: 2,
            refinedAt: new Date().toISOString(),
            sourceFile,
            categorySlug: nextCategory.slug,
            brand: inferredBrand,
            basePrice,
            baseStock,
          },
        },
      },
    });

    brandsAssigned += 1;
  }

  const remainingGeneral = await prisma.product.count({
    where: {
      externalSourceId: TARGET_SOURCE_ID,
      category: {
        slug: "dermatologika-general",
      },
    },
  });

  console.log(`Productos importados procesados: ${products.length}`);
  console.log(`Nombres refinados: ${refinedNames}`);
  console.log(`Productos recategorizados desde general: ${recategorized}`);
  console.log(`Marcas base asignadas/actualizadas: ${brandsAssigned}`);
  console.log(`Productos que siguen en categoria general: ${remainingGeneral}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });