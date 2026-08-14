'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { ArrowDown, Package, Truck, ShieldCheck, Clock, BookOpen, Pencil, Ruler, Backpack } from 'lucide-react';
import { useRef, useEffect } from 'react';

export function HeroSection() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let paused = false;
    const handlePointer = () => { paused = true; };
    const handleLeave = () => { paused = false; };
    el.addEventListener('pointerdown', handlePointer);
    el.addEventListener('pointerup', handleLeave);
    const interval = setInterval(() => {
      if (paused) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 172, behavior: 'smooth' });
      }
    }, 3000);
    return () => {
      clearInterval(interval);
      el.removeEventListener('pointerdown', handlePointer);
      el.removeEventListener('pointerup', handleLeave);
    };
  }, []);

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

      <div className="container relative mx-auto px-4 pt-10 pb-8 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust pill */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs sm:text-sm text-primary">
            <Clock className="h-3.5 w-3.5" />
            <span>{t('موسم العودة إلى المدارس 2026', 'Rentrée scolaire 2026')}</span>
          </div>

          <h1 className="text-[28px] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            {t('وفر وقتك وجهدك', 'Gagnez du temps et de l\'effort')}
          </h1>
          <p className="mt-3 text-base sm:text-xl leading-relaxed text-muted-foreground max-w-xl mx-auto">
            {t(
              'حقيبة أدوات طفلك كاملة تصلك إلى باب المنزل بنقرة واحدة',
              'Un kit scolaire complet livré à votre porte en un clic'
            )}
          </p>

          <div className="mt-5 sm:mt-7">
            <Button
              size="lg"
              onClick={scrollToGrades}
              className="w-full sm:w-auto gap-2 rounded-xl text-sm sm:text-base shadow-elevated h-12 sm:h-11"
            >
              {t('اختر حقيبة طفلك', 'Choisissez le kit de votre enfant')}
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary-foreground/20">
                <ArrowDown className="h-3 w-3" />
              </span>
            </Button>
          </div>

          {/* Trust indicators — horizontal scroll on mobile */}
          <div ref={scrollRef} className="mt-8 sm:mt-16 flex overflow-x-auto gap-3 pb-2 scrollbar-hide scroll-smooth sm:grid sm:grid-cols-3 sm:gap-5 sm:pb-0">
            {[
              { icon: Package, title: t('حقائب جاهزة', 'Kits prêts'), desc: t('مختارة بعناية لكل مستوى دراسي', 'Sélectionnés pour chaque niveau') },
              { icon: Truck, title: t('توصيل سريع', 'Livraison rapide'), desc: t('إلى جميع ولايات الجزائر', 'Vers toutes les wilayas d\'Algérie') },
              { icon: ShieldCheck, title: t('جودة مضمونة', 'Qualité garantie'), desc: t('ماركات أصلية معتمدة', 'Marques authentiques certifiées') },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex shrink-0 w-[160px] sm:w-auto flex-col items-center gap-2 sm:gap-3 rounded-2xl border bg-background/90 p-4 sm:p-5 shadow-card"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
