'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { GradeLevel, getGradeCategory, getGradeLabel, getCategoryLabel, type GradeCategory } from '@/types';
import { BookOpen, School, GraduationCap, ChevronLeft, ChevronRight, Palette, Layers } from 'lucide-react';

interface CategoryConfig {
  category: GradeCategory;
  icon: typeof BookOpen;
  color: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  count: number;
}

const categories: CategoryConfig[] = [
  {
    category: 'primaire',
    icon: BookOpen,
    color: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-400',
    count: 5,
  },
  {
    category: 'cem',
    icon: School,
    color: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-400',
    count: 4,
  },
  {
    category: 'lycee',
    icon: GraduationCap,
    color: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-400',
    count: 3,
  },
];

const yearsByCategory: Record<GradeCategory, GradeLevel[]> = {
  primaire: [GradeLevel.AP1, GradeLevel.AP2, GradeLevel.AP3, GradeLevel.AP4, GradeLevel.AP5],
  cem: [GradeLevel.AM1, GradeLevel.AM2, GradeLevel.AM3, GradeLevel.AM4],
  lycee: [GradeLevel.AS1, GradeLevel.AS2, GradeLevel.AS3],
  custom: [GradeLevel.CUSTOM],
};

const yearConfig: Record<GradeLevel, { color: string; borderColor: string; iconBg: string; iconColor: string; hoverBorder: string }> = {
  [GradeLevel.AP1]: { color: 'from-sky-50 to-blue-50', borderColor: 'border-sky-200', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', hoverBorder: 'hover:border-sky-400' },
  [GradeLevel.AP2]: { color: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', hoverBorder: 'hover:border-blue-400' },
  [GradeLevel.AP3]: { color: 'from-indigo-50 to-violet-50', borderColor: 'border-indigo-200', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', hoverBorder: 'hover:border-indigo-400' },
  [GradeLevel.AP4]: { color: 'from-violet-50 to-purple-50', borderColor: 'border-violet-200', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', hoverBorder: 'hover:border-violet-400' },
  [GradeLevel.AP5]: { color: 'from-purple-50 to-fuchsia-50', borderColor: 'border-purple-200', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', hoverBorder: 'hover:border-purple-400' },
  [GradeLevel.AM1]: { color: 'from-emerald-50 to-teal-50', borderColor: 'border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', hoverBorder: 'hover:border-emerald-400' },
  [GradeLevel.AM2]: { color: 'from-teal-50 to-cyan-50', borderColor: 'border-teal-200', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', hoverBorder: 'hover:border-teal-400' },
  [GradeLevel.AM3]: { color: 'from-cyan-50 to-sky-50', borderColor: 'border-cyan-200', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600', hoverBorder: 'hover:border-cyan-400' },
  [GradeLevel.AM4]: { color: 'from-sky-50 to-blue-50', borderColor: 'border-sky-200', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', hoverBorder: 'hover:border-sky-400' },
  [GradeLevel.AS1]: { color: 'from-amber-50 to-orange-50', borderColor: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', hoverBorder: 'hover:border-amber-400' },
  [GradeLevel.AS2]: { color: 'from-orange-50 to-red-50', borderColor: 'border-orange-200', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', hoverBorder: 'hover:border-orange-400' },
  [GradeLevel.AS3]: { color: 'from-red-50 to-rose-50', borderColor: 'border-red-200', iconBg: 'bg-red-100', iconColor: 'text-red-600', hoverBorder: 'hover:border-red-400' },
  [GradeLevel.CUSTOM]: { color: 'from-slate-50 to-gray-50', borderColor: 'border-slate-200', iconBg: 'bg-slate-100', iconColor: 'text-slate-600', hoverBorder: 'hover:border-slate-400' },
};

export function GradeSelector() {
  const router = useRouter();
  const { t, isAr } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<GradeCategory | null>(null);

  const selectYear = (level: GradeLevel) => {
    router.push(`/pack-builder?grade=${level}`);
  };

  const goCustom = () => {
    router.push('/pack-builder?grade=CUSTOM');
  };

  return (
    <section id="grade-selector" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('اختر مستوى طفلك', 'Choisissez le niveau de votre enfant')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'نحن نجهز الحقيبة المثالية لكل مرحلة دراسية بعناية فائقة',
              'Nous préparons le kit parfait pour chaque niveau avec le plus grand soin'
            )}
          </p>
        </div>

        {/* Mobile: horizontal scroll all grades */}
        <div className="sm:hidden">
          <div className="flex overflow-x-auto gap-2.5 pb-3 scrollbar-hide snap-x snap-mandatory">
            {/* Category pills */}
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(selectedCategory === cat.category ? null : cat.category)}
                  className={cn(
                    'snap-start shrink-0 flex items-center gap-2 rounded-full border-2 px-4 py-2.5 transition-all',
                    selectedCategory === cat.category
                      ? `${cat.borderColor} ${cat.iconBg} ${cat.iconColor} font-semibold`
                      : 'border-border bg-background text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {getCategoryLabel(cat.category, isAr ? 'ar' : 'fr')}
                  </span>
                </button>
              );
            })}
            <button
              onClick={goCustom}
              className="snap-start shrink-0 flex items-center gap-2 rounded-full border-2 border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
            >
              <Palette className="h-4 w-4" />
              <span className="whitespace-nowrap">{t('مخصص', 'Personnalisé')}</span>
            </button>
          </div>

          {/* Mobile: show years for selected category */}
          {selectedCategory && selectedCategory !== 'custom' && (
            <div className="flex overflow-x-auto gap-2.5 pb-3 scrollbar-hide snap-x snap-mandatory mt-2">
              {yearsByCategory[selectedCategory].map((level) => {
                const config = yearConfig[level];
                return (
                  <button
                    key={level}
                    onClick={() => selectYear(level)}
                    className={cn(
                      'snap-start shrink-0 flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 min-w-[100px] transition-all active:scale-95',
                      config.borderColor,
                      'bg-gradient-to-br',
                      config.color
                    )}
                  >
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', config.iconBg, config.iconColor)}>
                      <Layers className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold">{getGradeLabel(level, isAr ? 'ar' : 'fr')}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop: two-step category cards */}
        <div className="hidden sm:block">
          {!selectedCategory && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`group relative flex flex-col items-center gap-5 rounded-2xl border-2 ${cat.borderColor} bg-gradient-to-br ${cat.color} p-8 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover ${cat.hoverBorder} overflow-hidden`}
                  >
                    <div className="absolute -right-6 -bottom-6 opacity-[0.06]">
                      <Icon className="h-40 w-40" />
                    </div>
                    <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-xl ${cat.iconBg} ${cat.iconColor}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                        {getCategoryLabel(cat.category, isAr ? 'ar' : 'fr')}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        {t(`${cat.count} مستويات`, `${cat.count} niveaux`)}
                      </p>
                    </div>
                    <div className={`relative z-10 mt-2 flex items-center gap-2 text-sm font-semibold ${cat.iconColor}`}>
                      <span>{t('اختر المستوى', 'Choisir le niveau')}</span>
                      <ChevronLeft className="h-4 w-4" />
                    </div>
                  </button>
                );
              })}

              <button
                onClick={goCustom}
                className="group relative flex flex-col items-center gap-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 p-8 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-400 overflow-hidden"
              >
                <div className="absolute -right-6 -bottom-6 opacity-[0.06]">
                  <Palette className="h-40 w-40" />
                </div>
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Palette className="h-8 w-8" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                    {t('مخصص', 'Personnalisé')}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {t('ابنِ الحقيبة يدوياً', 'Construire manuellement')}
                  </p>
                </div>
                <div className="relative z-10 mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <span>{t('ابدأ البناء', 'Commencer')}</span>
                  <ChevronLeft className="h-4 w-4" />
                </div>
              </button>
            </div>
          )}

          {selectedCategory && selectedCategory !== 'custom' && (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
                {t('العودة للمستويات', 'Retour aux niveaux')}
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold">
                  {getCategoryLabel(selectedCategory, isAr ? 'ar' : 'fr')}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t('اختر السنة الدراسية المحددة', 'Choisissez l\'année scolaire spécifique')}
                </p>
              </div>

              <div className={`grid gap-4 ${
                selectedCategory === 'primaire' ? 'grid-cols-3 lg:grid-cols-5' :
                selectedCategory === 'cem' ? 'grid-cols-2 lg:grid-cols-4' :
                'grid-cols-3'
              }`}>
                {yearsByCategory[selectedCategory].map((level) => {
                  const config = yearConfig[level];
                  return (
                    <button
                      key={level}
                      onClick={() => selectYear(level)}
                      className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 ${config.borderColor} bg-gradient-to-br ${config.color} p-6 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover ${config.hoverBorder}`}
                    >
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor}`}>
                        <Layers className="h-7 w-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold text-foreground">
                          {getGradeLabel(level, isAr ? 'ar' : 'fr')}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t('حقيبة جاهزة', 'Kit prêt')}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-semibold ${config.iconColor}`}>
                        <span>{t('تصفح', 'Voir')}</span>
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
