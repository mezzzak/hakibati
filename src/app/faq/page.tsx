'use client';

import { useLanguage } from '@/components/language-provider';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'ما هي حقيبتي؟',
    qFr: 'Qu\'est-ce que Hakibati ?',
    a: 'حقيبتي هي منصة جزائرية توفر مجموعات الأدوات المدرسية الجاهزة (الحقائب) للتلاميذ من جميع المستويات، مع التوصيل لجميع ولايات الجزائر.',
    aFr: 'Hakibati est une plateforme algérienne qui fournit des kits de fournitures scolaires complets pour les élèves de tous les niveaux, avec livraison dans toutes les wilayas d\'Algérie.',
  },
  {
    q: 'كيف يمكنني الطلب؟',
    qFr: 'Comment puis-je commander ?',
    a: 'اختر مستوى طفلك الدراسي، ثم الحقيبة المناسبة، وأدخل معلوماتك وعنوانك، ثم اضغط على "تأكيد الطلب". الدفع عند الاستلام.',
    aFr: 'Choisissez le niveau scolaire de votre enfant, puis le kit adapté, entrez vos informations et votre adresse, puis cliquez sur "Confirmer la commande". Le paiement se fait à la livraison.',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    qFr: 'Quels sont les modes de paiement ?',
    a: 'حالياً ندعم الدفع عند الاستلام (COD) فقط. الدفع نقداً لمندوب التوصيل عند استلام الطلب.',
    aFr: 'Actuellement, nous proposons uniquement le paiement à la livraison (COD). Vous payez en espèces au livreur lors de la réception de votre commande.',
  },
  {
    q: 'كم تستغرق عملية التوصيل؟',
    qFr: 'Combien de temps prend la livraison ?',
    a: 'التوصيل يستغرق عادة بين 24 إلى 72 ساعة حسب الولاية والمنطقة. الولايات الكبرى أسرع قليلاً من المناطق النائية.',
    aFr: 'La livraison prend généralement entre 24 et 72 heures selon la wilaya et la région. Les grandes wilayas sont un peu plus rapides que les zones reculées.',
  },
  {
    q: 'هل يمكنني تتبع طلبي؟',
    qFr: 'Puis-je suivre ma commande ?',
    a: 'نعم، يمكنك تتبع حالة طلبك من صفحة "طلباتي" في حسابك. ستجد حالات: بانتظار التأكيد، مؤكد، قيد الإرسال، تم التسليم.',
    aFr: 'Oui, vous pouvez suivre l\'état de votre commande depuis la page "Mes commandes" de votre compte. Les statuts sont : en attente de confirmation, confirmée, en cours d\'expédition, livrée.',
  },
  {
    q: 'هل يمكنني تتبع الطلب بدون إنشاء حساب؟',
    qFr: 'Puis-je suivre ma commande sans créer de compte ?',
    a: 'نعم، يمكنك تتبع طلبك مباشرة باستخدام رقم الطلب من صفحة "تتبع الطلب"، دون الحاجة إلى التسجيل أو تسجيل الدخول. يمكنك أيضاً تحميل فاتورة الطلب بصيغة PDF.',
    aFr: 'Oui, vous pouvez suivre votre commande directement en utilisant le numéro de commande depuis la page "Suivi de commande", sans besoin d\'inscription ou de connexion. Vous pouvez également télécharger la facture au format PDF.',
  },
  {
    q: 'هل يمكنني تعديل الطلب بعد إرساله؟',
    qFr: 'Puis-je modifier ma commande après envoi ?',
    a: 'يمكنك تعديل الطلب فقط قبل تأكيده من قبل فريقنا. اتصل بنا فوراً إذا أردت التعديل.',
    aFr: 'Vous pouvez modifier votre commande uniquement avant qu\'elle ne soit confirmée par notre équipe. Contactez-nous immédiatement si vous souhaitez apporter des modifications.',
  },
  {
    q: 'هل المنتجات أصلية؟',
    qFr: 'Les produits sont-ils originaux ?',
    a: 'نعم، جميع الأدوات المدرسية في حقائبنا هي منتجات أصلية من علامات تجارية معروفة وموثوقة.',
    aFr: 'Oui, toutes les fournitures scolaires dans nos kits sont des produits originaux de marques connues et fiables.',
  },
  {
    q: 'ماذا لو كان المنتج تالفاً؟',
    qFr: 'Et si le produit est endommagé ?',
    a: 'يمكنك الإرجاع خلال 48 ساعة من الاستلام. يرجى التواصل مع خدمة العملاء وتقديم صور توضيحية.',
    aFr: 'Vous pouvez retourner le produit dans les 48 heures suivant la réception. Veuillez contacter le service client et fournir des photos explicatives.',
  },
  {
    q: 'هل التوصيل متوفر لجميع الولايات؟',
    qFr: 'La livraison est-elle disponible dans toutes les wilayas ?',
    a: 'نعم، نوصل لجميع الولايات الجزائرية الـ 58. أوقات التوصيل قد تختلف حسب المسافة.',
    aFr: 'Oui, nous livrons dans les 58 wilayas d\'Algérie. Les délais de livraison peuvent varier selon la distance.',
  },
  {
    q: 'هل يمكنني إنشاء حساب بدون طلب؟',
    qFr: 'Puis-je créer un compte sans commander ?',
    a: 'نعم، يمكنك إنشاء حساب في أي وقت من صفحة تسجيل الدخول. سيسهل لك متابعة طلباتك المستقبلية.',
    aFr: 'Oui, vous pouvez créer un compte à tout moment depuis la page de connexion. Cela facilitera le suivi de vos futures commandes.',
  },
];

export default function FAQPage() {
  const { t, isAr } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">
            {t('الأسئلة الشائعة', 'Questions fréquentes')}
          </h1>
          <p className="text-muted-foreground">
            {t('إجابات على أكثر الأسئلة التي تهمكم', 'Réponses aux questions les plus fréquentes')}
          </p>
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
                  {isAr ? faq.q : faq.qFr}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {isAr ? faq.a : faq.aFr}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
