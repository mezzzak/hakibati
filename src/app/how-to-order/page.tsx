import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, MapPin, Phone, PackageCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'كيفية الطلب | حقيبتي',
  description: 'خطوات بسيطة لطلب حقيبتك المدرسية من حقيبتي مع التوصيل لجميع ولايات الجزائر',
};

const steps = [
  {
    icon: MapPin,
    title: 'اختيار المستوى',
    titleFr: 'Choisir le niveau',
    desc: 'اختر المستوى الدراسي المناسب لطفلك من القائمة المتاحة. نغطي جميع المستويات من ما قبل التحضيري إلى السنة الخامسة ابتدائي.',
    descFr: "Choisissez le niveau scolaire adapté à votre enfant dans la liste disponible. Nous couvrons tous les niveaux de la maternelle au CM2.",
  },
  {
    icon: ShoppingCart,
    title: 'اختيار الحقيبة',
    titleFr: 'Choisir le kit',
    desc: 'تصفح الحقائب المدرسية المتاحة لمستوى طفلك. كل حقيبة تحتوي على قائمة كاملة بالأدوات المدرسية اللازمة.',
    descFr: "Parcourez les kits scolaires disponibles pour le niveau de votre enfant. Chaque kit contient une liste complète des fournitures nécessaires.",
  },
  {
    icon: Phone,
    title: 'تعبئة المعلومات',
    titleFr: 'Renseigner les informations',
    desc: 'أدخل معلومات الاتصال والعنوان بدقة. اختر بين التوصيل للمنزل أو الاستلام من نقطة توقف حسب راحتك.',
    descFr: "Entrez vos coordonnées et votre adresse avec précision. Choisissez entre la livraison à domicile ou le retrait en point relais selon votre convenance.",
  },
  {
    icon: PackageCheck,
    title: 'استلام الطلب',
    titleFr: 'Réception de la commande',
    desc: 'ادفع عند الاستلام! سيصلك الطلب خلال 24 إلى 72 ساعة حسب ولايتك. تتبع حالة طلبك من حسابك في أي وقت.',
    descFr: "Payez à la livraison ! Votre commande arrivera dans les 24 à 72 heures selon votre wilaya. Suivez l'état de votre commande depuis votre compte à tout moment.",
  },
];

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">كيفية الطلب</h1>
          <p className="text-muted-foreground">Comment commander</p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex gap-4 rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/packs"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            ابدأ طلبك الآن
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
