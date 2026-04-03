import Link from "next/link";

const footerLinks = [
  { href: "/categorias", label: "Categorias" },
  { href: "/productos", label: "Productos" },
  { href: "/#trust-highlights", label: "Beneficios" },
  { href: "/admin/login", label: "Administración" },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-border-soft bg-surface-canvas">
      <div className="container grid gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="space-y-4">
          <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
            Base pública
          </span>
          <div className="space-y-3">
            <h2 className="text-section-xl text-text-primary">Dermatologika</h2>
            <p className="max-w-prose text-body-md text-text-secondary">
              Storefront inicial preparado para renderizar contenido comercial, media y merchandising desde contratos tipados conectables a backend.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
          <div className="space-y-3">
            <h3 className="text-label-md uppercase tracking-[0.14em] text-text-muted">
              Explorar
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-label-md uppercase tracking-[0.14em] text-text-muted">
              Estado
            </h3>
            <p className="text-body-sm text-text-secondary">
              Home, layout y secciones públicas listas para pasar de fallback tipado a contenido persistido sin reescribir los componentes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
