'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }: { error?: Error; onReset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-foreground">عذراً، حدث خطأ غير متوقع</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        نعتذر عن الإزعاج. يمكنك إعادة تحميل الصفحة أو العودة للرئيسية.
      </p>
      {error?.message && (
        <code className="mt-4 block rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground max-w-sm break-all">
          {error.message}
        </code>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
        <Button asChild>
          <a href="/">العودة للرئيسية</a>
        </Button>
      </div>
    </div>
  );
}
