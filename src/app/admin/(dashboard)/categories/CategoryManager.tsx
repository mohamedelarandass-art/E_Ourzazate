'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/Toast';
import type { AdminRole } from '@/types';
import styles from './categories.module.css';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  _count: { products: number };
}

interface CategoryManagerProps {
  initialCategories: CategoryItem[];
  userRole: AdminRole;
}

export default function CategoryManager({ initialCategories, userRole }: CategoryManagerProps) {
  const toast = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Lock ref to prevent concurrent reorder operations (I-3 fix)
  const reorderingRef = useRef(false);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('📦');
  const [newIsActive, setNewIsActive] = useState(true);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const canEdit = userRole === 'owner' || userRole === 'manager';
  const canDelete = userRole === 'owner';

  const resetAddForm = () => {
    setNewName('');
    setNewDescription('');
    setNewIcon('📦');
    setNewIsActive(true);
  };

  const handleCreate = useCallback(async () => {
    if (!newName.trim() || !newDescription.trim()) {
      toast.error('Champs requis', 'Le nom et la description sont obligatoires.');
      return;
    }
    if (newDescription.trim().length < 10) {
      toast.error('Description trop courte', 'La description doit contenir au moins 10 caracteres.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim(),
          icon: newIcon.trim() || '📦',
          isActive: newIsActive,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error('Erreur', json.error || 'Impossible de creer la categorie.');
        return;
      }

      setCategories((prev) => [
        ...prev,
        { ...json.data, _count: { products: 0 } },
      ]);
      resetAddForm();
      setShowAddForm(false);
      toast.success('Categorie creee', `"${json.data.name}" a ete ajoutee.`);
    } catch {
      toast.error('Erreur', 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }, [newName, newDescription, newIcon, newIsActive, toast]);

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description);
    setEditIcon(cat.icon);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = useCallback(async (id: string) => {
    if (!editName.trim() || !editDescription.trim()) {
      toast.error('Champs requis', 'Le nom et la description sont obligatoires.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
          icon: editIcon.trim() || '📦',
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error('Erreur', json.error || 'Impossible de mettre a jour.');
        return;
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, name: json.data.name, slug: json.data.slug, description: json.data.description, icon: json.data.icon }
            : c,
        ),
      );
      setEditingId(null);
      toast.success('Categorie mise a jour');
    } catch {
      toast.error('Erreur', 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }, [editName, editDescription, editIcon, toast]);

  const handleToggleActive = useCallback(async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error('Erreur', json.error || 'Impossible de modifier le statut.');
        return;
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !currentActive } : c)),
      );
      toast.success(!currentActive ? 'Categorie activee' : 'Categorie desactivee');
    } catch {
      toast.error('Erreur', 'Une erreur est survenue.');
    }
  }, [toast]);

  const handleReorder = useCallback(async (id: string, direction: 'up' | 'down') => {
    // Prevent concurrent reorders (I-3 fix: lock ref)
    if (reorderingRef.current) return;
    reorderingRef.current = true;

    // Capture swap values before optimistic update using functional updater (I-3 fix)
    let currentId = '';
    let targetId = '';
    let currentOrder = 0;
    let targetOrder = 0;

    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;

      const current = prev[idx];
      const target = prev[swapIdx];

      // Save for the API calls
      currentId = current.id;
      targetId = target.id;
      currentOrder = current.order;
      targetOrder = target.order;

      // Swap order values and re-sort
      const updated = [...prev];
      updated[idx] = { ...target, order: current.order };
      updated[swapIdx] = { ...current, order: target.order };
      updated.sort((a, b) => a.order - b.order);
      return updated;
    });

    // If no swap was possible, release lock
    if (!currentId || !targetId) {
      reorderingRef.current = false;
      return;
    }

    try {
      await Promise.all([
        fetch(`/api/admin/categories/${currentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetOrder }),
        }),
        fetch(`/api/admin/categories/${targetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);
    } catch {
      // Revert using functional updater so we don't clobber concurrent state (I-3 fix)
      setCategories((prev) => {
        const updated = [...prev];
        const currentIdx = updated.findIndex((c) => c.id === currentId);
        const targetIdx = updated.findIndex((c) => c.id === targetId);
        if (currentIdx !== -1) updated[currentIdx] = { ...updated[currentIdx], order: currentOrder };
        if (targetIdx !== -1) updated[targetIdx] = { ...updated[targetIdx], order: targetOrder };
        updated.sort((a, b) => a.order - b.order);
        return updated;
      });
      toast.error('Erreur', 'Impossible de reorganiser.');
    } finally {
      reorderingRef.current = false;
    }
  }, [toast]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Supprimer la categorie "${name}" ?`)) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error('Erreur', json.error || 'Impossible de supprimer.');
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Categorie supprimee', `"${name}" a ete supprimee.`);
    } catch {
      toast.error('Erreur', 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }, [toast]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <h1 className={styles.pageTitle}>Categories</h1>
          {canEdit && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setShowAddForm((v) => !v)}
            >
              Ajouter
            </Button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {canEdit && showAddForm && (
        <div className={styles.addSection}>
          <div className={styles.addSectionBody}>
            <div className={styles.addFormRow}>
              <Input
                label="Nom"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom de la categorie"
              />
              <Input
                label="Icone (emoji)"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="📦"
              />
            </div>
            <div>
              <label className={styles.toggleLabel}>Description</label>
              <textarea
                className={styles.editTextarea}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description de la categorie (min. 10 caracteres)"
                rows={3}
              />
            </div>
            <div className={styles.toggleRow}>
              <button
                type="button"
                role="switch"
                aria-checked={newIsActive}
                className={`${styles.toggle} ${newIsActive ? styles.toggleActive : ''}`}
                onClick={() => setNewIsActive((v) => !v)}
              />
              <span className={styles.toggleLabel}>
                {newIsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className={styles.addFormActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { resetAddForm(); setShowAddForm(false); }}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreate}
                isLoading={saving}
                loadingText="Creation..."
              >
                Creer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className={styles.section}>
        {categories.length === 0 ? (
          <div className={styles.empty}>
            <FolderOpen size={48} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Aucune categorie</p>
            <p className={styles.emptyText}>Ajoutez votre premiere categorie pour commencer.</p>
          </div>
        ) : (
          categories.map((cat, idx) =>
            editingId === cat.id ? (
              /* Inline edit mode */
              <div key={cat.id} className={styles.editRow}>
                <div className={styles.editFields}>
                  <div className={styles.editFieldsRow}>
                    <Input
                      label="Nom"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <Input
                      label="Icone"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.toggleLabel}>Description</label>
                    <textarea
                      className={styles.editTextarea}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
                <div className={styles.editActions}>
                  <Button variant="ghost" size="sm" onClick={cancelEdit} leftIcon={<X size={16} />}>
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdate(cat.id)}
                    isLoading={saving}
                    loadingText="Enregistrement..."
                    leftIcon={<Check size={16} />}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              /* Normal row */
              <div key={cat.id} className={styles.categoryRow}>
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <div className={styles.categoryInfo}>
                  <p className={styles.categoryName}>{cat.name}</p>
                  <p className={styles.categorySlug}>/{cat.slug}</p>
                  <div className={styles.categoryMeta}>
                    <Badge variant={cat._count.products > 0 ? 'primary' : 'default'} size="sm">
                      {cat._count.products} produit{cat._count.products !== 1 ? 's' : ''}
                    </Badge>
                    {!cat.isActive && (
                      <Badge variant="warning" size="sm">Inactive</Badge>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <div className={styles.orderButtons}>
                    <button
                      className={styles.orderButton}
                      onClick={() => handleReorder(cat.id, 'up')}
                      disabled={idx === 0}
                      title="Monter"
                      aria-label="Monter"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      className={styles.orderButton}
                      onClick={() => handleReorder(cat.id, 'down')}
                      disabled={idx === categories.length - 1}
                      title="Descendre"
                      aria-label="Descendre"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}

                {canEdit && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={cat.isActive}
                    className={`${styles.toggle} ${cat.isActive ? styles.toggleActive : ''}`}
                    onClick={() => handleToggleActive(cat.id, cat.isActive)}
                    title={cat.isActive ? 'Desactiver' : 'Activer'}
                  />
                )}

                <div className={styles.actions}>
                  {canEdit && (
                    <button
                      className={styles.actionButton}
                      onClick={() => startEdit(cat)}
                      title="Modifier"
                      aria-label="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={cat._count.products > 0}
                      title={cat._count.products > 0 ? 'Contient des produits' : 'Supprimer'}
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
