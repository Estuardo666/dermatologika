import { AdminLoginForm } from "@/features/admin-auth/components/admin-login-form";

export const metadata = {
  title: "Admin Sign In — Dermatologika",
  description: "Ingrese a la administración de Dermatologika",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-canvas">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-headline-lg font-medium text-text-primary">
            Dermatologika
          </h1>
          <p className="text-body-md text-text-secondary">
            Administración
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-surface-canvas rounded-lg border border-border-soft p-8 shadow-sm space-y-6">
          <AdminLoginForm onSuccessRedirect="/admin/leads" />

          {/* Footer */}
          <div className="pt-4 border-t border-border-soft">
            <p className="text-caption text-text-muted text-center">
              Acceso restringido. Se requieren credenciales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
