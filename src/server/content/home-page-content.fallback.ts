import "server-only";

import type { HomePageContent } from "@/types/content";

export const fallbackHomePageContent: HomePageContent = {
  hero: {
    slides: [
      {
        id: "hero-slide-clinical",
        announcement: "Nueva estructura pública para campañas, lanzamientos y selección editorial.",
        eyebrow: "Dermatología curada",
        title: "Skincare clínico con estructura storefront y un hero preparado para banners editables.",
        subtitle:
          "La Home pública ahora puede abrir con un slider de campañas visuales sin perder semántica, claridad médica ni separación entre contenido dinámico y presentación reusable.",
        supportingBadge: "Preparado para futuras imágenes de campaña",
        primaryCta: {
          label: "Explorar la selección",
          href: "#featured-products",
        },
        secondaryCta: {
          label: "Ver categorías y necesidades",
          href: "#featured-categories",
        },
        media: null,
      },
      {
        id: "hero-slide-campaign",
        announcement: "Banners modulares para foco comercial, temporada o lanzamientos destacados.",
        eyebrow: "Campaña en portada",
        title: "Un contenedor slider para alternar campañas sin rehacer la Home.",
        subtitle:
          "Cada slide puede cargar su propia imagen, texto y CTA, de modo que el hero funcione como escaparate comercial principal cuando conectemos persistencia real para banners.",
        supportingBadge: "Listo para merchandising visual",
        primaryCta: {
          label: "Ver campaña destacada",
          href: "#featured-campaign",
        },
        secondaryCta: {
          label: "Explorar beneficios",
          href: "#trust-highlights",
        },
        media: null,
      },
      {
        id: "hero-slide-editorial",
        announcement: "Storytelling comercial, contenido experto y navegación editorial en un mismo bloque.",
        eyebrow: "Selección editorial",
        title: "La portada ya puede rotar entre promoción, criterio editorial y necesidades de catálogo.",
        subtitle:
          "Así el hero deja de ser un bloque estático y pasa a comportarse como un sistema de banners cargables desde backend o storage en la siguiente fase.",
        supportingBadge: "Escalable a múltiples banners administrables",
        primaryCta: {
          label: "Ver criterio editorial",
          href: "#editorial-guidance",
        },
        secondaryCta: {
          label: "Descubrir destacados",
          href: "#featured-products",
        },
        media: null,
      },
    ],
    spotlightCards: [
      {
        id: "hero-card-clarity",
        eyebrow: "Selección clínica",
        title: "Rutina de claridad diaria",
        href: "#featured-products",
        media: null,
      },
      {
        id: "hero-card-barrier",
        eyebrow: "Cuidado guiado",
        title: "Soporte para barrera y confort",
        href: "#featured-categories",
        media: null,
      },
      {
        id: "hero-card-editorial",
        eyebrow: "Contenido experto",
        title: "Explora criterio editorial y beneficios",
        href: "#editorial-guidance",
        media: null,
      },
    ],
  },
  featuredCampaign: {
    sectionId: "featured-campaign",
    eyebrow: "Campaña central",
    title: "Un bloque principal para destacar una línea, una historia de temporada o una edición curada.",
    description:
      "Este módulo introduce un ritmo comercial más cercano a un e-commerce editorial: gran foco narrativo, CTA claros y un espacio media reutilizable para banners o storytelling visual.",
    accentText: "Preparado para campañas, bundles o foco estacional",
    primaryCta: {
      label: "Ver productos protagonistas",
      href: "#featured-products",
    },
    secondaryCta: {
      label: "Descubrir el criterio",
      href: "#editorial-guidance",
    },
    media: null,
  },
  featuredProducts: {
    sectionId: "featured-products",
    eyebrow: "Selección protagonista",
    title: "Una primera shelf para novedades, hero products o paquetes con prioridad comercial.",
    description:
      "La sección conserva contratos tipados y media administrable para conectar merchandising real más adelante sin tocar el layout.",
    cta: {
      label: "Ir al cierre comercial",
      href: "#contact-cta",
    },
    items: [
      {
        id: "product-clarity",
        name: "Rutina de claridad diaria",
        description: "Ejemplo de ficha editorial para una selección destacada con prioridad de exposición.",
        href: "#contact-cta",
        badge: "Destacado",
        price: 65,
        discountPrice: null,
        category: {
          id: "daily-protection",
          slug: "daily-protection",
          name: "Protección diaria",
          href: "#contact-cta",
        },
        media: null,
      },
      {
        id: "product-balance",
        name: "Balance hidratante",
        description: "Preparado para renderizar imagen principal, texto breve y etiqueta comercial desde backend.",
        href: "#contact-cta",
        badge: "Más consultado",
        price: 63.15,
        discountPrice: null,
        category: {
          id: "barrier-support",
          slug: "barrier-support",
          name: "Reparación de barrera",
          href: "#contact-cta",
        },
        media: null,
      },
      {
        id: "product-renewal",
        name: "Renovación nocturna",
        description: "Contrato listo para sincronizar merchandising, badges y media administrable.",
        href: "#contact-cta",
        badge: "Edición curada",
        price: 61.3,
        discountPrice: 57.9,
        category: {
          id: "post-procedure",
          slug: "post-procedure",
          name: "Cuidado post procedimiento",
          href: "#contact-cta",
        },
        media: null,
      },
    ],
  },
  routinePromo: {
    sectionId: "routine-promo",
    eyebrow: "Rutina y continuidad",
    title: "Una segunda banda promocional para sostener narrativa, educación comercial o reposición.",
    description:
      "Entre shelves, la Home puede insertar módulos de campaña más compactos para mantener ritmo, profundidad y variedad sin caer en una página monolítica.",
    accentText: "Ideal para bundles, campañas de necesidad o promos temporales",
    primaryCta: {
      label: "Ver necesidades",
      href: "#featured-categories",
    },
    secondaryCta: {
      label: "Consultar enfoque",
      href: "#trust-highlights",
    },
    media: null,
  },
  featuredCategories: {
    sectionId: "featured-categories",
    eyebrow: "Categorías y necesidades",
    title: "Bloques de navegación listos para ordenar el catálogo por intención, necesidad o rutina.",
    description:
      "Cada tarjeta ya consume un contrato tipado con nombre, resumen, destino y media administrable desde storage o base de datos, preparado para backend real.",
    cta: {
      label: "Necesito orientación",
      href: "#contact-cta",
    },
    items: [
      {
        id: "cleansers",
        name: "Limpieza clínica",
        description: "Rutinas de limpieza suave para piel sensible, grasa o sensibilizada.",
        href: "#contact-cta",
        media: null,
      },
      {
        id: "barrier-support",
        name: "Reparación de barrera",
        description: "Fórmulas orientadas a confort, equilibrio y recuperación visible.",
        href: "#contact-cta",
        media: null,
      },
      {
        id: "daily-protection",
        name: "Protección diaria",
        description: "Protección y mantenimiento diario dentro de una rutina constante.",
        href: "#contact-cta",
        media: null,
      },
      {
        id: "post-procedure",
        name: "Cuidado post procedimiento",
        description: "Una celda adicional para escalar a un grid más propio de storefront sin rehacer el componente.",
        href: "#contact-cta",
        media: null,
      },
    ],
  },
  routineProducts: {
    sectionId: "routine-products",
    eyebrow: "Segunda selección",
    title: "Otra shelf para reposición, mantenimiento o combinaciones por objetivo.",
    description:
      "El storefront ahora admite repetir el patrón de producto con otro enfoque editorial, otro criterio de merchandising y otro punto de entrada comercial.",
    cta: {
      label: "Ver apoyo editorial",
      href: "#editorial-guidance",
    },
    items: [
      {
        id: "routine-recovery",
        name: "Recuperación y confort",
        description: "Una segunda shelf puede combinar recuperación, calma y continuidad dentro del mismo contrato visual.",
        href: "#contact-cta",
        badge: "Rutina guiada",
        price: 59.44,
        discountPrice: null,
        category: {
          id: "barrier-support",
          slug: "barrier-support",
          name: "Reparación de barrera",
          href: "#contact-cta",
        },
        media: null,
      },
      {
        id: "routine-defense",
        name: "Defensa diaria",
        description: "Preparado para renderizar cards de continuidad, packs o sugerencias por franja de uso.",
        href: "#contact-cta",
        badge: "Reposición",
        price: 57.59,
        discountPrice: null,
        category: {
          id: "daily-protection",
          slug: "daily-protection",
          name: "Protección diaria",
          href: "#contact-cta",
        },
        media: null,
      },
      {
        id: "routine-night",
        name: "Soporte nocturno",
        description: "El mismo módulo puede conectarse después a recomendaciones dinámicas o catálogos reales.",
        href: "#contact-cta",
        badge: "Noche",
        price: 54.9,
        discountPrice: 49.9,
        category: {
          id: "cleansers",
          slug: "cleansers",
          name: "Limpieza clínica",
          href: "#contact-cta",
        },
        media: null,
      },
    ],
  },
  editorial: {
    sectionId: "editorial-guidance",
    eyebrow: "Criterio editorial",
    title: "Un bloque split para introducir confianza, acompañamiento y contenido experto sin romper la maquetación comercial.",
    description:
      "Este módulo mezcla copy largo, acciones claras y una lista de apoyos breves para acercar la Home a un storefront más maduro y escalable.",
    accentText: "Pensado para conectar guías, contenido experto y media administrable",
    primaryCta: {
      label: "Ver beneficios",
      href: "#trust-highlights",
    },
    secondaryCta: {
      label: "Ir al cierre",
      href: "#contact-cta",
    },
    media: null,
    items: [
      {
        id: "editorial-1",
        title: "Arquitectura reusable",
        description: "La Home se amplía con secciones pequeñas, no con un archivo gigante imposible de mantener.",
      },
      {
        id: "editorial-2",
        title: "Contenido intercambiable",
        description: "Cada bloque puede recibir texto, destinos y media desde servidor sin reescribir la presentación.",
      },
      {
        id: "editorial-3",
        title: "Escala e-commerce",
        description: "La composición ya admite más campañas, shelves y enlaces de navegación sin rehacer la base pública.",
      },
    ],
  },
  trustHighlights: {
    sectionId: "trust-highlights",
    eyebrow: "Confianza y método",
    title: "Una base pública pensada para claridad médica, orden comercial y evolución continua.",
    description:
      "La estructura nueva mantiene separación semántica, modularidad y una jerarquía más rica para crecer hacia un storefront real.",
    items: [
      {
        id: "typed-content",
        title: "Contenido tipado",
        description: "Textos comerciales y CTA salen de un contrato central que luego podrá persistirse en base de datos.",
      },
      {
        id: "media-ready",
        title: "Media administrable",
        description: "Hero images, videos y assets de cards quedan preparados para resolverse desde storage sin tocar la UI.",
      },
      {
        id: "server-boundary",
        title: "Lectura server-side",
        description: "La Home obtiene el contenido desde servicios y server modules, no desde hardcode disperso en componentes.",
      },
    ],
  },
  cta: {
    sectionId: "contact-cta",
    eyebrow: "Siguiente fase",
    title: "Listo para conectar campañas, categorías, productos y páginas públicas reales.",
    description:
      "La nueva Home ya soporta banners, shelves, grids editoriales, media administrable y contenido comercial editable sin rehacer el storefront.",
    primaryCta: {
      label: "Preparar siguientes módulos",
      href: "#featured-categories",
    },
    secondaryCta: {
      label: "Acceso administración",
      href: "/admin/login",
    },
  },
};
