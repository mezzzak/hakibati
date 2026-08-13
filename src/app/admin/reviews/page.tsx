'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllReviews, approveReview, declineReview } from '@/lib/review-actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle2, XCircle, MessageSquare, Loader2, RefreshCw } from 'lucide-react';

type ReviewStatus = 'all' | 'pending' | 'approved';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ReviewStatus>('all');
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const fetchReviews = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const result = await getAllReviews({ status });
    if (result.success) {
      setReviews(result.reviews || []);
    }
    if (showLoading) setLoading(false);
  }, [status]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Auto-poll every 10 seconds to keep all admins synchronized
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReviews(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchReviews]);

  // Refresh when user returns to the tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchReviews(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchReviews]);

  const handleApprove = async (id: string) => {
    setProcessing((prev) => ({ ...prev, [id]: true }));
    await approveReview(id);
    setProcessing((prev) => ({ ...prev, [id]: false }));
    fetchReviews();
  };

  const handleDecline = async (id: string) => {
    if (!confirm('هل أنت متأكد من رفض/حذف هذا التقييم؟')) return;
    setProcessing((prev) => ({ ...prev, [id]: true }));
    await declineReview(id);
    setProcessing((prev) => ({ ...prev, [id]: false }));
    fetchReviews();
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التقييمات</h1>
          <p className="text-muted-foreground text-sm">مراجعة وإدارة تقييمات العملاء</p>
        </div>
        <button
          onClick={() => fetchReviews(false)}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          title="تحديث القائمة"
        >
          <RefreshCw className="h-4 w-4" />
          تحديث
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatus('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          الكل ({reviews.length})
        </button>
        <button
          onClick={() => setStatus('pending')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === 'pending' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          بانتظار المراجعة ({pendingCount})
        </button>
        <button
          onClick={() => setStatus('approved')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          معتمد ({approvedCount})
        </button>
      </div>

      {/* Reviews List */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">لا توجد تقييمات</div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-muted/20 transition-colors">
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
                        {review.isApproved ? 'معتمد' : 'بانتظار المراجعة'}
                      </Badge>
                    </div>

                    <p className="text-foreground leading-relaxed mb-3">{review.comment}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-medium">
                        {review.isAnonymous
                          ? 'مجهول'
                          : review.authorName || review.user?.fullName || 'عميل'}
                      </span>
                      {review.order && (
                        <>
                          <span>•</span>
                          <span>طلب {review.order.orderNumber}</span>
                          <span>•</span>
                          <span>{review.order.wilaya}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('ar-DZ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!review.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(review.id)}
                        disabled={processing[review.id]}
                        className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        {processing[review.id] ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        اعتماد
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(review.id)}
                      disabled={processing[review.id]}
                      className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {processing[review.id] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      رفض
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
