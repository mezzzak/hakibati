'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { formatDZD } from '@/lib/utils';
import { getGradeCategory, getGradeLabel, getCategoryLabel } from '@/types';
import { BookOpen, School, GraduationCap, ChevronLeft, Package } from 'lucide-react';
import Image from 'next/image';

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group flex flex-col rounded-2xl border bg-card overflow-hidden shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20"
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

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild className="gap-2 rounded-xl">
            <Link href="/packs">
              {t('عرض الكل', 'Voir tout')}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
