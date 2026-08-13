'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-provider';
import { getOrderById } from '@/lib/order-actions';
import { getReviewByOrderId } from '@/lib/review-actions';
import { formatDZD, formatDate, displayPhone } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrintButton } from '@/components/print-button';
import { ReviewForm } from '@/components/review-form';
import { CheckCircle2, Package, Phone, MapPin, Truck, ClipboardCheck, User as UserIcon } from 'lucide-react';

const statusLabels: Record<string, { ar: string; fr: string; color: string }> = {
  PENDING_CONFIRMATION: { ar: 'بانتظار التأكيد', fr: 'En attente de confirmation', color: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { ar: 'تم التأكيد', fr: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
  DISPATCHED: { ar: 'في الطريق', fr: 'En cours de livraison', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { ar: 'تم التوصيل', fr: 'Livrée', color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { ar: 'ملغاة', fr: 'Annulée', color: 'bg-red-100 text-red-700' },
};

const shippingLabels: Record<string, { ar: string; fr: string }> = {
  HOME_DELIVERY: { ar: 'توصيل للمنزل', fr: 'Livraison à domicile' },
  STOP_DESK: { ar: 'نقطة استلام', fr: 'Point de retrait' },
  OFFICE_PICKUP: { ar: 'استلام من المكتب', fr: 'Retrait au bureau' },
  YALIDINE: { ar: 'ياليدين', fr: 'Yalidine' },
  ECO_SHIPPING: { ar: 'توصيل اقتصادي', fr: 'Livraison économique' },
};

export default function OrderSuccessPage() {
  const { t, isAr } = useLanguage();
  const params = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [hasReview, setHasReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const id = params.id as string;
      if (!id) return;
      const result = await getOrderById(id);
      if (result.success && result.order) {
        setOrder(result.order);
        const reviewResult = await getReviewByOrderId(result.order.id);
        setHasReview(!!reviewResult.review);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="h-20 w-20 bg-muted rounded-full mx-auto" />
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t('الطلب غير موجود', 'Commande introuvable')}</h1>
        <Button asChild className="mt-6">
          <Link href="/">{t('العودة للرئيسية', 'Retour à l\'accueil')}</Link>
        </Button>
      </div>
    );
  }

  const status = statusLabels[order.status] || statusLabels.PENDING_CONFIRMATION;
  const shipping = shippingLabels[order.shippingMethod] || { ar: order.shippingMethod, fr: order.shippingMethod };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold">
            {t('تم تأكيد طلبك بنجاح!', 'Votre commande est confirmée !')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('سنقوم بالاتصال بك قريباً لتأكيد التفاصيل', 'Nous vous contacterons bientôt pour confirmer les détails')}
          </p>
          <div className="mt-4 flex justify-center print:hidden">
            <PrintButton />
          </div>
        </div>

        {/* Printable Receipt */}
        <div className="printable-receipt">

        {/* Order Reference Card */}
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('رقم الطلب', 'N° de commande')}</p>
                <p className="text-xl font-bold font-mono">{order.orderNumber}</p>
              </div>
            </div>
            <Badge className={status.color}>{t(status.ar, status.fr)}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{t('تاريخ الطلب', 'Date')}</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('طريقة التوصيل', 'Mode de livraison')}</p>
              <p className="font-medium">{t(shipping.ar, shipping.fr)}</p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            {t('بيانات التوصيل', 'Informations de livraison')}
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">{t('الاسم', 'Nom')}</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">{t('الهاتف', 'Téléphone')}</p>
                <p className="font-medium">{displayPhone(order.customerPhone)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">{t('العنوان', 'Adresse')}</p>
                <p className="font-medium">
                  {order.address}، {order.commune}، {order.wilaya}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">{t('تفاصيل الطلب', 'Détails de la commande')}</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-start justify-between py-2 border-b last:border-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {t(
                        item.supplyItem?.nameAr || item.hakibatiPack?.nameAr || '',
                        item.supplyItem?.nameFr || item.hakibatiPack?.nameFr || item.supplyItem?.nameAr || item.hakibatiPack?.nameAr || ''
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDZD(item.unitPriceDZD)} / {t('الوحدة', 'unité')}
                    </p>
                    {item.hakibatiPack?.items && item.hakibatiPack.items.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{t('المحتويات:', 'Contenu :')}</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {item.hakibatiPack.items.map((pi: any, idx: number) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="text-primary">•</span>
                              {t(pi.supplyItem?.nameAr, pi.supplyItem?.nameFr || pi.supplyItem?.nameAr)} ×{pi.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <p className="font-bold text-sm shrink-0">{formatDZD(item.totalPriceDZD)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('المجموع الفرعي', 'Sous-total')}</span>
              <span>{formatDZD(order.subtotalDZD)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('رسوم التوصيل', 'Frais de livraison')}</span>
              <span>{formatDZD(order.shippingCostDZD)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>{t('المجموع الإجمالي', 'Total')}</span>
              <span className="text-primary">{formatDZD(order.totalDZD)}</span>
            </div>
          </div>
        </div>

        </div>

        {/* Review Form */}
        {!hasReview && (
          <ReviewForm
            orderId={order.id}
            userId={session?.user?.id || undefined}
          />
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">
              <ClipboardCheck className="h-4 w-4 me-2" />
              {t('متابعة التسوق', 'Continuer les achats')}
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/account/orders">
              <Package className="h-4 w-4 me-2" />
              {t('طلباتي', 'Mes commandes')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function User(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
