'use client';

import { useState } from 'react';
import { deleteReview } from '@/lib/review-actions';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, Loader2, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  authorName: string | null;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: string;
  order: { orderNumber: string; wilaya: string } | null;
}

export function UserReviewsClient({ reviews, userId }: { reviews: Review[]; userId: string }) {
  const { t } = useLanguage();
  const [items, setItems] = useState<Review[]>(reviews);
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  const handleDelete = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من حذف هذا التقييم؟', 'Confirmer la suppression ?'))) return;
    setDeleting((prev) => ({ ...prev, [id]: true }));
    const result = await deleteReview(id, userId);
    setDeleting((prev) => ({ ...prev, [id]: false }));
    if (result.success) {
      setItems((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert(result.error || t('فشل الحذف', 'Échec de la suppression'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 mb-4">
          <MessageSquare className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-lg font-bold">{t('لا توجد تقييمات', 'Aucun avis')}</h2>
        <p className="text-muted-foreground mt-1 max-w-sm">
          {t('ستظهر هنا التقييمات التي تكتبها بعد إتمام طلباتك', 'Les avis que vous écrivez apparaîtront ici après vos commandes')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((review) => (
        <div key={review.id} className="rounded-2xl border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <Badge variant={review.isApproved ? 'default' : 'secondary'}>
                  {review.isApproved ? t('معتمد', 'Approuvé') : t('بانتظار المراجعة', 'En attente de révision')}
                </Badge>
              </div>

              <p className="text-foreground leading-relaxed mb-2">{review.comment}</p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {review.isAnonymous && <span>{t('مجهول', 'Anonyme')}</span>}
                {review.order && (
                  <>
                    <span>{t('طلب', 'Commande')} {review.order.orderNumber}</span>
                    <span>•</span>
                    <span>{review.order.wilaya}</span>
                  </>
                )}
                <span>•</span>
                <span>{new Date(review.createdAt).toLocaleDateString('ar-DZ')}</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(review.id)}
              disabled={deleting[review.id]}
              className="gap-1 text-red-600 border-red-200 hover:bg-red-50 shrink-0"
            >
              {deleting[review.id] ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              {t('حذف', 'Supprimer')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
