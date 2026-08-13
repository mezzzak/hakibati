import { Metadata } from 'next';
import { RotateCcw, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الإرجاع | حقيبتي',
  description: 'سياسة الإرجاع والاستبدال لمنتجات حقيبتي',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">سياسة الإرجاع</h1>
          <p className="text-muted-foreground">Politique de retour</p>
        </div>

        <div className="space-y-6">
          {/* Eligible */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-lg">حالات القبول</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                منتجات تالفة أو غير مطابقة للوصف عند الاستلام.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                ناقصة بعض الأدوات المدرسية المذكورة في الحقيبة.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                خطأ في نوع الحقيبة أو المستوى الدراسي مقارنة بالطلب.
              </li>
            </ul>
          </div>

          {/* Not Eligible */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-lg">حالات الرفض</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                الطلب لم يُستلم من قبل العميل أو تم رفضه دون سبب.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                استخدام المنتجات أو فتحها بشكل جزئي قبل طلب الإرجاع.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                مرور أكثر من 48 ساعة على استلام الطلب.
              </li>
            </ul>
          </div>

          {/* Process */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">خطوات الإرجاع</h3>
            </div>
            <div className="space-y-4">
              {[
                { step: 1, text: 'التواصل مع خدمة العملاء خلال 48 ساعة من استلام الطلب.' },
                { step: 2, text: 'تصوير المنتجات وتقديم صور توضيحية للمشكلة.' },
                { step: 3, text: 'مراجعة الطلب من قبل فريق الجودة خلال 24 ساعة.' },
                { step: 4, text: 'إرجاع المنتجات مع مندوب التوصيل عند زيارته التالية.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {s.step}
                  </span>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-2xl border bg-amber-50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-amber-800">تنبيه</h3>
            </div>
            <p className="text-sm text-amber-700 leading-relaxed">
              يرجى التأكد من فحص جميع محتويات الحقيبة عند الاستلام ومقارنتها بالقائمة المرفقة.
              أي ملاحظة يجب الإبلاغ عنها فوراً لضمان حقك في الإرجاع.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
