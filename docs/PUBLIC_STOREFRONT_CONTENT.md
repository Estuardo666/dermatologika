# Public Storefront Content Architecture

Esta base pública separa presentación, contratos y lectura server-side para evitar hardcodeo comercial dentro de la UI.

## Módulos

- `src/app/(public)/`: layout y páginas públicas.
- `src/app/admin/content/home/`: superficie inicial de edición para Home persistida.
- `src/components/layout/`: header y footer del storefront.
- `src/components/media/`: renderizado reusable de assets visuales.
- `src/features/home/components/`: composición de secciones de Home.
- `src/features/admin-content/`: schemas y editor inicial de Home para administración.
- `src/services/content/`: capa de lectura pública consumida por páginas server-side.
- `src/services/admin-content/`: orquestación del editor admin y registro de media.
- `src/server/content/`: origen server-only del contenido editable, repositorio y mapeo.
- `src/types/content.ts`: contratos tipados de Home y secciones públicas.
- `src/types/media.ts`: contrato tipado de assets de imagen o video.
- `prisma/schema.prisma`: modelos persistidos para `MediaAsset`, `HomePageContent`, `Category`, `Product`, `HomeFeaturedCategory` y `HomeFeaturedProduct`.

## Flujo público actual

1. `src/app/(public)/page.tsx` llama a `getHomePageContent()`.
2. `src/services/content/get-home-page-content.ts` intenta leer contenido persistido vía `readStoredHomePageContent()`.
3. `src/server/content/home-page-content.source.ts` consulta Prisma e incluye `heroMedia`, `heroSecondaryMedia` y `heroTertiaryMedia`.
4. `src/server/content/home-page-content.persistence.ts` valida y mapea el registro persistido hacia los contratos públicos.
5. `src/app/(public)/categorias/page.tsx`, `src/app/(public)/categorias/[slug]/page.tsx`, `src/app/(public)/productos/page.tsx` y `src/app/(public)/productos/[slug]/page.tsx` leen el catálogo local mediante `src/services/catalog/get-public-catalog-data.ts`.
6. `src/server/catalog/public-catalog.repository.ts` sirve categorías y productos activos con paginación básica y relaciones de media/categoría.
7. Solo si todavía no existe una fila persistida, la portada devuelve `fallbackHomePageContent`.

## Persistencia real

- `MediaAsset` actúa como entidad canónica para imagen o video administrable.
- `HomePageContent` concentra el copy principal de Home y los bloques editoriales persistidos.
- La Home persiste tres referencias de slides hero: `heroMediaId`, `heroSecondaryMediaId` y `heroTertiaryMediaId`.
- `Category` y `Product` representan la copia local normalizada del catálogo visible en Home.
- `HomeFeaturedCategory` y `HomeFeaturedProduct` definen la selección y el orden de merchandising para la portada.
- Trust highlights sigue almacenándose como JSON editorial validado en servidor.
- Los tres slides del hero salen desde relaciones persistidas en base de datos; la Home ya no depende de variables `HERO_BANNER_*`.

## Edición administrativa

- `GET /api/admin/content/home` devuelve el snapshot editable, las media assets disponibles y las entidades de catálogo seleccionables para Home.
- `PUT /api/admin/content/home` actualiza el snapshot persistido de Home y las relaciones destacadas de categorías y productos.
- `GET /api/admin/media-assets` lista referencias canónicas de media.
- `POST /api/admin/media-assets` registra una media asset que ya existe en Cloudflare R2.
- `POST /api/admin/media-assets/upload` sube el archivo a Cloudflare R2 y persiste la media asset en un solo paso.
- La página inicial de edición vive en `/admin/content/home`.

## Integración con Cloudflare R2

- El editor puede subir archivos directamente a R2 si el servidor tiene `CLOUDFLARE_R2_ACCESS_KEY_ID` y `CLOUDFLARE_R2_SECRET_ACCESS_KEY`.
- Si esas credenciales no están definidas, el upload responde con un error controlado y el registro manual sigue disponible.
- Si `publicUrl` se deja vacío al registrar una media asset, el backend la deriva desde `CLOUDFLARE_R2_PUBLIC_DEV_URL` y el `storageKey`.

## Seed y migración

1. `npm run prisma:migrate:dev`
2. `npm run prisma:seed`

Para aplicar las migraciones ya versionadas en otro entorno:

1. `npm run prisma:migrate:deploy`
2. `npm run prisma:seed`

## Qué queda preparado

- Tres slides hero administrables mediante `MediaAsset` persistida.
- Textos comerciales y CTA persistidos en PostgreSQL.
- Categorías y productos destacados seleccionados desde entidades reales de catálogo local.
- Rutas públicas de categorías, productos y ficha de producto consumiendo exclusivamente el catálogo local.
- Upload directo a R2 o registro manual de assets ya presentes en Cloudflare.
- Reemplazo del fallback por lectura real manteniendo intacta la composición de Home.

## Siguiente evolución natural

El siguiente cambio esperado es añadir filtros y metadata más ricos al catálogo público y después sincronizar este catálogo local con la API externa de productos.
