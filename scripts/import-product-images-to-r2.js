/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient, MediaAssetKind } = require("@prisma/client");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const prisma = new PrismaClient();

const SOURCE_DIR = path.join(process.cwd(), "public", "Productos Test");
const TARGET_PREFIX = "Dermatologika/catalog-products";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_CATEGORY = {
  slug: "dermatologika-general",
  name: "Dermatologika general",
  description:
    "Productos dermatologika genéricos o no clasificados con suficiente claridad desde el nombre del archivo.",
  href: "/productos",
};

const CATEGORY_RULES = [
  {
    slug: "protectores-solares",
    name: "Protectores solares",
    description: "Fotoprotección facial y corporal para uso diario, reaplicación y cuidado dermatológico específico.",
    href: "/productos",
    keywords: ["solar", "sun", "spf", "uv", "anthelios", "uveblock", "photoderm", "bloqueador", "protector"],
  },
  {
    slug: "limpieza-facial",
    name: "Limpieza facial",
    description: "Limpiadores, aguas micelares y fórmulas de higiene para remover impurezas sin comprometer la barrera cutánea.",
    href: "/productos",
    keywords: ["cleanser", "limpiador", "clean", "mousse", "foam", "water", "micelar", "gel", "milk", "locion", "lotion", "toner"],
  },
  {
    slug: "serums-y-tratamientos",
    name: "Serums y tratamientos",
    description: "Tratamientos concentrados, serums y soluciones de apoyo para objetivos dermatológicos específicos.",
    href: "/productos",
    keywords: ["serum", "ampoule", "elixir", "treatment", "recovery", "repair", "rejuvenating", "lift", "fusion"],
  },
  {
    slug: "hidratacion-y-cremas",
    name: "Hidratación y cremas",
    description: "Cremas, emulsiones y fórmulas hidratantes pensadas para confort, nutrición y mantenimiento diario.",
    href: "/productos",
    keywords: ["cream", "crema", "baume", "hydr", "hydra", "moist", "emolient"],
  },
  {
    slug: "contorno-de-ojos",
    name: "Contorno de ojos",
    description: "Cuidado especializado para el contorno de ojos, pestañas y zonas perioculares sensibles.",
    href: "/productos",
    keywords: ["eye", "ojos", "ocul", "contour", "pest", "cej"],
  },
  {
    slug: "acne-y-piel-grasa",
    name: "Acné y piel grasa",
    description: "Productos para control de brillo, limpieza profunda y apoyo a rutinas para piel grasa o con tendencia acneica.",
    href: "/productos",
    keywords: ["acne", "oil", "purify", "purifying", "seb", "oily", "mat", "anti-shine"],
  },
  {
    slug: "despigmentantes",
    name: "Despigmentantes",
    description: "Fórmulas orientadas al manejo de manchas, tono irregular y luminosidad de la piel.",
    href: "/productos",
    keywords: ["melan", "white", "txa", "depig", "spot", "dark", "pigment", "clair", "neotone"],
  },
  {
    slug: "cabello-y-capilar",
    name: "Cabello y capilar",
    description: "Shampoos, serums y tratamientos enfocados en cuero cabelludo, fibra capilar y caída del cabello.",
    href: "/productos",
    keywords: ["shampoo", "champu", "hair", "capil", "alopec", "anti-caida", "peptan", "pilopeptan"],
  },
  {
    slug: "cuerpo-y-corporal",
    name: "Cuerpo y corporal",
    description: "Lociones, sprays y cuidado corporal para hidratación, confort y soporte cutáneo de zonas extensas.",
    href: "/productos",
    keywords: ["body", "corporal", "locion", "lotion", "milk", "balsamo", "baume", "spray"],
  },
  {
    slug: "maquillaje-dermocosmetico",
    name: "Maquillaje dermocosmético",
    description: "Bases, compactos y color dermocosmético con enfoque de cobertura y compatibilidad cutánea.",
    href: "/productos",
    keywords: ["makeup", "maquillaje", "base", "compact", "rubor", "tint", "color", "tone"],
  },
  {
    slug: "salud-capilar-y-suplementos",
    name: "Salud capilar y suplementos",
    description: "Suplementos, cápsulas y apoyo oral relacionados con salud capilar y bienestar dermatológico.",
    href: "/productos",
    keywords: ["capsula", "comprim", "tablets", "supplement", "oral", "omega", "vitamin"],
  },
];

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function stripNoiseTokens(value) {
  return value
    .replace(/\b\d{2,4}(?:x\d{2,4})?(?:-\d+)?\b/gi, " ")
    .replace(
      /\b(?:front|back|packshot|product|producto|image|img|web|new|nuevo|scaled|optimiz(?:ed)?|orig|original|fss|webp|jpg|jpeg|png|promo|banner|thumbnail)\b/gi,
      " ",
    )
    .replace(/\b(?:ml|mg|gr|g|lt|l|cm|mm|oz|spf)\b/gi, " ")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferCategory(fileName) {
  const normalized = slugify(fileName);
  const hit = CATEGORY_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return hit ?? DEFAULT_CATEGORY;
}

function inferProductName(fileName) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const stripped = stripNoiseTokens(baseName);
  const tokens = stripped.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return null;
  }

  const meaningful = tokens.filter((token) => token.length > 2 && !/^\d+$/.test(token));

  if (meaningful.length === 0) {
    return null;
  }

  const candidate = meaningful.join(" ");
  if (candidate.length < 4) {
    return null;
  }

  return titleCase(candidate);
}

