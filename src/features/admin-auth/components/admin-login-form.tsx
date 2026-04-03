"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginInputSchema } from "@/features/auth/schemas/admin-auth.schema";
import { loginAdmin } from "@/services/admin-auth/client";
import type { AdminAuthError } from "@/types/admin-auth";

type FormState = "idle" | "loading" | "success" | "error";

interface AdminLoginFormProps {
  onSuccessRedirect?: string;
}

export function AdminLoginForm({
  onSuccessRedirect = "/admin/leads",
}: AdminLoginFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AdminAuthError | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    setError(null);

    try {
      const validationResult = adminLoginInputSchema.safeParse({
        email,
        password,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.issues?.[0];
        setError({
          code: "VALIDATION_ERROR",
          message: firstError?.message || "Formulario inválido",
        });
        setFormState("error");
        return;
      }

      await loginAdmin(email, password);
      setFormState("success");
      router.push(onSuccessRedirect);
    } catch (err) {
      const adminError = err as AdminAuthError | Error;
      if ("code" in adminError) {
        setError(adminError);
      } else {
        setError({
          code: "SERVER_ERROR",
          message: adminError.message || "An unexpected error occurred",
        });
      }
      setFormState("error");
    }
  }

  const isLoading = formState === "loading";
  const showError = formState === "error" && error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-label-md font-medium text-text-primary"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-md border font-sans text-body-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            showError
              ? "border-status-error focus:ring-status-error"
              : "border-[#c0d4be] hover:border-brand-primary focus:border-brand-primary focus:ring-brand-primary"
          } ${isLoading ? "opacity-50 bg-surface-soft" : "bg-surface-canvas"}`}
          aria-invalid={showError ? true : false}
          aria-describedby={showError ? "error-message" : undefined}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-label-md font-medium text-text-primary"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-md border font-sans text-body-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            showError
              ? "border-status-error focus:ring-status-error"
              : "border-[#c0d4be] hover:border-brand-primary focus:border-brand-primary focus:ring-brand-primary"
          } ${isLoading ? "opacity-50 bg-surface-soft" : "bg-surface-canvas"}`}
          aria-invalid={showError ? true : false}
          aria-describedby={showError ? "error-message" : undefined}
        />
      </div>

      {/* Error Alert */}
      {showError && (
        <div
          id="error-message"
          role="alert"
          className="rounded-md border border-status-error/30 bg-status-error/10 p-3 text-body-sm text-status-error"
        >
          <p className="font-medium">{error?.code === "INVALID_CREDENTIALS" ? "Autenticación fallida" : "Error"}</p>
          <p className="mt-1">{error?.message}</p>
        </div>
      )}

      {/* Success Alert */}
      {formState === "success" && (
        <div
          role="status"
          className="rounded-md border border-status-success/30 bg-status-success/10 p-3 text-body-sm text-status-success"
        >
          <p className="font-medium">Autenticación exitosa</p>
          <p className="mt-1">Redirigiendo...</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className={`w-full rounded-lg px-4 py-3 font-medium text-label-md transition-all ${
          isLoading
            ? "bg-brand-primary/50 text-text-inverse opacity-50 cursor-not-allowed"
            : "bg-brand-primary text-text-inverse hover:bg-brand-primaryHover active:scale-95"
        }`}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-inverse border-t-transparent" />
            Ingresando...
          </span>
        ) : (
          "Ingresar"
        )}
      </button>

      {/* Loading status for screen readers */}
      {isLoading && (
        <div className="sr-only" role="status" aria-live="polite">
          Autenticando...
        </div>
      )}
    </form>
  );
}

