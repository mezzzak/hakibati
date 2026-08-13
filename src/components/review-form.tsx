'use client';

import { useState } from 'react';
import { createReview } from '@/lib/review-actions';
import { Button } from '@/components/ui/button';
import { Star, Send, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  orderId: string;
  userId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ orderId, userId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setResult({ success: false, message: 'الرجاء اختيار تقييم بالنجوم' });
      return;
    }
    if (!comment.trim()) {
      setResult({ success: false, message: 'الرجاء كتابة تعليق' });
      return;
    }

    setLoading(true);
    setResult(null);
    const res = await createReview({
      orderId,
      rating,
      comment: comment.trim(),
      authorName: authorName.trim() || undefined,
      isAnonymous,
      userId,
    });
    setLoading(false);

    if (res.success) {
      setResult({ success: true, message: 'شكراً! تم إرسال تقييمك وسيتم مراجعته.' });
      setRating(0);
      setComment('');
      setAuthorName('');
      setIsAnonymous(false);
      onSuccess?.();
    } else {
      setResult({ success: false, message: res.error || 'فشل إرسال التقييم' });
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6 mb-6">
      <h3 className="text-lg font-bold mb-1">قيّم تجربتك</h3>
      <p className="text-sm text-muted-foreground mb-4">
        شاركنا رأيك لنساعد الآخرين في اختيار حقيبتهم
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            const filled = starValue <= (hoverRating || rating);
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${filled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`}
                />
              </button>
            );
          })}
          <span className="mr-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating} / 5` : ''}
          </span>
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium mb-1 block">تعليقك *</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="كيف كانت تجربتك مع حقيبتي؟"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Author Name */}
        <div>
          <label className="text-sm font-medium mb-1 block">الاسم (اختياري)</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="اسمك كما سيظهر في التقييم"
            disabled={isAnonymous}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:text-muted-foreground"
          />
        </div>

        {/* Anonymous checkbox */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-muted"
          />
          <span>النشر كمجهول</span>
        </label>

        {/* Result message */}
        {result && (
          <div className={`rounded-lg px-4 py-2 text-sm ${result.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          إرسال التقييم
        </Button>
      </form>
    </div>
  );
}
