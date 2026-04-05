"use client";

import { startTransition, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ADMIN_COMPACT_FIELD_CLASS_NAME } from "@/components/admin/form-styles";
import {
  ADMIN_BUTTON_DANGER_CLASS_NAME,
  ADMIN_BUTTON_NEUTRAL_SMALL_CLASS_NAME,
  ADMIN_BUTTON_PRIMARY_CLASS_NAME,
  ADMIN_BUTTON_SECONDARY_CLASS_NAME,
  ADMIN_HERO_SURFACE_CLASS_NAME,
  ADMIN_INSET_CARD_CLASS_NAME,
  ADMIN_PANEL_SURFACE_CLASS_NAME,
} from "@/components/admin/surface-styles";
import { AdminBreadcrumbs } from "@/components/layout/admin-breadcrumbs";
import { ProductBadge } from "@/components/ui/product-badge";
import { cx } from "@/lib/utils";
import {
  createProductBadgePresetClient,
  deleteProductBadgePresetClient,
  updateProductBadgePresetClient,
} from "@/services/admin-catalog/client";
import type {
  AdminProductBadgePresetFormData,
  AdminProductBadgePresetItem,
} from "@/types/admin-catalog";

type SubmissionState = "idle" | "saving" | "success" | "error";

interface BadgePresetAdminPanelProps {
  initialPresets: AdminProductBadgePresetItem[];
  pageMode?: "index" | "create" | "edit";
  initialEditingPresetId?: string | null;
}

function buildEmptyPresetForm(nextSortOrder = 0): AdminProductBadgePresetFormData {
  return {
    label: "",
    color: "#205C4C",
    isActive: true,
    sortOrder: nextSortOrder,
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function sortPresets(presets: AdminProductBadgePresetItem[]) {
  return [...presets].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.label.localeCompare(right.label, "es");
  });
}

export function BadgePresetAdminPanel({
  initialPresets,
  pageMode = "index",
  initialEditingPresetId = null,
}: BadgePresetAdminPanelProps) {
  const router = useRouter();
  const isCreatePage = pageMode === "create";
  const isEditPage = pageMode === "edit";
  const [presets, setPresets] = useState(() => sortPresets(initialPresets));
  const [editingPresetId, setEditingPresetId] = useState<string | null>(initialEditingPresetId);
  const [formData, setFormData] = useState<AdminProductBadgePresetFormData>(() => {
    if (initialEditingPresetId) {
      const preset = initialPresets.find((item) => item.id === initialEditingPresetId) ?? null;
      if (preset) {
        return {
          label: preset.label,
          color: preset.color,
          isActive: preset.isActive,
          sortOrder: preset.sortOrder,
        };
      }
    }

    return buildEmptyPresetForm(initialPresets.length);
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCount = useMemo(() => presets.filter((preset) => preset.isActive).length, [presets]);
  const inactiveCount = presets.length - activeCount;
  const editingPreset = editingPresetId
    ? presets.find((preset) => preset.id === editingPresetId) ?? null
    : null;

  function resetForm() {
    if (isEditPage && editingPreset) {
      setFormData({
        label: editingPreset.label,
        color: editingPreset.color,
        isActive: editingPreset.isActive,
        sortOrder: editingPreset.sortOrder,
      });
      setSubmissionState("idle");
      setFeedbackMessage(null);
      setErrorMessage(null);
      return;
    }

    setEditingPresetId(null);
    setFormData(buildEmptyPresetForm(presets.length));
    setSubmissionState("idle");
    setFeedbackMessage(null);
    setErrorMessage(null);
  }

  function updateField<Key extends keyof AdminProductBadgePresetFormData>(
    key: Key,
    value: AdminProductBadgePresetFormData[Key],
  ) {
    setSubmissionState("idle");
    setFeedbackMessage(null);
    setErrorMessage(null);
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function startEdit(preset: AdminProductBadgePresetItem) {
    if (pageMode === "index") {
      router.push(`/admin/catalog/badges/${preset.id}`);
      return;
    }

    setEditingPresetId(preset.id);
    setFormData({
      label: preset.label,
      color: preset.color,
      isActive: preset.isActive,
      sortOrder: preset.sortOrder,
    });
    setSubmissionState("idle");
    setFeedbackMessage(null);
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("saving");
    setFeedbackMessage(null);
    setErrorMessage(null);

    startTransition(() => {
      void (async () => {
        const preset = editingPresetId
          ? await updateProductBadgePresetClient(editingPresetId, formData)
          : await createProductBadgePresetClient(formData);

        setPresets((current) => sortPresets([preset, ...current.filter((item) => item.id !== preset.id)]));
        setSubmissionState("success");
        setFeedbackMessage(editingPresetId ? "Preset actualizado correctamente." : "Preset creado correctamente.");
        setEditingPresetId(preset.id);
        setFormData({
          label: preset.label,
          color: preset.color,
          isActive: preset.isActive,
          sortOrder: preset.sortOrder,
        });

        if (!editingPresetId) {
          router.push(`/admin/catalog/badges/${preset.id}`);
          router.refresh();
        }
      })().catch((error) => {
        setSubmissionState("error");
        setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el preset.");
      });
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Se eliminara el preset seleccionado. Esta accion no se puede deshacer.")) {
      return;
    }

    setSubmissionState("saving");
    setFeedbackMessage(null);
    setErrorMessage(null);

    startTransition(() => {
      void deleteProductBadgePresetClient(id)
        .then((deletedId) => {
          setPresets((current) => sortPresets(current.filter((item) => item.id !== deletedId)));
          if (editingPresetId === deletedId) {
            if (isEditPage) {
              router.push("/admin/catalog/badges");
              router.refresh();
            } else {
              resetForm();
            }
          } else {
            setSubmissionState("success");
            setFeedbackMessage("Preset eliminado correctamente.");
          }
        })
        .catch((error) => {
          setSubmissionState("error");
          setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar el preset.");
        });
    });
  }

  const editorPanel = (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border-soft pb-5">
        <div className="space-y-2">
          <p className="text-caption uppercase tracking-[0.14em] text-text-muted">Editor</p>
          <h2 className="text-section-lg text-text-primary">{editingPreset ? "Editar preset" : "Nuevo preset"}</h2>
          <p className="text-body-sm text-text-secondary">
            {editingPreset
              ? `Ultima actualizacion: ${formatDate(editingPreset.updatedAt)}`
              : "Define el badge reusable y su color para todo el catalogo."}
          </p>
        </div>

        {(editingPreset || formData.label) ? (
          <button type="button" onClick={resetForm} className={ADMIN_BUTTON_NEUTRAL_SMALL_CLASS_NAME}>
            Limpiar
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="space-y-2 block">
          <span className="block text-label-md text-text-primary">Nombre del preset</span>
          <input
            value={formData.label}
            onChange={(event) => updateField("label", event.target.value)}
            className={ADMIN_COMPACT_FIELD_CLASS_NAME}
            placeholder="Nuevo"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-[132px_minmax(0,1fr)]">
          <label className="space-y-2">
            <span className="block text-label-md text-text-primary">Color</span>
            <input
              type="color"
              value={formData.color}
              onChange={(event) => updateField("color", event.target.value.toUpperCase())}
              className="h-[52px] w-full cursor-pointer rounded-xl border border-border-default bg-surface-canvas p-2"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-label-md text-text-primary">Orden</span>
            <input
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(event) => updateField("sortOrder", Number(event.target.value))}
              className={ADMIN_COMPACT_FIELD_CLASS_NAME}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-border-soft bg-surface-subtle px-4 py-3 text-body-sm text-text-secondary">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(event) => updateField("isActive", event.target.checked)}
            className="h-4 w-4 rounded border-border-default"
          />
          Preset disponible en formularios de producto
        </label>

        <div className={ADMIN_INSET_CARD_CLASS_NAME}>
          <p className="text-label-md text-text-primary">Vista previa</p>
          <div className="mt-3 flex items-center gap-3">
            <ProductBadge label={formData.label.trim() || "Preview"} color={formData.color} />
            <span className="text-body-sm text-text-secondary">{formData.color}</span>
          </div>
        </div>

        {errorMessage ? <p className="text-body-sm text-status-error">{errorMessage}</p> : null}
        {feedbackMessage ? <p className="text-body-sm text-status-success">{feedbackMessage}</p> : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-border-soft pt-5">
          <button type="submit" disabled={submissionState === "saving"} className={ADMIN_BUTTON_PRIMARY_CLASS_NAME}>
            {submissionState === "saving"
              ? "Guardando..."
              : editingPreset
                ? "Actualizar preset"
                : "Crear preset"}
          </button>

          {(editingPreset || formData.label) ? (
            <button type="button" onClick={resetForm} className={ADMIN_BUTTON_SECONDARY_CLASS_NAME}>
              Cancelar
            </button>
          ) : null}

          {editingPreset ? (
            <button type="button" onClick={() => handleDelete(editingPreset.id)} className={ADMIN_BUTTON_DANGER_CLASS_NAME}>
              Eliminar preset
            </button>
          ) : null}
        </div>
      </form>
    </>
  );

  if (isCreatePage || isEditPage) {
    return (
      <div className="space-y-6">
        <section className={ADMIN_HERO_SURFACE_CLASS_NAME}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <AdminBreadcrumbs
                items={[
                  { label: "Admin", href: "/admin/leads" },
                  { label: "Catalogo", href: "/admin/catalog/categories" },
                  { label: "Badges", href: "/admin/catalog/badges" },
                  { label: isCreatePage ? "Nuevo preset" : editingPreset?.label || "Editar preset" },
                ]}
              />
              <p className="text-caption uppercase tracking-[0.14em] text-text-muted">Catalogo</p>
              <h1 className="text-section-lg text-text-primary sm:text-headline-sm">{isCreatePage ? "Nuevo preset" : "Editar preset"}</h1>
              <p className="max-w-2xl text-body-sm text-text-secondary">
                {isCreatePage
                  ? "Crea un badge reusable en una pantalla dedicada para mantener el flujo de catálogo consistente."
                  : "Edita el preset en una pantalla dedicada, sin compartir espacio con el listado."}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link href="/admin/catalog/badges" className={`${ADMIN_BUTTON_SECONDARY_CLASS_NAME} w-full sm:w-auto`}>
                Volver al listado
              </Link>
              <Link href="/admin/catalog/badges/new" className={`${ADMIN_BUTTON_PRIMARY_CLASS_NAME} w-full sm:w-auto`}>
                Nuevo preset
              </Link>
            </div>
          </div>
        </section>

        <section className={ADMIN_PANEL_SURFACE_CLASS_NAME}>{editorPanel}</section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className={ADMIN_HERO_SURFACE_CLASS_NAME}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <AdminBreadcrumbs
              items={[
                { label: "Admin", href: "/admin/leads" },
                { label: "Catalogo", href: "/admin/catalog/categories" },
                { label: "Badges" },
              ]}
            />
            <p className="text-caption uppercase tracking-[0.14em] text-text-muted">Catalogo</p>
            <h1 className="text-section-lg text-text-primary sm:text-headline-sm">Badges globales</h1>
            <p className="max-w-2xl text-body-sm text-text-secondary">
              Gestiona presets reutilizables de badge para el catálogo. Los productos pueden aplicar uno de estos presets y luego ajustarlo si necesitan una excepción editorial.
            </p>
          </div>

          <Link href="/admin/catalog/badges/new" className={ADMIN_BUTTON_PRIMARY_CLASS_NAME}>
            Nuevo preset
          </Link>
        </div>
      </section>

      <section className={`space-y-5 ${ADMIN_PANEL_SURFACE_CLASS_NAME}`}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className={ADMIN_INSET_CARD_CLASS_NAME}>
              <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Total</p>
              <p className="mt-2 text-headline-sm text-text-primary">{presets.length}</p>
              <p className="text-body-sm text-text-secondary">presets registrados</p>
            </div>
            <div className={ADMIN_INSET_CARD_CLASS_NAME}>
              <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Activos</p>
              <p className="mt-2 text-headline-sm text-text-primary">{activeCount}</p>
              <p className="text-body-sm text-text-secondary">disponibles en formularios</p>
            </div>
            <div className={ADMIN_INSET_CARD_CLASS_NAME}>
              <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Inactivos</p>
              <p className="mt-2 text-headline-sm text-text-primary">{inactiveCount}</p>
              <p className="text-body-sm text-text-secondary">ocultos para nuevos usos</p>
            </div>
          </div>

          {presets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-soft bg-surface-subtle p-6 text-body-sm text-text-secondary">
              Todavia no hay presets. Crea el primero para centralizar badges reutilizables.
            </div>
          ) : (
            <div className="rounded-[24px] border border-border-soft bg-surface-subtle">
              <div className="space-y-3 px-3 py-3 md:hidden">
                {presets.map((preset) => (
                  <article key={preset.id} className="rounded-2xl border border-border-soft bg-surface-canvas p-4 shadow-[0_14px_28px_-24px_rgba(28,56,41,0.25)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <ProductBadge label={preset.label} color={preset.color} />
                        <p className="text-body-sm text-text-secondary">Color: {preset.color}</p>
                      </div>
                      <span className={cx("inline-flex rounded-full px-2.5 py-0.5 text-label-sm", preset.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700")}>
                        {preset.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <dl className="mt-4 grid gap-3 text-body-sm text-text-secondary sm:grid-cols-2">
                      <div>
                        <dt className="text-caption uppercase tracking-[0.12em] text-text-muted">Orden</dt>
                        <dd className="mt-1">{preset.sortOrder}</dd>
                      </div>
                      <div>
                        <dt className="text-caption uppercase tracking-[0.12em] text-text-muted">Actualizado</dt>
                        <dd className="mt-1">{formatDate(preset.updatedAt)}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Link href={`/admin/catalog/badges/${preset.id}`} className={`${ADMIN_BUTTON_SECONDARY_CLASS_NAME} w-full sm:w-auto`}>
                        Editar
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-soft text-caption uppercase tracking-[0.12em] text-text-muted">
                      <th className="px-4 py-3 font-medium">Badge</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Color</th>
                      <th className="px-4 py-3 font-medium">Orden</th>
                      <th className="px-4 py-3 font-medium">Actualizado</th>
                      <th className="px-4 py-3 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presets.map((preset) => (
                      <tr key={preset.id} className="border-b border-border-soft/80 bg-surface-canvas transition-colors hover:bg-surface-subtle/60">
                        <td className="px-4 py-4 align-top">
                          <div className="space-y-2">
                            <ProductBadge label={preset.label} color={preset.color} />
                            <p className="text-caption text-text-muted">Creado: {formatDate(preset.createdAt)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className={cx("inline-flex rounded-full px-2.5 py-0.5 text-label-sm", preset.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700")}>
                            {preset.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{preset.color}</td>
                        <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{preset.sortOrder}</td>
                        <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{formatDate(preset.updatedAt)}</td>
                        <td className="px-4 py-4 text-right align-top">
                          <Link href={`/admin/catalog/badges/${preset.id}`} className={ADMIN_BUTTON_SECONDARY_CLASS_NAME}>
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}