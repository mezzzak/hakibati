'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/language-provider';
import { getAllProducts, createProduct, updateProduct, deleteProduct, uploadProductsCSV, downloadProductsCSV } from '@/lib/admin-actions';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { formatDZD } from '@/lib/utils';
import { Plus, Pencil, Trash2, Package, Upload, Download, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductFormData {
  id?: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  brand: string;
  category: string;
  unitPriceDZD: number;
  costPriceDZD: number;
  retailPriceDZD: number;
  stockQuantity: number;
  imageUrl: string;
  isActive?: boolean;
}

const emptyForm: ProductFormData = {
  nameAr: '',
  nameFr: '',
  descriptionAr: '',
  descriptionFr: '',
  brand: '',
  category: '',
  unitPriceDZD: 0,
  costPriceDZD: 0,
  retailPriceDZD: 0,
  stockQuantity: 0,
  imageUrl: '',
};

const categories = ['cahiers', 'stylos', 'geometrie', 'arts', 'cartables', 'accessoires', 'electronique'];

export default function AdminProductsPage() {
  const { t, isAr } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProductFormData | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.products || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({
      id: product.id,
      nameAr: product.nameAr,
      nameFr: product.nameFr || '',
      descriptionAr: product.descriptionAr || '',
      descriptionFr: product.descriptionFr || '',
      brand: product.brand || '',
      category: product.category,
      unitPriceDZD: product.unitPriceDZD,
      costPriceDZD: product.costPriceDZD ?? 0,
      retailPriceDZD: product.retailPriceDZD ?? 0,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editing?.id) {
      await updateProduct(editing.id, {
        nameAr: form.nameAr,
        nameFr: form.nameFr || undefined,
        descriptionAr: form.descriptionAr || undefined,
        descriptionFr: form.descriptionFr || undefined,
        brand: form.brand || undefined,
        category: form.category,
        unitPriceDZD: form.unitPriceDZD,
        costPriceDZD: form.costPriceDZD,
        retailPriceDZD: form.retailPriceDZD,
        stockQuantity: form.stockQuantity,
        imageUrl: form.imageUrl || undefined,
      });
    } else {
      await createProduct({
        nameAr: form.nameAr,
        nameFr: form.nameFr || undefined,
        descriptionAr: form.descriptionAr || undefined,
        descriptionFr: form.descriptionFr || undefined,
        brand: form.brand || undefined,
        category: form.category,
        unitPriceDZD: form.unitPriceDZD,
        costPriceDZD: form.costPriceDZD,
        retailPriceDZD: form.retailPriceDZD,
        stockQuantity: form.stockQuantity,
        imageUrl: form.imageUrl || undefined,
      });
    }

    setSaving(false);
    setDrawerOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من حذف هذا المنتج؟', 'Êtes-vous sûr de vouloir supprimer ce produit ?'))) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText((ev.target?.result as string) || '');
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!csvText.trim()) return;
    setUploading(true);
    setUploadResult(null);
    const result = await uploadProductsCSV(csvText);
    setUploading(false);
    setUploadResult(result);
    if (result.success) {
      fetchProducts();
    }
  };

  const handleDownload = async () => {
    const result = await downloadProductsCSV();
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('المنتجات', 'Produits')}</h1>
          <p className="text-muted-foreground text-sm">{t('إدارة قطع القرطاسية', 'Gérer les articles de papeterie')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { setUploadOpen(true); setCsvText(''); setUploadResult(null); }} className="gap-2">
            <Upload className="h-4 w-4" />
            {t('رفع CSV', 'Importer CSV')}
          </Button>
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            {t('تحميل CSV', 'Exporter CSV')}
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('منتج جديد', 'Nouveau produit')}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t('لا توجد منتجات', 'Aucun produit')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('المنتج', 'Produit')}</th>
                  <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('الفئة', 'Catégorie')}</th>
                  <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('السعر', 'Prix')}</th>
                  <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('المخزون', 'Stock')}</th>
                  <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('الحالة', 'Statut')}</th>
                  <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{product.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{product.nameFr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">{formatDZD(product.unitPriceDZD, isAr ? 'ar-DZ' : 'fr-DZ')}</td>
                    <td className="px-4 py-3">{product.stockQuantity}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? t('نشط', 'Actif') : t('غير نشط', 'Inactif')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(product)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload CSV Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setUploadOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t('رفع منتجات من CSV', 'Importer des produits depuis CSV')}
              </h2>
              <button onClick={() => setUploadOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-bold">{t('تنسيق الملف المطلوب:', 'Format de fichier requis :')}</p>
                <p>{t('الأعمدة:', 'Colonnes :')} id, nameAr, nameFr, descriptionAr, descriptionFr, brand, category, unitPriceDZD, costPriceDZD, retailPriceDZD, stockQuantity, imageUrl, isActive</p>
                <p>{t('الأعمدة المطلوبة:', 'Colonnes obligatoires :')} nameAr, category, unitPriceDZD</p>
                <p>{t('إذا وُجد id، سيتم تحديث المنتج الموجود. إذا تركته فارغاً، سيتم إنشاء منتج جديد.', 'Si l\'id existe, le produit sera mis à jour. Sinon, un nouveau produit sera créé.')}</p>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              />

              <textarea
                rows={6}
                dir="ltr"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={t('أو الصق محتوى CSV هنا...', 'Ou collez le contenu CSV ici...')}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-xs font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />

              {uploadResult && (
                <div className={`rounded-lg p-3 text-sm space-y-1 ${uploadResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                  {uploadResult.success ? (
                    <>
                      <p className="flex items-center gap-1.5 font-bold"><CheckCircle2 className="h-4 w-4" />{t('تم الرفع بنجاح!', 'Import réussi !')}</p>
                      <p>{t('تم إنشاء:', 'Créés :')} {uploadResult.results?.created || 0} {t('منتج', 'produit')}{(uploadResult.results?.created || 0) !== 1 ? 's' : ''}</p>
                      <p>{t('تم تحديث:', 'Mis à jour :')} {uploadResult.results?.updated || 0}</p>
                      <p>{t('تم تخطيه:', 'Ignorés :')} {uploadResult.results?.skipped || 0}</p>
                      {uploadResult.results?.errors?.length > 0 && (
                        <div className="mt-2 max-h-32 overflow-y-auto space-y-0.5 text-xs">
                          {uploadResult.results.errors.map((err: string, i: number) => (
                            <p key={i} className="flex items-start gap-1"><AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />{err}</p>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="flex items-center gap-1.5"><AlertCircle className="h-4 w-4" />{uploadResult.error}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}>{t('إلغاء', 'Annuler')}</Button>
                <Button size="sm" onClick={handleUpload} disabled={uploading || !csvText.trim()}>
                  {uploading ? t('جارٍ الرفع...', 'Import en cours...') : t('رفع الملف', 'Importer')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <Sheet
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editing ? t('تعديل منتج', 'Modifier le produit') : t('منتج جديد', 'Nouveau produit')}
        side="right"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الاسم (عربي)', 'Nom (arabe)')} *</label>
            <input required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الاسم (فرنسي)', 'Nom (français)')}</label>
            <input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الفئة', 'Catégorie')} *</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">{t('اختر الفئة', 'Choisir une catégorie')}</option>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('العلامة التجارية', 'Marque')}</label>
            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('السعر (د.ج)', 'Prix (DZD)')} *</label>
              <input type="number" required min={0} value={form.unitPriceDZD} onChange={(e) => setForm({ ...form, unitPriceDZD: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('المخزون', 'Stock')} *</label>
              <input type="number" required min={0} value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('سعر التكلفة (د.ج)', 'Coût (DZD)')}</label>
              <input type="number" min={0} value={form.costPriceDZD} onChange={(e) => setForm({ ...form, costPriceDZD: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('سعر المفرق (د.ج)', 'Prix de détail (DZD)')}</label>
              <input type="number" min={0} value={form.retailPriceDZD} onChange={(e) => setForm({ ...form, retailPriceDZD: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الوصف (عربي)', 'Description (arabe)')}</label>
            <textarea rows={2} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الوصف (فرنسي)', 'Description (français)')}</label>
            <textarea rows={2} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('رابط الصورة', 'Lien de l\'image')}</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? t('جار الحفظ...', 'Enregistrement...') : editing ? t('حفظ التعديلات', 'Enregistrer les modifications') : t('إضافة المنتج', 'Ajouter le produit')}
          </Button>
        </form>
      </Sheet>
    </div>
  );
}
