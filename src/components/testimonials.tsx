'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Star, Quote, Loader2 } from 'lucide-react';
import { getApprovedReviews } from '@/lib/review-actions';

interface Review {
  id: string;
  rating: number;
  comment: string;
  authorName: string | null;
  isAnonymous: boolean;
  createdAt: string;
  order: { wilaya: string } | null;
}

const fallbackTestimonials = [
  {
    nameAr: 'فاطمة من الجزائر العاصمة',
    nameFr: 'Fatima, Alger',
    textAr: 'حقيبتي وفرت عليّ وقت كبير. الحقيبة وصلت كاملة وجودتها ممتازة. أنصح كل أم تستخدمها.',
    textFr: "Hakibati m'a fait gagner beaucoup de temps. Le kit est complet et de qualité. Je recommande.",
  },
  {
    nameAr: 'أحمد من وهران',
    nameFr: 'Ahmed, Oran',
    textAr: 'التوصيل كان سريع والمنتجات أصلية. سأطلب منهم كل عام بدون تردد.',
    textFr: 'Livraison rapide et produits authentiques. Je commanderai chaque année sans hésiter.',
  },
  {
    nameAr: 'ليلى من قسنطينة',
    nameFr: 'Leila, Constantine',
    textAr: 'خدمة رائعة وفكرة ذكية. تخصيص الحقيبة حسب احتياجات ابني ميزة رائعة.',
    textFr: "Service excellent et idée intelligente. Personnaliser le kit selon les besoins de mon fils est génial.",
  },
];

export function Testimonials() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedReviews(9).then((result) => {
      if (result.success && result.reviews) {
        setReviews(JSON.parse(JSON.stringify(result.reviews)) as Review[]);
      }
      setLoading(false);
    });
  }, []);

  const displayItems = reviews.length > 0
    ? reviews.map((r) => ({
        nameAr: r.isAnonymous
          ? `عميل من ${r.order?.wilaya || 'الجزائر'}`
          : r.authorName || `عميل من ${r.order?.wilaya || 'الجزائر'}`,
        nameFr: r.isAnonymous
          ? `Client de ${r.order?.wilaya || 'Algérie'}`
          : r.authorName || `Client de ${r.order?.wilaya || 'Algérie'}`,
        textAr: r.comment,
        textFr: r.comment,
        rating: r.rating,
      }))
    : fallbackTestimonials.map((t) => ({ ...t, rating: 5 }));

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayItems.length <= 1) return;
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
    }, 4000);
    return () => {
      clearInterval(interval);
      el.removeEventListener('pointerdown', handlePointer);
      el.removeEventListener('pointerup', handleLeave);
    };
  }, [displayItems.length]);

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('آراء أولياء التلاميذ', 'Avis des parents')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('ثقة آلاف الأسر في الجزائر', 'La confiance de milliers de familles en Algérie')}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Mobile: horizontal carousel */}
            <div ref={scrollRef} className="sm:hidden flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
              {displayItems.map((item, idx) => (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-[300px] flex flex-col rounded-2xl border bg-background p-5 shadow-card"
                >
                  <Quote className="h-6 w-6 text-primary/20 mb-2" />
                  <p className="flex-1 text-sm text-foreground leading-relaxed mb-3">
                    {t(item.textAr, item.textFr)}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {t(item.nameAr, item.nameFr)}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {displayItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col rounded-2xl border bg-background p-6 shadow-card transition-all hover:shadow-card-hover"
                >
                  <Quote className="h-8 w-8 text-primary/20 mb-3" />
                  <p className="flex-1 text-foreground leading-relaxed mb-4">
                    {t(item.textAr, item.textFr)}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {t(item.nameAr, item.nameFr)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