function inferDescription(productName, categoryName, fileName) {
  if (productName.startsWith("Dermatologika Genérico")) {
    return `Producto dermatologika genérico creado a partir de ${path.basename(fileName)}. Se asignó a ${categoryName} por no tener suficiente contexto en el nombre del archivo.`;
  }

  return `Producto de ${categoryName.toLowerCase()} derivado del archivo ${path.basename(fileName)} y preparado para catálogo interno.`;
}

function inferMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  if (extension === ".gif") return "image/gif";
  return "application/octet-stream";
}

function resolveR2Config() {
  const endpoint = process.env.CLOUDFLARE_R2_S3_API_URL;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketUrl = process.env.CLOUDFLARE_R2_BUCKET_URL;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_DEV_URL || bucketUrl;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketUrl) {
    throw new Error(
      "Faltan variables R2. Requiere CLOUDFLARE_R2_S3_API_URL, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY y CLOUDFLARE_R2_BUCKET_URL.",
    );
  }

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName: new URL(bucketUrl).pathname.replace(/^\/+|\/+$/g, ""),
    publicBaseUrl: publicUrl ? publicUrl.replace(/\/$/, "") : null,
  };
}

function buildPublicUrl(baseUrl, storageKey) {
  if (!baseUrl) return null;
  return `${baseUrl.replace(/\/$/, "")}/${storageKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`;
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

async function main() {
  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((entry) => IMAGE_EXTENSIONS.has(path.extname(entry).toLowerCase()))
    .sort((left, right) => left.localeCompare(right, "es"));

  if (files.length === 0) {
    throw new Error(`No encontré imágenes en ${SOURCE_DIR}.`);
  }

  const r2 = resolveR2Config();
  const client = new S3Client({
    region: "auto",
    endpoint: r2.endpoint,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey,
    },
  });

  const categoryCache = new Map();
  let createdProducts = 0;
  let createdMediaAssets = 0;

  for (const fileName of files) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const category = inferCategory(fileName);
    const resolvedCategory = categoryCache.get(category.slug) || (await ensureCategory(category));
    categoryCache.set(category.slug, resolvedCategory);

    const inferredName = inferProductName(fileName);
    const productName = inferredName && inferredName.length >= 6 ? inferredName : `Dermatologika Genérico ${path.basename(fileName, path.extname(fileName))}`;
    const description = inferDescription(productName, resolvedCategory.name, fileName);
    const hashSuffix = crypto.createHash("sha1").update(fileName).digest("hex").slice(0, 8);
    const productSlugBase = slugify(productName) || `dermatologika-generico-${slugify(path.basename(fileName, path.extname(fileName)))}`;
    const productSlug = `${productSlugBase}-${hashSuffix}`;
    const externalId = `local-image:${fileName}`;
    const storageKey = `${TARGET_PREFIX}/${productSlugBase}-${hashSuffix}${path.extname(fileName).toLowerCase()}`;
    const mimeType = inferMimeType(sourcePath);
    const body = fs.readFileSync(sourcePath);

    await client.send(
      new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: storageKey,
        Body: body,
        ContentType: mimeType,
        ContentLength: body.length,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const mediaAsset = await prisma.mediaAsset.upsert({
      where: { storageKey },
      update: {
        publicUrl: buildPublicUrl(r2.publicBaseUrl, storageKey),
        kind: MediaAssetKind.image,
        mimeType,
        altText: productName,
      },
      create: {
        storageKey,
        publicUrl: buildPublicUrl(r2.publicBaseUrl, storageKey),
        kind: MediaAssetKind.image,
        mimeType,
        altText: productName,
      },
    });

    const product = await prisma.product.upsert({
      where: { externalId },
      update: {
        slug: productSlug,
        name: productName,
        description,
        href: "/productos",
        price: 0,
        discountPrice: null,
        stock: 0,
        isActive: true,
        categoryId: resolvedCategory.id,
        categoryAssignments: {
          deleteMany: {},
          create: [
            {
              categoryId: resolvedCategory.id,
              position: 0,
            },
          ],
        },
        mediaAssetId: mediaAsset.id,
        externalId,
        externalSourceId: "local-product-images",
        externalMetadata: {
          sourceFile: fileName,
          originalPath: `public/Productos Test/${fileName}`,
          categorySlug: resolvedCategory.slug,
          generatedBy: "scripts/import-product-images-to-r2.js",
          currency: DEFAULT_CURRENCY,
        },
      },
      create: {
        slug: productSlug,
        name: productName,
        description,
        href: "/productos",
        price: 0,
        discountPrice: null,
        stock: 0,
        isActive: true,
        categoryId: resolvedCategory.id,
        categoryAssignments: {
          create: [
            {
              categoryId: resolvedCategory.id,
              position: 0,
            },
          ],
        },
        mediaAssetId: mediaAsset.id,
        externalId,
        externalSourceId: "local-product-images",
        externalMetadata: {
          sourceFile: fileName,
          originalPath: `public/Productos Test/${fileName}`,
          categorySlug: resolvedCategory.slug,
          generatedBy: "scripts/import-product-images-to-r2.js",
          currency: DEFAULT_CURRENCY,
        },
      },
    });

    createdMediaAssets += 1;
    createdProducts += 1;
    console.log(`OK ${fileName} -> ${product.name} (${product.slug})`);
  }

  console.log(`\nListo: ${createdProducts} productos y ${createdMediaAssets} media assets procesados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });