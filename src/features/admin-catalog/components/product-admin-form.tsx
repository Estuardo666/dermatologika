"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AdminBreadcrumbs } from "@/components/layout/admin-breadcrumbs";
import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { ProductBadge } from "@/components/ui/product-badge";
import { cx } from "@/lib/utils";
import { DEFAULT_PRODUCT_BADGE_COLOR, PRODUCT_BADGE_PRESETS } from "@/lib/product-badges";
import {
	buildCatalogMediaStorageKey,
	buildProductHref,
	slugifyCatalogName,
} from "@/lib/catalog-slugs";
import { uploadMediaAsset } from "@/services/admin-content/client";
import {
	createProductClient,
	deleteProductClient,
	updateProductClient,
} from "@/services/admin-catalog/client";
import type {
	AdminCatalogEditorData,
	AdminCatalogProductItem,
	AdminProductFormData,
} from "@/types/admin-catalog";
import type { MediaAsset } from "@/types/media";

type SubmissionState = "idle" | "saving" | "success" | "error";

interface ProductAdminFormProps {
	initialData: AdminCatalogEditorData;
	mode: "create" | "edit";
	product?: AdminCatalogProductItem | null;
}

function buildProductForm(
	product?: AdminCatalogProductItem | null,
	categories: AdminCatalogEditorData["categories"] = [],
): AdminProductFormData {
	if (!product) {
		const defaultCategory = categories.find((category) => category.isActive) ?? categories[0];

		return {
			slug: "",
			name: "",
			description: "",
			href: "",
			badge: "",
			badgeColor: "",
			isActive: true,
			categoryId: defaultCategory?.id ?? "",
			mediaAssetId: "",
		};
	}

	return {
		slug: product.slug,
		name: product.name,
		description: product.description,
		href: product.href,
		badge: product.badge ?? "",
		badgeColor: product.badgeColor ?? (product.badge ? DEFAULT_PRODUCT_BADGE_COLOR : ""),
		isActive: product.isActive,
		categoryId: product.categoryId ?? "",
		mediaAssetId: product.mediaAssetId ?? "",
	};
}

function mapMediaAssetSummaryToMediaAsset(
	mediaAsset: AdminCatalogEditorData["mediaAssets"][number] | null,
): MediaAsset | null {
	if (!mediaAsset) {
		return null;
	}

	return {
		id: mediaAsset.id,
		kind: mediaAsset.kind,
		url: mediaAsset.publicUrl,
		storageKey: mediaAsset.storageKey,
		altText: mediaAsset.altText,
		mimeType: mediaAsset.mimeType,
		posterUrl: mediaAsset.posterUrl,
		width: mediaAsset.width ?? null,
		height: mediaAsset.height ?? null,
		durationSeconds: mediaAsset.durationSeconds ?? null,
	};
}

function buildLocalPreviewAsset(input: {
	file: File | null;
	previewUrl: string | null;
	name: string;
}): MediaAsset | null {
	if (!input.file || !input.previewUrl) {
		return null;
	}

	return {
		id: "local-product-preview",
		kind: "image",
		url: input.previewUrl,
		storageKey: null,
		altText: input.name.trim() || input.file.name,
		mimeType: input.file.type || null,
		posterUrl: null,
		width: null,
		height: null,
		durationSeconds: null,
	};
}

function mapProductItemToMediaAsset(product: AdminCatalogProductItem | null): MediaAsset | null {
	if (!product?.mediaAssetId || !product.mediaAssetPublicUrl) {
		return null;
	}

	return {
		id: product.mediaAssetId,
		kind: "image",
		url: product.mediaAssetPublicUrl,
		storageKey: null,
		altText: product.mediaAssetAltText,
		mimeType: null,
		posterUrl: null,
		width: null,
		height: null,
		durationSeconds: null,
	};
}

