'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import { formatDZD } from '@/lib/utils';
import { GradeLevel } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  School,
  GraduationCap,
  ChevronLeft,
  Package,
  Sparkles,
} from 'lucide-react';

import { getGradeCategory, getGradeLabel, getCategoryLabel } from '@/types';

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

interface Pack {
  id: string;
  nameAr: string;
  nameFr: string | null;
  descriptionAr: string | null;
  descriptionFr: string | null;
  gradeLevel: string;
  basePriceDZD: number;
  discountPercent: number;
  items: any[];
}

export default function PacksPage() {
  const { t, isAr } = useLanguage();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPacks() {
      try {
        const res = await fetch('/api/packs?activeOnly=true');
        const data = await res.json();
        if (data.success) {
          setPacks(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch packs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPacks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('الحقائب المدرسية', 'Kits scolaires')}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {t(
                'اختر الحقيبة المثالية لطفلك من مجموعاتنا الجاهزة',
                'Choisissez le kit parfait pour votre enfant parmi nos collections'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border bg-card overflow-hidden shadow-card">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : packs.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لا توجد حقائب متاحة حالياً', 'Aucun kit disponible actuellement')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack) => {
              const category = getGradeCategory(pack.gradeLevel as any);
              const catConfig = categoryConfig[category] || categoryConfig.primaire;
              const Icon = categoryIcons[category] || BookOpen;
              const finalPrice = getDiscountedPrice(pack.basePriceDZD, pack.discountPercent);

              return (
                <div
                  key={pack.id}
                  className="group flex flex-col rounded-2xl border bg-card overflow-hidden shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20"
                >
                  {/* Image - hidden until real photos available */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                      <Package className="h-16 w-16 text-primary/30" />
                    </div>
                    {pack.discountPercent > 0 && (
                      <div className="absolute top-3 start-3 flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                        <Sparkles className="h-3 w-3" />
                        {t('خصم', 'Promo')} {pack.discountPercent}%
                      </div>
                    )}
                    <div className={`absolute top-3 end-3 flex items-center gap-1.5 rounded-lg ${catConfig.bg} px-2.5 py-1`}>
                      <Icon className={`h-3.5 w-3.5 ${catConfig.color}`} />
                      <span className={`text-xs font-bold ${catConfig.color}`}>
                        {getGradeLabel(pack.gradeLevel as any, isAr ? 'ar' : 'fr')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold">{t(pack.nameAr, pack.nameFr || pack.nameAr)}</h3>
                    {pack.nameFr && (
                      <p className="text-xs text-muted-foreground mt-0.5">{pack.nameFr}</p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {t(pack.descriptionAr || '', pack.descriptionFr || '')}
                    </p>

                    {/* Items count */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      <span>
                        {pack.items.length} {t('عنصر', 'articles')}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-primary">
                          {formatDZD(finalPrice)}
                        </span>
                        {pack.discountPercent > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatDZD(pack.basePriceDZD)}
                          </span>
                        )}
                      </div>
                      <Link href={`/pack-builder?grade=${pack.gradeLevel}`}>
                        <Button size="sm" className="gap-1.5 rounded-lg transition-all duration-200 ease-out-expo hover:shadow-md">
                          <span>{t('اختيار', 'Choisir')}</span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20">
                            <ChevronLeft className="h-3 w-3" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
