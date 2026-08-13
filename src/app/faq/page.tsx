import { Metadata } from 'next';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة | حقيبتي',
  description: 'الإجابات على أكثر الأسئلة الشائعة حول حقيبتي والتوصيل والطلبات',
};

const faqs = [
  {
    q: 'ما هي حقيبتي؟',
    qFr: 'Qu\'est-ce que Hakibati ?',
    a: 'حقيبتي هي منصة جزائرية توفر مجموعات الأدوات المدرسية الجاهزة (الحقائب) للتلاميذ من جميع المستويات، مع التوصيل لجميع ولايات الجزائر.',
  },
  {
    q: 'كيف يمكنني الطلب؟',
    qFr: 'Comment puis-je commander ?',
    a: 'اختر مستوى طفلك الدراسي، ثم الحقيبة المناسبة، وأدخل معلوماتك وعنوانك، ثم اضغط على "تأكيد الطلب". الدفع عند الاستلام.',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    qFr: 'Quels sont les modes de paiement ?',
    a: 'حالياً ندعم الدفع عند الاستلام (COD) فقط. الدفع نقداً لمندوب التوصيل عند استلام الطلب.',
  },
  {
    q: 'كم تستغرق عملية التوصيل؟',
    qFr: 'Combien de temps prend la livraison ?',
    a: 'التوصيل يستغرق عادة بين 24 إلى 72 ساعة حسب الولاية والمنطقة. الولايات الكبرى أسرع قليلاً من المناطق النائية.',
  },
  {
    q: 'هل يمكنني تتبع طلبي؟',
    qFr: 'Puis-je suivre ma commande ?',
    a: 'نعم، يمكنك تتبع حالة طلبك من صفحة "طلباتي" في حسابك. ستجد حالات: بانتظار التأكيد، مؤكد، قيد الإرسال، تم التسليم.',
  },
  {
    q: 'هل يمكنني تعديل الطلب بعد إرساله؟',
    qFr: 'Puis-je modifier ma commande après envoi ?',
    a: 'يمكنك تعديل الطلب فقط قبل تأكيده من قبل فريقنا. اتصل بنا فوراً إذا أردت التعديل.',
  },
  {
    q: 'هل المنتجات أصلية؟',
    qFr: 'Les produits sont-ils originaux ?',
    a: 'نعم، جميع الأدوات المدرسية في حقائبنا هي منتجات أصلية من علامات تجارية معروفة وموثوقة.',
  },
  {
    q: 'ماذا لو كان المنتج تالفاً؟',
    qFr: 'Et si le produit est endommagé ?',
    a: 'يمكنك الإرجاع خلال 48 ساعة من الاستلام. يرجى التواصل مع خدمة العملاء وتقديم صور توضيحية.',
  },
  {
    q: 'هل التوصيل متوفر لجميع الولايات؟',
    qFr: 'La livraison est-elle disponible dans toutes les wilayas ?',
    a: 'نعم، نوصل لجميع الولايات الجزائرية الـ 58. أوقات التوصيل قد تختلف حسب المسافة.',
  },
  {
    q: 'هل يمكنني إنشاء حساب بدون طلب؟',
    qFr: 'Puis-je créer un compte sans commander ?',
    a: 'نعم، يمكنك إنشاء حساب في أي وقت من صفحة تسجيل الدخول. سيسهل لك متابعة طلباتك المستقبلية.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">الأسئلة الشائعة</h1>
          <p className="text-muted-foreground">Questions fréquemment posées</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border bg-card shadow-sm overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-bold hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
