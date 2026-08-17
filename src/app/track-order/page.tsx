'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { getOrderByOrderNumber } from '@/lib/order-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderReceipt } from '@/components/order-receipt';
import {
  Search,
  ChevronLeft,
  Loader2,
} from 'lucide-react';

export default function TrackOrderPage() {
  const { t } = useLanguage();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    const result = await getOrderByOrderNumber(orderNumber);
    if (result.success && result.order) {
      setOrder(result.order);
    } else {
      setError(
        t(
          'لم نجد طلباً بهذا الرقم. تأكد من صحة الرقم وحاول مرة أخرى.',
          'Aucune commande trouvée avec ce numéro. Vérifiez et réessayez.'
        )
      );
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary/[0.04] py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            {t('تتبع طلبك', 'Suivre votre commande')}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t(
              'أدخل رقم طلبك لمتابعة حالته مباشرة بدون تسجيل الدخول',
              'Entrez votre numéro de commande pour suivre son état sans connexion'
            )}
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('مثال: HAK-2026-1234', 'Ex: HAK-2026-1234')}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="h-12 ps-10 text-center sm:text-start"
                dir="ltr"
              />
            </div>
            <Button type="submit" className="h-12 w-full sm:w-auto px-6" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {t('بحث', 'Rechercher')}
                  <ChevronLeft className="h-4 w-4 ms-1" />
                </>
              )}
            </Button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-destructive max-w-md mx-auto">{error}</p>
          )}
        </div>
      </section>

      {/* Order result */}
      {order && (
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <OrderReceipt order={order} />
          </div>
        </section>
      )}
    </main>
  );
}
