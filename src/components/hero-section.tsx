'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { ArrowDown, Package, Truck, ShieldCheck, Clock, BookOpen, Pencil, Ruler, Backpack } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();

  const scrollToGrades = () => {
    document.getElementById('grade-selector')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/10 to-background">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-48 -left-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-primary/[0.03] blur-3xl" />

      {/* Floating decorative icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[8%] opacity-[0.08] animate-pulse">
          <Backpack className="h-24 w-24 text-primary rotate-12" />
        </div>
        <div className="absolute top-[25%] left-[10%] opacity-[0.06]">
          <BookOpen className="h-20 w-20 text-primary -rotate-6" />
        </div>
        <div className="absolute bottom-[30%] right-[12%] opacity-[0.07]">
          <Pencil className="h-16 w-16 text-primary rotate-45" />
        </div>
        <div className="absolute bottom-[20%] left-[15%] opacity-[0.06]">
          <Ruler className="h-14 w-14 text-primary -rotate-12" />
        </div>
      </div>

      <div className="container relative mx-auto px-4 pt-16 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Clock className="h-4 w-4" />
            <span>{t('موسم العودة إلى المدارس 2026', 'Rentrée scolaire 2026')}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t('وفر وقتك وجهدك', 'Gagnez du temps et de l\'effort')}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-xl mx-auto">
            {t(
              'حقيبة أدوات طفلك كاملة تصلك إلى باب المنزل بنقرة واحدة',
              'Un kit scolaire complet livré à votre porte en un clic'
            )}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={scrollToGrades}
              className="gap-2 rounded-xl text-base shadow-elevated transition-all duration-200 ease-out-expo hover:shadow-card-hover hover:-translate-y-0.5"
            >
              {t('اختر حقيبة طفلك', 'Choisissez le kit de votre enfant')}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { icon: Package, title: t('حقائب جاهزة', 'Kits prêts'), desc: t('مختارة بعناية لكل مستوى دراسي', 'Sélectionnés pour chaque niveau') },
              { icon: Truck, title: t('توصيل سريع', 'Livraison rapide'), desc: t('إلى جميع ولايات الجزائر', 'Vers toutes les wilayas d\'Algérie') },
              { icon: ShieldCheck, title: t('جودة مضمونة', 'Qualité garantie'), desc: t('ماركات أصلية معتمدة', 'Marques authentiques certifiées') },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-background/90 p-5 shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 ease-out-expo group-hover:scale-110">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
