'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { formatDZD } from '@/lib/utils';
import { getGradeCategory, getGradeLabel, getCategoryLabel } from '@/types';
import { BookOpen, School, GraduationCap, ChevronLeft, Package } from 'lucide-react';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

const categoryIcons: Record<string, typeof BookOpen> = {
  primaire: BookOpen,
  cem: School,
  lycee: GraduationCap,
};

const categoryConfig: Record<string, { color: string; bg: string }> = {
  primaire: { color: 'text-blue-600', bg: 'bg-blue-50' },
  cem: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  lycee: { color: 'text-purple-600', bg: 'bg-purple-50' },
};

function getDiscountedPrice(base: number, discount: number) {
  return Math.round(base * (1 - discount / 100));
}

interface FeaturedPack {
  id: string;
  nameAr: string;
  nameFr: string | null;
  descriptionAr: string | null;
  descriptionFr: string | null;
  gradeLevel: string;
  imageUrl: string | null;
  basePriceDZD: number;
  discountPercent: number;
}

export function FeaturedPacks({ packs }: { packs: FeaturedPack[] }) {
  const { t, isAr } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || packs.length <= 1) return;
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
        el.scrollBy({ left: el.clientWidth * 0.75, behavior: 'smooth' });
      }
    }, 3500);
    return () => {
      clearInterval(interval);
      el.removeEventListener('pointerdown', handlePointer);
      el.removeEventListener('pointerup', handleLeave);
    };
  }, [packs.length]);

  if (packs.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('حقائب مميزة', 'Kits en vedette')}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl">
              {t('أفضل الحقائب المدرسية المختارة لك', 'Les meilleurs kits sélectionnés pour vous')}
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex gap-2 rounded-xl">
            <Link href="/packs">
              {t('عرض الكل', 'Voir tout')}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile: horizontal scroll carousel */}
        <div ref={scrollRef} className="sm:hidden flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {packs.map((pack) => {
            const category = getGradeCategory(pack.gradeLevel as any);
            const catConfig = categoryConfig[category] || categoryConfig.primaire;
            const Icon = categoryIcons[category] || BookOpen;
            const finalPrice = getDiscountedPrice(pack.basePriceDZD, pack.discountPercent);
            const hasDiscount = pack.discountPercent > 0;

            return (
              <Link
                key={pack.id}
                href={`/pack-builder?grade=${pack.gradeLevel}`}
                className="snap-start shrink-0 w-[280px] flex flex-col rounded-2xl border bg-card overflow-hidden shadow-card active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className={`flex h-full items-center justify-center bg-gradient-to-br ${catConfig.bg} to-white`}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${catConfig.bg} ${catConfig.color} shadow-sm`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground/60">{getGradeLabel(pack.gradeLevel as any, isAr ? 'ar' : 'fr')}</span>
                    </div>
                  </div>
                  {hasDiscount && (
                    <div className="absolute top-2.5 right-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{pack.discountPercent}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <div className={`inline-flex items-center gap-1 self-start rounded-md ${catConfig.bg} px-2 py-0.5 text-[10px] font-medium ${catConfig.color} mb-2`}>
                    <Icon className="h-3 w-3" />
                    {getGradeLabel(pack.gradeLevel as any, isAr ? 'ar' : 'fr')}
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {t(pack.nameAr, pack.nameFr || pack.nameAr)}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center gap-2">
                    <span className="text-lg font-extrabold text-primary">
                      {formatDZD(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatDZD(pack.basePriceDZD)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => {
            const category = getGradeCategory(pack.gradeLevel as any);
            const catConfig = categoryConfig[category] || categoryConfig.primaire;
            const Icon = categoryIcons[category] || BookOpen;
            const finalPrice = getDiscountedPrice(pack.basePriceDZD, pack.discountPercent);
            const hasDiscount = pack.discountPercent > 0;

            return (
              <Link
                key={pack.id}
                href={`/pack-builder?grade=${pack.gradeLevel}`}
                className="group flex flex-col rounded-2xl border bg-card overflow-hidden shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className={`flex h-full items-center justify-center bg-gradient-to-br ${catConfig.bg} to-white`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${catConfig.bg} ${catConfig.color} shadow-sm`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground/60">{getGradeLabel(pack.gradeLevel as any, isAr ? 'ar' : 'fr')}</span>
                    </div>
                  </div>
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                      {t('خصم', 'Promo')} {pack.discountPercent}%
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <div className={`inline-flex items-center gap-1.5 self-start rounded-lg ${catConfig.bg} px-2.5 py-1 text-xs font-medium ${catConfig.color} mb-3`}>
                    <Icon className="h-3.5 w-3.5" />
                    {getGradeLabel(pack.gradeLevel as any, isAr ? 'ar' : 'fr')}
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {t(pack.nameAr, pack.nameFr || pack.nameAr)}
                  </h3>
                  {pack.descriptionAr && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {t(pack.descriptionAr, pack.descriptionFr || pack.descriptionAr)}
                    </p>
                  )}
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <span className="text-xl font-extrabold text-primary">
                      {formatDZD(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatDZD(pack.basePriceDZD)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