function formatDate(value: string | null): string {
	if (!value) {
		return "Sin sincronizacion";
	}

	return new Intl.DateTimeFormat("es-ES", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

const adminFieldClassName = "w-full rounded-xl border border-[#c0d4be] bg-[#f8fbf7] px-4 py-3 text-body-md text-text-primary transition-[border-color,box-shadow,background-color] duration-[200ms] ease-soft hover:border-brand-primary hover:bg-[#fbfdfb] active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle";
const adminReadonlyFieldClassName = "w-full rounded-lg border border-[#c0d4be] bg-[#f8fbf7] px-3 py-2 text-caption text-text-secondary sm:text-body-sm";

export function ProductAdminForm({ initialData, mode, product }: ProductAdminFormProps) {
	const router = useRouter();
	const badgePresetOptions =
		initialData.badgePresets.filter((preset) => preset.isActive).length > 0
			? initialData.badgePresets.filter((preset) => preset.isActive)
			: PRODUCT_BADGE_PRESETS.map((preset, index) => ({
				id: `fallback-${preset.label}`,
				label: preset.label,
				color: preset.color,
				isActive: true,
				sortOrder: index,
				createdAt: "",
				updatedAt: "",
			}));
	const [formData, setFormData] = useState<AdminProductFormData>(() =>
		buildProductForm(product, initialData.categories),
	);
	const [persistedProduct, setPersistedProduct] = useState<AdminCatalogProductItem | null>(product ?? null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const [fileInputKey, setFileInputKey] = useState(0);
	const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [savedSnapshot, setSavedSnapshot] = useState(() =>
		JSON.stringify(buildProductForm(product, initialData.categories)),
	);
	const [savedAt, setSavedAt] = useState<string | null>(product?.updatedAt ?? null);
	const selectedMedia = initialData.mediaAssets.find((asset) => asset.id === formData.mediaAssetId) ?? null;
	const previewAsset =
		buildLocalPreviewAsset({
			file: imageFile,
			previewUrl: imagePreviewUrl,
			name: formData.name,
		}) ?? mapMediaAssetSummaryToMediaAsset(selectedMedia) ?? mapProductItemToMediaAsset(persistedProduct);
	const isDirty = savedSnapshot !== JSON.stringify(formData) || Boolean(imageFile);
	const saveStatusLabel =
		submissionState === "saving"
			? "Guardando cambios..."
			: submissionState === "error"
				? "Error al guardar"
				: isDirty
					? "Cambios sin guardar"
					: savedAt
						? `Guardado ${formatDate(savedAt).toLowerCase()}`
						: mode === "create"
							? "Listo para crear"
							: "Sin cambios pendientes";
	const saveStatusTone =
		submissionState === "saving"
			? "border-amber-200 bg-amber-50 text-amber-800"
			: submissionState === "error"
				? "border-status-error/30 bg-status-error/10 text-status-error"
				: isDirty
					? "border-[#f2b27f] bg-[#fff4e8] text-[#b45309]"
					: "border-emerald-200 bg-emerald-50 text-emerald-800";
	const showUnsavedWarning = submissionState !== "saving" && submissionState !== "error" && isDirty;

	useEffect(() => {
		return () => {
			if (imagePreviewUrl) {
				URL.revokeObjectURL(imagePreviewUrl);
			}
		};
	}, [imagePreviewUrl]);

	function markAsDirty() {
		setSubmissionState((current) => (current === "saving" ? current : "idle"));
	}

	function resetPendingImageSelection() {
		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}

		setImageFile(null);
		setImagePreviewUrl(null);
		setFileInputKey((current) => current + 1);
	}

	function updateField<Key extends keyof AdminProductFormData>(key: Key, value: AdminProductFormData[Key]) {
		markAsDirty();
		setFormData((current) => ({ ...current, [key]: value }));
	}

	function updateName(name: string) {
		markAsDirty();
		const slug = slugifyCatalogName(name);
		setFormData((current) => ({
			...current,
			name,
			slug,
			href: slug ? buildProductHref(slug) : "",
		}));
	}

	function applyBadgePreset(label: string, color: string) {
		markAsDirty();
		setFormData((current) => ({
			...current,
			badge: label,
			badgeColor: color,
		}));
	}

	function clearBadge() {
		markAsDirty();
		setFormData((current) => ({
			...current,
			badge: "",
			badgeColor: "",
		}));
	}

	function clearImageSelection(removePersistedAsset = false) {
		markAsDirty();
		resetPendingImageSelection();

		if (removePersistedAsset) {
			updateField("mediaAssetId", "");
		}
	}

	function handleImageChange(file: File | null) {
		markAsDirty();
		resetPendingImageSelection();

		setImageFile(file);
		setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
		setErrorMessage(null);
	}

	async function uploadProductImage(file: File, name: string) {
		const slug = slugifyCatalogName(name);
		if (!slug) {
			throw new Error("El nombre es obligatorio para generar slug, href y la ruta de la imagen.");
		}

		const mediaAsset = await uploadMediaAsset(file, {
			storageKey: buildCatalogMediaStorageKey("products", slug, file.name),
			kind: "image",
			altText: name.trim(),
		});

		return mediaAsset.id;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmissionState("saving");
		setErrorMessage(null);

		try {
			const slug = slugifyCatalogName(formData.name);
			const payload: AdminProductFormData = {
				...formData,
				slug,
				href: slug ? buildProductHref(slug) : "",
				mediaAssetId: formData.mediaAssetId,
			};

			if (imageFile) {
				payload.mediaAssetId = await uploadProductImage(imageFile, formData.name);
			}

			if (mode === "edit" && product) {
				const updated = await updateProductClient(product.id, payload);
				const nextFormData = buildProductForm(updated, initialData.categories);
				setFormData(nextFormData);
				setPersistedProduct(updated);
				setSavedSnapshot(JSON.stringify(nextFormData));
				setSavedAt(updated.updatedAt);
				resetPendingImageSelection();
				setSubmissionState("success");
				router.refresh();
				return;
			}

			const created = await createProductClient(payload);
			router.push(`/admin/catalog/products/${created.id}`);
			router.refresh();
		} catch (error) {
			setSubmissionState("error");
			setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el producto.");
		}
	}

	async function handleDelete() {
		if (!product) {
			return;
		}

		if (!window.confirm("Se eliminara el producto seleccionado. Esta accion no se puede deshacer.")) {
			return;
		}

		setSubmissionState("saving");
		setErrorMessage(null);

		try {
			await deleteProductClient(product.id);
			router.push("/admin/catalog/products");
			router.refresh();
		} catch (error) {
			setSubmissionState("error");
			setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar el producto.");
		}
	}

	return (
		<div className="space-y-6">
			<section className="rounded-[28px] border border-border-soft bg-surface-canvas p-6 shadow-xs sm:p-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div className="space-y-2">
						<AdminBreadcrumbs
							items={[
								{ label: "Admin", href: "/admin/leads" },
								{ label: "Catalogo", href: "/admin/catalog/products" },
								{ label: "Productos", href: "/admin/catalog/products" },
								{ label: mode === "create" ? "Nuevo" : formData.name || "Editar" },
							]}
						/>
						<p className="text-caption uppercase tracking-[0.14em] text-text-muted">Catalogo</p>
						<h1 className="text-section-lg text-text-primary sm:text-headline-sm">{mode === "create" ? "Nuevo producto" : "Editar producto"}</h1>
					</div>

					<div className="w-full max-w-[420px] space-y-2 lg:w-auto lg:min-w-[340px] lg:max-w-none">
						<div className={cx("inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border px-4 py-2 text-center text-label-sm", saveStatusTone)}>
							{showUnsavedWarning ? (
								<svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
									<path fill="currentColor" d="M10 2.5a1.3 1.3 0 0 1 1.14.67l6.8 11.97a1.3 1.3 0 0 1-1.14 1.96H3.2a1.3 1.3 0 0 1-1.14-1.96l6.8-11.97A1.3 1.3 0 0 1 10 2.5Zm0 4.1a.75.75 0 0 0-.75.75v4.1a.75.75 0 0 0 1.5 0v-4.1A.75.75 0 0 0 10 6.6Zm0 8.1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
								</svg>
							) : null}
							<span>{saveStatusLabel}</span>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<Link href="/admin/catalog/products" className="inline-flex min-h-10 items-center justify-center rounded-pill border border-border-default bg-surface-canvas px-4 py-2 text-center text-label-sm text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
								Volver al listado
							</Link>
							<Link href="/admin/catalog/products/new" className="inline-flex min-h-10 items-center justify-center rounded-pill bg-brand-primary px-4 py-2 text-center text-label-sm text-text-inverse shadow-sm transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:bg-emerald-600 active:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
								Nuevo producto
							</Link>
						</div>
					</div>
				</div>
			</section>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px]">
				<section className="rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs sm:p-6">
					<form id="product-form" onSubmit={handleSubmit} className="space-y-6">
						<div className="rounded-2xl bg-surface-subtle p-4">
							<div className="space-y-4">
								<label className="space-y-2 block">
									<span className="block text-label-md text-text-primary">Nombre</span>
									<input value={formData.name} onChange={(event) => updateName(event.target.value)} className={`${adminFieldClassName} rounded-2xl text-section-md font-semibold sm:py-4 sm:text-section-lg`} placeholder="Serum despigmentante" />
								</label>

								<div className="grid gap-3 md:grid-cols-2">
									<label className="space-y-1">
										<span className="block text-caption uppercase tracking-[0.12em] text-text-muted">Slug</span>
										<input value={formData.slug} readOnly className={adminReadonlyFieldClassName} placeholder="Se genera desde el nombre" />
									</label>

									<label className="space-y-1">
										<span className="block text-caption uppercase tracking-[0.12em] text-text-muted">Href</span>
										<input value={formData.href} readOnly className={adminReadonlyFieldClassName} placeholder="Se genera automaticamente" />
									</label>
								</div>
							</div>
						</div>

						<label className="space-y-2 block">
							<span className="block text-label-md text-text-primary">Descripcion</span>
							<textarea value={formData.description} onChange={(event) => updateField("description", event.target.value)} rows={6} className={adminFieldClassName} />
						</label>

						<div className="grid gap-4 md:grid-cols-2">
							<label className="space-y-2">
								<span className="block text-label-md text-text-primary">Categoria</span>
								<select
									value={formData.categoryId}
									onChange={(event) => updateField("categoryId", event.target.value)}
									className={adminFieldClassName}
								>
									<option value="">Selecciona una categoria</option>
									{initialData.categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
							</label>

							<div className="space-y-3 rounded-2xl border border-border-soft bg-surface-subtle p-4">
								<div className="flex items-center justify-between gap-3">
									<span className="block text-label-md text-text-primary">Badge</span>
									{formData.badge ? (
										<button type="button" onClick={clearBadge} className="text-body-sm text-text-secondary underline-offset-4 hover:underline">
											Quitar
										</button>
									) : null}
								</div>
								<div className="flex flex-wrap gap-2">
									{badgePresetOptions.map((preset) => (
										<button
											key={preset.id}
											type="button"
											onClick={() => applyBadgePreset(preset.label, preset.color)}
											className="rounded-full border border-border-soft px-3 py-1.5 text-body-sm text-text-primary transition hover:border-border-brand hover:bg-surface-canvas"
										>
											{preset.label}
										</button>
									))}
								</div>
								<div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_132px]">
									<label className="space-y-2">
										<span className="block text-caption uppercase tracking-[0.12em] text-text-muted">Texto</span>
										<input value={formData.badge} onChange={(event) => updateField("badge", event.target.value)} className={adminFieldClassName} placeholder="Escribe tu badge" />
									</label>
									<label className="space-y-2">
										<span className="block text-caption uppercase tracking-[0.12em] text-text-muted">Color</span>
										<input
											type="color"
											value={formData.badgeColor || DEFAULT_PRODUCT_BADGE_COLOR}
											onChange={(event) => updateField("badgeColor", event.target.value.toUpperCase())}
											className="h-[52px] w-full cursor-pointer rounded-xl border border-[#c0d4be] bg-[#f8fbf7] p-2"
											disabled={!formData.badge}
										/>
									</label>
								</div>
								{formData.badge ? (
									<div className="flex items-center gap-3">
										<span className="text-body-sm text-text-secondary">Vista previa</span>
										<ProductBadge label={formData.badge} color={formData.badgeColor || DEFAULT_PRODUCT_BADGE_COLOR} className="rounded-full border px-3 py-1" />
									</div>
								) : (
									<p className="text-body-sm text-text-secondary">Selecciona un preset o escribe un badge propio y asígnale color.</p>
								)}
							</div>

							<label className="flex items-center gap-3 rounded-2xl border border-border-soft bg-surface-subtle px-4 py-3 text-body-sm text-text-secondary md:self-end">
								<input type="checkbox" checked={formData.isActive} onChange={(event) => updateField("isActive", event.target.checked)} className="h-4 w-4 rounded border-border-default" />
								Producto activo para seleccion publica
							</label>
						</div>

						<div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
							<div className="space-y-3 rounded-2xl border border-border-soft bg-surface-subtle p-4">
								<div className="space-y-2">
									<span className="block text-label-md text-text-primary">Imagen de producto</span>
									<input key={fileInputKey} type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)} className={adminFieldClassName} />
								</div>

								<p className="text-body-sm text-text-secondary">
									{imageFile ? `Pendiente de subida: ${imageFile.name}` : `Imagen actual: ${selectedMedia?.storageKey ?? "Sin media asset"}`}
								</p>

								{(imageFile || formData.mediaAssetId) ? (
									<button type="button" onClick={() => clearImageSelection(true)} className="rounded-xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle">
										Quitar imagen
									</button>
								) : null}
							</div>

							<div className="space-y-2">
								<span className="block text-label-md text-text-primary">Previsualizacion</span>
								<MediaAssetFrame asset={previewAsset} label="Previsualizacion de imagen de producto" minHeightClassName="min-h-[240px]" />
							</div>
						</div>

					</form>
				</section>

				<aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
					<section className="rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs sm:p-6">
						<h2 className="text-section-lg text-text-primary">Estado del producto</h2>
						<div className="mt-4 space-y-3 text-body-sm text-text-secondary">
							<p><span className="text-text-primary">Guardado:</span> {saveStatusLabel}</p>
							<p><span className="text-text-primary">Modo:</span> {mode === "create" ? "Creacion" : "Edicion"}</p>
							<p><span className="text-text-primary">Slug:</span> {formData.slug || "Pendiente"}</p>
							<p><span className="text-text-primary">Href:</span> {formData.href || "Pendiente"}</p>
							<p><span className="text-text-primary">Categoria:</span> {initialData.categories.find((category) => category.id === formData.categoryId)?.name || "Sin categoria"}</p>
							<p><span className="text-text-primary">Estado:</span> {formData.isActive ? "Activo" : "Inactivo"}</p>
							<p><span className="text-text-primary">Badge:</span> {formData.badge || "Sin badge"}</p>
							{formData.badge ? (
								<div className="flex items-center gap-2">
									<span className="text-text-primary">Preview:</span>
									<ProductBadge label={formData.badge} color={formData.badgeColor || DEFAULT_PRODUCT_BADGE_COLOR} className="rounded-full border px-3 py-1" />
								</div>
							) : null}
						</div>

						<div className="mt-5 space-y-2 border-t border-border-soft pt-5">
							{errorMessage ? <p className="mb-2 text-body-sm text-status-error">{errorMessage}</p> : null}
							<button type="submit" form="product-form" disabled={submissionState === "saving"} className="inline-flex w-full min-h-11 items-center justify-center rounded-pill bg-brand-primary px-6 py-3 text-label-md text-text-inverse shadow-sm transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:bg-emerald-600 active:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas disabled:opacity-50">
								{submissionState === "saving" ? "Guardando..." : mode === "edit" ? "Actualizar producto" : "Crear producto"}
							</button>

							<Link href="/admin/catalog/products" className="inline-flex w-full min-h-11 items-center justify-center rounded-pill border border-border-default bg-surface-canvas px-6 py-3 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
								Cancelar
							</Link>

							{mode === "edit" && product ? (
								<button type="button" onClick={handleDelete} className="inline-flex w-full min-h-11 items-center justify-center rounded-pill border border-status-error/30 px-6 py-3 text-label-md text-status-error transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-status-error/50 hover:bg-status-error/10 active:bg-status-error/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
									Eliminar producto
								</button>
							) : null}
						</div>
					</section>

					{product ? (
						<section className="rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs sm:p-6">
							<h2 className="text-section-lg text-text-primary">Contexto</h2>
							<div className="mt-4 space-y-3 text-body-sm text-text-secondary">
								<p>Total de productos: {initialData.products.length}</p>
								<p>Productos activos: {initialData.products.filter((item) => item.isActive).length}</p>
								<p>Ultimo sync: {formatDate(product.lastSyncedAt)}</p>
								<p>Origen: {product.externalSourceId ?? "Local manual"}</p>
							</div>
						</section>
					) : null}
				</aside>
			</div>
		</div>
	);
}