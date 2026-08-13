import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getUserReviews, deleteReview } from '@/lib/review-actions';
import { UserReviewsClient } from './client';
import { MessageSquare } from 'lucide-react';

export default async function AccountReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const result = await getUserReviews(session.user.id);
  const reviewsRaw = result.success && result.reviews ? result.reviews : [];
  const reviews = JSON.parse(JSON.stringify(reviewsRaw));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">تقييماتي</h1>
          <p className="text-sm text-muted-foreground">التقييمات التي كتبتها</p>
        </div>
      </div>

      <UserReviewsClient reviews={reviews} userId={session.user.id} />
    </div>
  );
}
