'use client';

import { useLanguage } from '@/components/language-provider';
import { BookOpen, SlidersHorizontal, Truck } from 'lucide-react';

const steps = [
  {
    icon: BookOpen,
    titleAr: 'اختر المستوى',
    titleFr: 'Choisissez le niveau',
    descAr: 'ابتدائي، متوسط أو ثانوي. نحن نغطي جميع المراحل الدراسية.',
    descFr: 'Primaire, CEM ou Lycée. Nous couvrons tous les niveaux.',
  },
  {
    icon: SlidersHorizontal,
    titleAr: 'خصص الحقيبة',
    titleFr: 'Personnalisez le kit',
    descAr: 'أضف أو احذف الأدوات حسب احتياجات طفلك.',
    descFr: 'Ajoutez ou retirez des articles selon les besoins.',
  },
  {
    icon: Truck,
    titleAr: 'استلم في بابك',
    titleFr: 'Recevez à domicile',
    descAr: 'التوصيل السريع إلى جميع ولايات الجزائر.',
    descFr: 'Livraison rapide vers toutes les wilayas.',
  },
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('كيف تعمل حقيبتي؟', 'Comment fonctionne Hakibati ?')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('ثلاث خطوات بسيطة وتوصلك الحقيبة لباب دارك', 'Trois étapes simples et votre kit arrive à votre porte')}
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 max-w-5xl mx-auto">
          {/* Desktop connector line */}
          <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-primary/10" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center gap-4">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated transition-transform duration-300 ease-out-expo hover:scale-105">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold">{t(step.titleAr, step.titleFr)}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {t(step.descAr, step.descFr)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
