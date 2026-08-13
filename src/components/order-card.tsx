'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { formatDZD, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { reorderOrder } from '@/lib/order-actions';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  ChevronLeft,
  Eye,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unitPriceDZD: number;
  totalPriceDZD: number;
  supplyItem: { nameAr: string } | null;
  hakibatiPack: { nameAr: string } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  shippingMethod: string;
  totalDZD: number;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { labelAr: string; labelFr: string; color: string; icon: any }> = {
  PENDING_CONFIRMATION: { labelAr: 'بانتظار التأكيد', labelFr: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  CONFIRMED: { labelAr: 'تم التأكيد', labelFr: 'Confirmée', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  DISPATCHED: { labelAr: 'في الطريق', labelFr: 'Expédiée', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  DELIVERED: { labelAr: 'تم التوصيل', labelFr: 'Livrée', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  CANCELLED: { labelAr: 'ملغى', labelFr: 'Annulée', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function OrderCard({ order, userId }: { order: Order; userId: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  const config = statusConfig[order.status] || statusConfig.PENDING_CONFIRMATION;
  const StatusIcon = config.icon;

  const handleReorder = async () => {
    await reorderOrder(order.id, userId);
    router.refresh();
  };

  return (
    <div className="group rounded-2xl border bg-card overflow-hidden shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 ease-out-expo group-hover:scale-105">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <Badge className={`${config.color} gap-1.5 px-2.5 py-1 text-xs font-medium`}>
          <StatusIcon className="h-3 w-3" />
          {t(config.labelAr, config.labelFr)}
        </Badge>
      </div>

      {/* Items */}
      <div className="p-4 sm:p-5 space-y-2.5">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground truncate max-w-[220px] leading-relaxed">
              {item.supplyItem?.nameAr || item.hakibatiPack?.nameAr}
            </span>
            <span className="font-semibold text-foreground shrink-0">×{item.quantity}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-muted-foreground">
            +{order.items.length - 3} {t('عناصر أخرى', 'autres articles')}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t p-4 sm:p-5">
        <p className="text-lg font-extrabold text-primary">{formatDZD(order.totalDZD)}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Link href={`/account/orders/${order.id}`}>
              <Eye className="h-4 w-4" />
              {t('التفاصيل', 'Détails')}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReorder}
            className="gap-1.5 rounded-lg transition-all duration-200 ease-out-expo hover:bg-primary hover:text-primary-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            {t('إعادة الطلب', 'Re-commander')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OrderStatusTimeline({ status }: { status: string }) {
  const { t } = useLanguage();
  const steps = ['PENDING_CONFIRMATION', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'];
  const currentIndex = steps.indexOf(status);

  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
        <XCircle className="h-5 w-5" />
        <span className="font-medium">{t('تم إلغاء هذا الطلب', 'Cette commande a été annulée')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {steps.map((step, idx) => {
        const cfg = statusConfig[step];
        const Icon = cfg.icon;
        const isActive = idx <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                isActive ? cfg.color : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(cfg.labelAr, cfg.labelFr)}
            </div>
            {idx < steps.length - 1 && (
              <ChevronLeft className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground/30'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
