'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllShippingRates, upsertShippingRate, toggleShippingRate, uploadShippingRatesCSV, downloadShippingRatesCSV, seedDefaultShippingRates } from '@/lib/admin-actions';
import { Button } from '@/components/ui/button';
import { WILAYAS } from '@/lib/wilayas';
import { Truck, Home, Building2, Save, CheckCircle2, AlertCircle, Upload, Download, FileText, X } from 'lucide-react';

const METHODS = [
  { key: 'HOME_DELIVERY', label: 'توصيل للمنزل', icon: Home },
  { key: 'STOP_DESK', label: 'نقطة استلام', icon: Building2 },
];

export default function AdminShippingPage() {
  const [rates, setRates] = useState<Map<string, any>>(new Map());
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    const result = await getAllShippingRates();
    if (result.success) {
      const map = new Map<string, any>();
      for (const r of result.rates || []) {
        map.set(`${r.wilaya}__${r.method}`, r);
      }
      setRates(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleEdit = (wilaya: string, method: string, value: string) => {
    const key = `${wilaya}__${method}`;
    const num = Number(value);
    setEdits((prev) => ({ ...prev, [key]: num }));
  };

  const handleSave = async (wilaya: string, method: string) => {
    const key = `${wilaya}__${method}`;
    const costDZD = edits[key];
    if (costDZD === undefined || isNaN(costDZD) || costDZD < 0) return;

    setSaving((prev) => ({ ...prev, [key]: true }));
    const result = await upsertShippingRate({ wilaya, method, costDZD });
    setSaving((prev) => ({ ...prev, [key]: false }));

    if (result.success) {
      setRates((prev) => {
        const next = new Map(prev);
        next.set(key, result.rate);
        return next;
      });
      setEdits((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setToast({ message: 'تم الحفظ', type: 'success' });
    } else {
      setToast({ message: result.error || 'فشل الحفظ', type: 'error' });
    }

    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = async (wilaya: string, method: string) => {
    const key = `${wilaya}__${method}`;
    const rate = rates.get(key);
    if (!rate) {
      // Create with default 0 and active true
      await upsertShippingRate({ wilaya, method, costDZD: 0 });
      fetchRates();
      return;
    }

    const result = await toggleShippingRate(rate.id, !rate.isActive);
    if (result.success) {
      setRates((prev) => {
        const next = new Map(prev);
        next.set(key, result.rate);
        return next;
      });
      setToast({ message: rate.isActive ? 'تم التعطيل' : 'تم التفعيل', type: 'success' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const getValue = (wilaya: string, method: string) => {
    const key = `${wilaya}__${method}`;
    if (edits[key] !== undefined) return edits[key];
    const rate = rates.get(key);
    return rate?.costDZD ?? '';
  };

  const isActive = (wilaya: string, method: string) => {
    const key = `${wilaya}__${method}`;
    const rate = rates.get(key);
    return rate?.isActive ?? true;
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
    const result = await uploadShippingRatesCSV(csvText);
    setUploading(false);
    setUploadResult(result);
    if (result.success) {
      fetchRates();
    }
  };

  const handleDownload = async () => {
    const result = await downloadShippingRatesCSV();
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'shipping-rates.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleSeed = async () => {
    if (!confirm('سيتم تعبئة جميع الولايات بـ 0 د.ج لنقطة الاستلام و 400 د.ج للتوصيل للمنزل. هل أنت متأكد؟')) return;
    setLoading(true);
    const result = await seedDefaultShippingRates();
    setLoading(false);
    if (result.success) {
      setToast({ message: `تم التعبئة: ${result.results?.created || 0} جديد، ${result.results?.updated || 0} محدث`, type: 'success' });
      fetchRates();
    } else {
      setToast({ message: result.error || 'فشل التعبئة', type: 'error' });
    }
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">أسعار التوصيل</h1>
          <p className="text-muted-foreground text-sm">إدارة أسعار التوصيل حسب الولاية وطريقة التوصيل</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { setUploadOpen(true); setCsvText(''); setUploadResult(null); }} className="gap-2">
            <Upload className="h-4 w-4" />
            رفع CSV
          </Button>
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            تحميل CSV
          </Button>
          <Button variant="outline" onClick={handleSeed} className="gap-2">
            <Truck className="h-4 w-4" />
            تعبئة افتراضية
          </Button>
          {METHODS.map((m) => (
            <div key={m.key} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <m.icon className="h-4 w-4" />
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Upload CSV Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setUploadOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                رفع أسعار التوصيل من CSV
              </h2>
              <button onClick={() => setUploadOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-bold">تنسيق الملف المطلوب:</p>
                <p>الأعمدة: wilaya, method, costDZD, isActive</p>
                <p>method: HOME_DELIVERY أو STOP_DESK</p>
                <p>wilaya: اسم الولاية بالعربي (مثال: الجزائر، وهران، قسنطينة)</p>
                <p>costDZD: السعر بالدينار (أرقام فقط)</p>
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
                placeholder="أو الصق محتوى CSV هنا..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-xs font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />

              {uploadResult && (
                <div className={`rounded-lg p-3 text-sm space-y-1 ${uploadResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                  {uploadResult.success ? (
                    <>
                      <p className="flex items-center gap-1.5 font-bold"><CheckCircle2 className="h-4 w-4" />تم الرفع بنجاح!</p>
                      <p>تم إنشاء: {uploadResult.results?.created || 0}</p>
                      <p>تم تحديث: {uploadResult.results?.updated || 0}</p>
                      <p>تم تخطيه: {uploadResult.results?.skipped || 0}</p>
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
                <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}>إلغاء</Button>
                <Button size="sm" onClick={handleUpload} disabled={uploading || !csvText.trim()}>
                  {uploading ? 'جارٍ الرفع...' : 'رفع الملف'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-right font-medium sticky right-0 bg-muted/50">الولاية</th>
                  {METHODS.map((m) => (
                    <th key={m.key} className="px-4 py-3 text-center font-medium">
                      <div className="flex items-center justify-center gap-1.5">
                        <m.icon className="h-4 w-4 text-muted-foreground" />
                        {m.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WILAYAS.map((w) => (
                  <tr key={w.code} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium sticky right-0 bg-card">
                      <span className="text-muted-foreground text-xs ml-1">{w.code}</span>
                      {w.nameAr}
                    </td>
                    {METHODS.map((m) => {
                      const key = `${w.nameAr}__${m.key}`;
                      const active = isActive(w.nameAr, m.key);
                      return (
                        <td key={m.key} className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              min={0}
                              disabled={!active}
                              value={getValue(w.nameAr, m.key)}
                              onChange={(e) => handleEdit(w.nameAr, m.key, e.target.value)}
                              onBlur={() => handleSave(w.nameAr, m.key)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSave(w.nameAr, m.key)}
                              className={`w-24 rounded-lg border bg-background px-2 py-1.5 text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-input' : 'border-muted bg-muted/50 text-muted-foreground'}`}
                            />
                            <button
                              type="button"
                              onClick={() => handleToggle(w.nameAr, m.key)}
                              title={active ? 'تعطيل' : 'تفعيل'}
                              className={`rounded-full p-1 transition-colors ${active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                            >
                              {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                            </button>
                            {saving[key] && (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
