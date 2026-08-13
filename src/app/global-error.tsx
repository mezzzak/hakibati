'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary mb-2">حقيبتي</h1>
          <h2 className="text-lg font-semibold text-foreground mb-4">حدث خطأ فادح في التطبيق</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            نعتذر عن الإزعاج. يرجى إعادة تحميل الصفحة أو التواصل مع مركز الدعم.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            إعادة التحميل
          </button>
        </div>
      </body>
    </html>
  );
}
