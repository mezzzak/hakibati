'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-foreground">عذراً، حدث خطأ غير متوقع</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        نعتذر عن الإزعاج. يمكنك إعادة تحميل الصفحة أو العودة للرئيسية.
      </p>
      {error.digest && (
        <code className="mt-4 block rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          Ref: {error.digest}
        </code>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
        <Button asChild className="gap-2">
          <a href="/">
            <Home className="h-4 w-4" />
            الرئيسية
          </a>
        </Button>
      </div>
    </div>
  );
}
