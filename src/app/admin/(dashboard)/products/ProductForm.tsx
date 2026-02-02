'use client';

import { useState, useRef, FormEvent, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Camera,
  FolderOpen,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast/Toast';
import styles from './product-form.module.css';

import type { Category } from '@/types';

interface ProductImage {
  id?: string;
  url: string;
  alt: string;
  order: number;
  isFeatured: boolean;
  fileSize?: number;
}

interface ProductVariation {
  id?: string;
  type: 'color' | 'size' | 'material';
  name: string;
  value: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  images: ProductImage[];
  variations: ProductVariation[];
  isNew: boolean;
  isFeatured: boolean;
  isPublished: boolean;
}

interface ProductFormProps {
  product?: ProductData;
  categories: Category[];
}

function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = !!product;

  // Form state
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [variations, setVariations] = useState<ProductVariation[]>(product?.variations ?? []);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? false);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Section collapse state (images always open, variations collapsed by default)
  const [sectionsOpen, setSectionsOpen] = useState({
    general: true,
    images: true,
    variations: isEdit ? (product?.variations?.length ?? 0) > 0 : false,
    options: true,
  });

  // Refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track unsaved changes — skip the initial mount render
  const initialRenderRef = useRef(true);
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    setHasUnsavedChanges(true);
  }, [name, description, categoryId, images, variations, isNew, isFeatured, isPublished]);

  // Warn on navigation with unsaved changes
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  function toggleSection(key: keyof typeof sectionsOpen) {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ── Image Upload ──────────────────────────────

  async function uploadSingleImage(file: File): Promise<ProductImage | null> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      toast.error('Erreur', json.error || `Échec : ${file.name}`);
      return null;
    }

    return {
      url: json.data.url,
      alt: name || 'Image du produit',
      order: 0, // recomputed after all uploads
      isFeatured: false,
      fileSize: file.size,
    };
  }

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const slotsLeft = 10 - images.length;

    if (slotsLeft <= 0) {
      toast.warning('Limite atteinte', 'Maximum 10 images par produit');
      return;
    }

    const toUpload = fileArray.slice(0, slotsLeft);
    if (fileArray.length > slotsLeft) {
      toast.warning('Limite', `Seules ${slotsLeft} image(s) seront téléchargées`);
    }

    setUploading(true);
    setUploadCount(toUpload.length);

    const CONCURRENCY = 3;
    const results: (ProductImage | null)[] = [];

    // Upload in batches of CONCURRENCY
    for (let i = 0; i < toUpload.length; i += CONCURRENCY) {
      const batch = toUpload.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map((file) => uploadSingleImage(file).catch(() => null)),
      );
      results.push(...batchResults);
    }

    const uploaded = results.filter((r): r is ProductImage => r !== null);

    if (uploaded.length > 0) {
      setImages((prev) => {
        const hasFeatured = prev.some((img) => img.isFeatured);
        const updated = [...prev, ...uploaded].map((img, i) => ({
          ...img,
          order: i,
          isFeatured: !hasFeatured && i === 0 ? true : img.isFeatured,
        }));
        // Ensure exactly one featured if none yet
        if (!updated.some((img) => img.isFeatured) && updated.length > 0) {
          updated[0].isFeatured = true;
        }
        return updated;
      });
    }

    setUploading(false);
    setUploadCount(0);
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
      // If we removed the featured image, make the first one featured
      if (prev[index].isFeatured && next.length > 0) {
        next[0].isFeatured = true;
      }
      return next;
    });
  }

  function setFeaturedImage(index: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isFeatured: i === index })),
    );
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next.map((img, i) => ({ ...img, order: i }));
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }

  // ── Variations ────────────────────────────────

  function addVariation() {
    if (variations.length >= 20) {
      toast.warning('Limite atteinte', 'Maximum 20 variations par produit');
      return;
    }
    setVariations((prev) => [...prev, { type: 'color', name: '', value: '' }]);
    if (!sectionsOpen.variations) {
      setSectionsOpen((prev) => ({ ...prev, variations: true }));
    }
  }

  function updateVariation(index: number, field: keyof ProductVariation, value: string) {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }

  function removeVariation(index: number) {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ────────────────────────────────────

  async function handleSubmit(publishOverride?: boolean) {
    setErrors({});
    const fieldErrors: Record<string, string> = {};

    if (!name || name.length < 2) fieldErrors.name = 'Le nom doit contenir au moins 2 caractères';
    if (!description || description.length < 10) fieldErrors.description = 'La description doit contenir au moins 10 caractères';
    if (!categoryId) fieldErrors.categoryId = 'La catégorie est requise';

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error('Formulaire incomplet', 'Veuillez corriger les erreurs');
      return;
    }

    setSaving(true);

    const publishState = publishOverride !== undefined ? publishOverride : isPublished;

    const payload = {
      name,
      description,
      categoryId,
      isNew,
      isFeatured,
      isPublished: publishState,
      images: images.map((img) => ({
        url: img.url,
        alt: img.alt || name,
        order: img.order,
        isFeatured: img.isFeatured,
      })),
      variations: variations
        .filter((v) => v.name && v.value) // skip empty rows
        .map((v) => ({
          type: v.type,
          name: v.name,
          value: v.value,
        })),
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product!.id}`
        : '/api/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.details) {
          setErrors(json.details);
        }
        toast.error('Erreur', json.error || 'Échec de l\'enregistrement');
        return;
      }

      setHasUnsavedChanges(false);
      toast.success(
        isEdit ? 'Produit mis à jour' : 'Produit créé',
        publishState ? 'Le produit est maintenant publié' : 'Enregistré comme brouillon',
      );
      router.push('/admin/products');
    } catch {
      toast.error('Erreur', 'Impossible de contacter le serveur');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.form}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
          <p className={styles.pageSubtitle}>
            {isEdit
              ? 'Modifiez les informations du produit'
              : 'Remplissez les informations pour créer un nouveau produit'}
          </p>
        </div>

        {/* Section 1: General Info */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('general')}>
            <h2 className={styles.sectionTitle}>Informations générales</h2>
            <ChevronDown
              size={20}
              className={cn(styles.sectionChevron, sectionsOpen.general && styles.sectionChevronOpen)}
            />
          </div>
          {sectionsOpen.general && (
            <div className={styles.sectionBody}>
              <Input
                label="Nom du produit"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Ex: Robinet Mitigeur Cascade Chrome"
              />
              <div className={styles.textareaWrapper}>
                <label className={styles.textareaLabel}>
                  Description
                  <span className={styles.textareaRequired}>*</span>
                </label>
                <textarea
                  className={cn(styles.textarea, errors.description && styles.textareaError)}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le produit en détail..."
                  rows={4}
                />
                {errors.description && (
                  <p className={styles.fieldError}>{errors.description}</p>
                )}
              </div>
              <div className={styles.selectWrapper}>
                <label className={styles.selectLabel}>
                  Catégorie
                  <span className={styles.textareaRequired}>*</span>
                </label>
                <select
                  className={cn(styles.select, errors.categoryId && styles.selectError)}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className={styles.fieldError}>{errors.categoryId}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Images */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('images')}>
            <h2 className={styles.sectionTitle}>
              Images {images.length > 0 && `(${images.length})`}
            </h2>
            <ChevronDown
              size={20}
              className={cn(styles.sectionChevron, sectionsOpen.images && styles.sectionChevronOpen)}
            />
          </div>
          {sectionsOpen.images && (
            <div className={styles.sectionBody}>
              {/* Upload buttons */}
              <div className={styles.uploadButtons}>
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  leftIcon={<Camera size={18} />}
                  disabled={uploading || images.length >= 10}
                >
                  Prendre une photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<FolderOpen size={18} />}
                  disabled={uploading || images.length >= 10}
                >
                  Choisir des fichiers
                </Button>
              </div>

              {/* Hidden inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className={styles.hiddenInput}
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.hiddenInput}
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {/* Drop zone (desktop only) */}
              <div
                className={styles.dropZone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                Glissez vos images ici
              </div>

              {/* Image preview grid */}
              {(images.length > 0 || uploading) && (
                <div className={styles.imageGrid}>
                  {images.map((img, index) => (
                    <div
                      key={`${img.url}-${index}`}
                      className={cn(styles.imageCard, img.isFeatured && styles.imageCardFeatured)}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        width={300}
                        height={300}
                        className={styles.imagePreview}
                      />
                      <div className={styles.imageActions}>
                        <div className={styles.orderButtons}>
                          <button
                            type="button"
                            className={styles.imageActionBtn}
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0}
                            aria-label="Monter"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles.imageActionBtn}
                            onClick={() => moveImage(index, 1)}
                            disabled={index === images.length - 1}
                            aria-label="Descendre"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className={cn(
                            styles.imageActionBtn,
                            styles.imageActionBtnStar,
                            img.isFeatured && styles.imageActionBtnStarActive,
                          )}
                          onClick={() => setFeaturedImage(index)}
                          aria-label={img.isFeatured ? 'Image principale' : 'Définir comme principale'}
                          title={img.isFeatured ? 'Image principale' : 'Définir comme principale'}
                        >
                          <Star size={16} fill={img.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          className={cn(styles.imageActionBtn, styles.imageActionBtnDanger)}
                          onClick={() => removeImage(index)}
                          aria-label="Supprimer l'image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {img.fileSize && (
                        <p className={styles.imageSize}>{formatFileSize(img.fileSize)}</p>
                      )}
                    </div>
                  ))}

                  {/* Upload spinner placeholder */}
                  {uploading && (
                    <div className={styles.imageCard}>
                      <div className={styles.uploadProgress}>
                        <Loader2 size={28} className={styles.spinner} />
                        <span className={styles.uploadCountLabel}>
                          {uploadCount > 1 ? `${uploadCount} images` : 'Téléchargement…'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Variations */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('variations')}>
            <h2 className={styles.sectionTitle}>
              Variations {variations.length > 0 && `(${variations.length})`}
            </h2>
            <ChevronDown
              size={20}
              className={cn(styles.sectionChevron, sectionsOpen.variations && styles.sectionChevronOpen)}
            />
          </div>
          {sectionsOpen.variations && (
            <div className={styles.sectionBody}>
              {variations.length > 0 && (
                <div className={styles.variationList}>
                  {variations.map((variation, index) => (
                    <div key={index} className={styles.variationRow}>
                      <button
                        type="button"
                        className={styles.variationRemove}
                        onClick={() => removeVariation(index)}
                        aria-label="Supprimer la variation"
                      >
                        <X size={16} />
                      </button>
                      <div className={styles.variationFields}>
                        <div>
                          <select
                            className={styles.variationTypeSelect}
                            value={variation.type}
                            onChange={(e) =>
                              updateVariation(index, 'type', e.target.value as ProductVariation['type'])
                            }
                          >
                            <option value="color">Couleur</option>
                            <option value="size">Taille</option>
                            <option value="material">Matériau</option>
                          </select>
                        </div>
                        <Input
                          placeholder="Nom (ex: Blanc Cassé)"
                          value={variation.name}
                          onChange={(e) => updateVariation(index, 'name', e.target.value)}
                        />
                        <div className={styles.valueRow}>
                          <Input
                            placeholder={
                              variation.type === 'color'
                                ? 'Valeur (ex: #F5F5DC)'
                                : variation.type === 'size'
                                  ? 'Valeur (ex: 60x60cm)'
                                  : 'Valeur (ex: Céramique)'
                            }
                            value={variation.value}
                            onChange={(e) => updateVariation(index, 'value', e.target.value)}
                          />
                          {variation.type === 'color' && isHexColor(variation.value) && (
                            <span
                              className={styles.colorSwatch}
                              style={{ backgroundColor: variation.value }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={addVariation}
                disabled={variations.length >= 20}
              >
                Ajouter une variation
              </Button>
            </div>
          )}
        </div>

        {/* Section 4: Options */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('options')}>
            <h2 className={styles.sectionTitle}>Options</h2>
            <ChevronDown
              size={20}
              className={cn(styles.sectionChevron, sectionsOpen.options && styles.sectionChevronOpen)}
            />
          </div>
          {sectionsOpen.options && (
            <div className={styles.sectionBody}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Nouveau</span>
                  <span className={styles.toggleHint}>Affiche le badge &laquo;Nouveau&raquo;</span>
                </div>
                <button
                  type="button"
                  className={cn(styles.toggle, isNew && styles.toggleActive)}
                  onClick={() => setIsNew(!isNew)}
                  role="switch"
                  aria-checked={isNew}
                  aria-label="Marquer comme nouveau"
                />
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>En vedette</span>
                  <span className={styles.toggleHint}>Affiché sur la page d&apos;accueil</span>
                </div>
                <button
                  type="button"
                  className={cn(styles.toggle, isFeatured && styles.toggleActive)}
                  onClick={() => setIsFeatured(!isFeatured)}
                  role="switch"
                  aria-checked={isFeatured}
                  aria-label="Marquer en vedette"
                />
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Publié</span>
                  <span className={styles.toggleHint}>Visible dans le catalogue public</span>
                </div>
                <button
                  type="button"
                  className={cn(styles.toggle, isPublished && styles.toggleActive)}
                  onClick={() => setIsPublished(!isPublished)}
                  role="switch"
                  aria-checked={isPublished}
                  aria-label="Publier le produit"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className={styles.bottomBar}>
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          isLoading={saving}
          loadingText="Enregistrement..."
          disabled={saving}
        >
          Enregistrer comme brouillon
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSubmit(isEdit ? undefined : true)}
          isLoading={saving}
          loadingText="Enregistrement..."
          disabled={saving}
        >
          {isEdit ? 'Mettre à jour' : 'Publier'}
        </Button>
      </div>
    </>
  );
}
