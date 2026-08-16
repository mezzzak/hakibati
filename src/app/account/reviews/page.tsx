'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { getUserReviews, deleteReview } from '@/lib/review-actions';
import { UserReviewsClient } from './client';
import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AccountReviewsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }
    async function fetchReviews() {
      const result = await getUserReviews(session!.user.id);
      const reviewsRaw = result.success && result.reviews ? result.reviews : [];
      setReviews(JSON.parse(JSON.stringify(reviewsRaw)));
      setLoading(false);
    }
    fetchReviews();
  }, [session?.user?.id, router]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t('تقييماتي', 'Mes avis')}</h1>
          <p className="text-sm text-muted-foreground">{t('التقييمات التي كتبتها', 'Les avis que vous avez écrits')}</p>
        </div>
      </div>

      <UserReviewsClient reviews={reviews} userId={session!.user.id} />
    </div>
  );
}
