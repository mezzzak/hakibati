'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/language-provider';
import { getAllPacksAdmin, createPack, updatePack, deletePack, uploadPacksCSV, downloadPacksCSV } from '@/lib/admin-actions';
import { getAllProducts } from '@/lib/admin-actions';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { formatDZD } from '@/lib/utils';
import { Plus, Pencil, Trash2, Boxes, Minus, Plus as PlusIcon, Upload, Download, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface PackItemInput {
  supplyItemId: string;
  quantity: number;
  isOptional: boolean;
  nameAr?: string;
}

interface PackFormData {
  id?: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  gradeLevel: string;
  basePriceDZD: number;
  discountPercent: number;
  imageUrl: string;
  items: PackItemInput[];
}

const emptyForm: PackFormData = {
  nameAr: '',
  nameFr: '',
  descriptionAr: '',
  descriptionFr: '',
  gradeLevel: 'AP1',
  basePriceDZD: 0,
  discountPercent: 0,
  imageUrl: '',
  items: [],
};

const gradeLevels = [
  { value: 'AP1', label: '1AP' },
  { value: 'AP2', label: '2AP' },
  { value: 'AP3', label: '3AP' },
  { value: 'AP4', label: '4AP' },
  { value: 'AP5', label: '5AP' },
  { value: 'AM1', label: '1AM' },
  { value: 'AM2', label: '2AM' },
  { value: 'AM3', label: '3AM' },
  { value: 'AM4', label: '4AM' },
  { value: 'AS1', label: '1AS' },
  { value: 'AS2', label: '2AS' },
  { value: 'AS3', label: '3AS' },
  { value: 'CUSTOM', labelAr: 'مخصص', labelFr: 'Personnalisé' },
];

export default function AdminPacksPage() {
  const { t, isAr } = useLanguage();
  const [packs, setPacks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PackFormData | null>(null);
  const [form, setForm] = useState<PackFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [packsResult, productsResult] = await Promise.all([
      getAllPacksAdmin(),
      getAllProducts(),
    ]);
    if (packsResult.success) setPacks(packsResult.packs || []);
    if (productsResult.success) setProducts(productsResult.products || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (pack: any) => {
    setEditing(pack);
    setForm({
      id: pack.id,
      nameAr: pack.nameAr,
      nameFr: pack.nameFr || '',
      descriptionAr: pack.descriptionAr || '',
      descriptionFr: pack.descriptionFr || '',
      gradeLevel: pack.gradeLevel,
      basePriceDZD: pack.basePriceDZD,
      discountPercent: pack.discountPercent,
      imageUrl: pack.imageUrl || '',
      items: pack.items.map((i: any) => ({
        supplyItemId: i.supplyItemId,
        quantity: i.quantity,
        isOptional: i.isOptional ?? false,
        nameAr: i.supplyItem?.nameAr,
      })),
    });
    setDrawerOpen(true);
  };

  const addItem = (productId: string) => {
    const existing = form.items.find((i) => i.supplyItemId === productId);
    if (existing) return;
    const product = products.find((p) => p.id === productId);
    setForm({
      ...form,
      items: [...form.items, { supplyItemId: productId, quantity: 1, isOptional: false, nameAr: product?.nameAr }],
    });
  };

  const toggleItemOptional = (productId: string) => {
    setForm({
      ...form,
      items: form.items.map((i) =>
        i.supplyItemId === productId ? { ...i, isOptional: !i.isOptional } : i
      ),
    });
  };

  const updateItemQty = (productId: string, delta: number) => {
    setForm({
      ...form,
      items: form.items.map((i) =>
        i.supplyItemId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      ),
    });
  };

  const removeItem = (productId: string) => {
    setForm({ ...form, items: form.items.filter((i) => i.supplyItemId !== productId) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.items.length === 0) {
      alert(t('يجب إضافة عنصر واحد على الأقل', 'Vous devez ajouter au moins un élément'));
      return;
    }
    setSaving(true);

    const payload = {
      nameAr: form.nameAr,
      nameFr: form.nameFr || undefined,
      descriptionAr: form.descriptionAr || undefined,
      descriptionFr: form.descriptionFr || undefined,
      gradeLevel: form.gradeLevel,
      basePriceDZD: form.basePriceDZD,
      discountPercent: form.discountPercent,
      imageUrl: form.imageUrl || undefined,
      items: form.items.map((i) => ({ supplyItemId: i.supplyItemId, quantity: i.quantity, isOptional: i.isOptional })),
    };

    if (editing?.id) {
      await updatePack(editing.id, payload);
    } else {
      await createPack(payload);
    }

    setSaving(false);
    setDrawerOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من حذف هذه الحقيبة؟', 'Êtes-vous sûr de vouloir supprimer ce pack ?'))) return;
    await deletePack(id);
    fetchData();
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
    const result = await uploadPacksCSV(csvText);
    setUploading(false);
    setUploadResult(result);
    if (result.success) {
      fetchData();
    }
  };

  const handleDownload = async () => {
    const result = await downloadPacksCSV();
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'packs.csv';
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
          <h1 className="text-2xl font-bold">{t('الحقائب المدرسية', 'Packs scolaires')}</h1>
          <p className="text-muted-foreground text-sm">{t('إدارة الحقائب الجاهزة', 'Gérer les packs prêts à l\'emploi')}</p>
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
            {t('حقيبة جديدة', 'Nouveau pack')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : packs.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground">{t('لا توجد حقائب', 'Aucun pack')}</div>
        ) : (
          packs.map((pack) => (
            <div key={pack.id} className="rounded-2xl border bg-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Boxes className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(pack)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(pack.id)} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-bold">{pack.nameAr}</h3>
                <p className="text-sm text-muted-foreground">{pack.nameFr}</p>
              </div>
              <Badge variant="outline">
                {gradeLevels.find((g) => g.value === pack.gradeLevel)?.label}
              </Badge>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{pack.items.length} {t('عنصر', 'élément')}{pack.items.length !== 1 ? 's' : ''}</span>
                <span className="font-bold text-primary">{formatDZD(pack.basePriceDZD, isAr ? 'ar-DZ' : 'fr-DZ')}</span>
              </div>
              {pack.discountPercent > 0 && (
                <span className="inline-block rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                  {t('خصم', 'Remise')} {pack.discountPercent}%
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Upload CSV Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setUploadOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t('رفع حقائب من CSV', 'Importer des packs depuis CSV')}
              </h2>
              <button onClick={() => setUploadOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-bold">{t('تنسيق الملف المطلوب:', 'Format de fichier requis :')}</p>
                <p>{t('الأعمدة:', 'Colonnes :')} id, nameAr, nameFr, descriptionAr, descriptionFr, gradeLevel, basePriceDZD, discountPercent, imageUrl, isActive, items</p>
                <p>{t('الأعمدة المطلوبة:', 'Colonnes obligatoires :')} nameAr, gradeLevel, basePriceDZD, items</p>
                <p>{t('إذا وُجد id، سيتم تحديث الحقيبة الموجودة. إذا تركته فارغاً، سيتم إنشاء حقيبة جديدة.', 'Si l\'id existe, le pack sera mis à jour. Sinon, un nouveau pack sera créé.')}</p>
                <p>{t('items: اسم_المنتج1:الكمية|اسم_المنتج2:الكمية (يجب أن تكون المنتجات موجودة مسبقاً)', 'items : nom_produit1:quantité|nom_produit2:quantité (les produits doivent exister au préalable)')}</p>
                <p>gradeLevel: AP1, AP2, AP3, AP4, AP5, AM1, AM2, AM3, AM4, AS1, AS2, AS3, CUSTOM</p>
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
                      <p>{t('تم إنشاء:', 'Créés :')} {uploadResult.results?.created || 0} {t('حقيبة', 'pack')}{(uploadResult.results?.created || 0) !== 1 ? 's' : ''}</p>
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
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen} title={editing ? t('تعديل حقيبة', 'Modifier le pack') : t('حقيبة جديدة', 'Nouveau pack')} side="right">
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
            <label className="text-sm font-medium">{t('المستوى الدراسي', 'Niveau scolaire')} *</label>
            <select required value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {gradeLevels.map((g) => (<option key={g.value} value={g.value}>{'labelAr' in g ? t(g.labelAr, g.labelFr) : g.label}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('السعر الأساسي (د.ج)', 'Prix de base (DZD)')} *</label>
              <input type="number" required min={0} value={form.basePriceDZD} onChange={(e) => setForm({ ...form, basePriceDZD: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('نسبة الخصم (%)', 'Remise (%)')}</label>
              <input type="number" min={0} max={100} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('محتويات الحقيبة', 'Contenu du pack')}</label>
            {form.items.length > 0 && (
              <div className="space-y-2">
                {form.items.map((item) => (
                  <div key={item.supplyItemId} className="flex items-center gap-2 rounded-lg border p-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.nameAr}</p>
                      <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isOptional}
                          onChange={() => toggleItemOptional(item.supplyItemId)}
                          className="h-3.5 w-3.5 rounded border-input"
                        />
                        <span className="text-xs text-muted-foreground">{item.isOptional ? t('اختياري', 'Optionnel') : t('إجباري', 'Obligatoire')}</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => updateItemQty(item.supplyItemId, -1)} className="rounded p-1 hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button type="button" onClick={() => updateItemQty(item.supplyItemId, 1)} className="rounded p-1 hover:bg-muted">
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.supplyItemId)} className="rounded p-1 hover:bg-red-50 text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <select
              onChange={(e) => { if (e.target.value) { addItem(e.target.value); e.target.value = ''; } }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">+ {t('إضافة منتج من الكتالوج', 'Ajouter un produit du catalogue')}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.nameAr} — {formatDZD(p.unitPriceDZD, isAr ? 'ar-DZ' : 'fr-DZ')}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الوصف (عربي)', 'Description (arabe)')}</label>
            <textarea rows={2} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('رابط الصورة', 'Lien de l\'image')}</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? t('جار الحفظ...', 'Enregistrement...') : editing ? t('حفظ التعديلات', 'Enregistrer les modifications') : t('إنشاء الحقيبة', 'Créer le pack')}
          </Button>
        </form>
      </Sheet>
    </div>
  );
}
