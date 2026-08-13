'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { ArrowDown, Sparkles } from 'lucide-react';

export function CTABanner() {
  const { t } = useLanguage();

  const scrollToGrades = () => {
    document.getElementById('grade-selector')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 mb-6">
          <Sparkles className="h-4 w-4" />
          <span>{t('موسم العودة إلى المدارس 2026', 'Rentrée scolaire 2026')}</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          {t('جهز حقيبة طفلك الآن', 'Préparez le kit de votre enfant')}
        </h2>
        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
          {t('لا تنتظر الذروة، اطلب الآن واحصل على توصيل سريع', "N'attendez pas la ruée, commandez maintenant pour une livraison rapide")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={scrollToGrades}
            className="gap-2 rounded-xl bg-white text-primary hover:bg-white/90 text-base shadow-elevated transition-all duration-200 ease-out-expo hover:shadow-card-hover hover:-translate-y-0.5"
          >
            {t('ابدأ الآن', 'Commencer')}
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
