'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { ArrowDown, Clock } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();

  const scrollToGrades = () => {
    document.getElementById('grade-selector')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/Students_walking_to_school_2K_202608170120.jpeg)' }}
      />
      {/* Fade image to page background at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-background" />
      {/* Soft dark vignette for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 via-black/20 to-transparent" />

      <div className="container relative mx-auto px-4 py-10 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust pill */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs sm:text-sm text-white backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5" />
            <span>{t('موسم العودة إلى المدارس 2026', 'Rentrée scolaire 2026')}</span>
          </div>

          <h1 className="text-[28px] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
            {t('وفر وقتك وجهدك', 'Gagnez du temps et de l\'effort')}
          </h1>
          <p className="mt-3 text-base sm:text-xl leading-relaxed text-white/85 max-w-xl mx-auto drop-shadow-md">
            {t(
              'حقيبة أدوات طفلك كاملة تصلك إلى باب المنزل بنقرة واحدة',
              'Un kit scolaire complet livré à votre porte en un clic'
            )}
          </p>

          <div className="mt-5 sm:mt-7">
            <Button
              size="lg"
              onClick={scrollToGrades}
              className="relative w-full sm:w-auto gap-2.5 rounded-full text-sm sm:text-base font-bold px-6 sm:px-8 h-13 sm:h-12 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] active:scale-95"
            >
              {/* animated gradient shine */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary bg-[length:200%_100%] animate-shimmer" />
              {/* subtle glow ring */}
              <span className="absolute -inset-0.5 rounded-full bg-primary/30 blur-md animate-pulse" />
              <span className="relative flex items-center gap-2.5">
                {t('اختر حقيبة طفلك', 'Choisissez le kit de votre enfant')}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                </span>
              </span>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
