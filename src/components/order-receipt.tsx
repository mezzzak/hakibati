'use client';

import { useRef } from 'react';
import { useLanguage } from '@/components/language-provider';
import { formatDZD, formatDate, displayPhone } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OrderStatusTimeline } from '@/components/order-card';
import {
  Package,
  Truck,
  User,
  Phone,
  MapPin,
  Building2,
  Home,
  CreditCard,
  FileDown,
  Printer,
  Calendar,
  Hash,
  StickyNote,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unitPriceDZD: number;
  totalPriceDZD: number;
  itemName: string | null;
  supplyItem: { nameAr: string; nameFr: string | null } | null;
  hakibatiPack: {
    nameAr: string;
    nameFr: string | null;
    items: {
      quantity: number;
      supplyItem: { nameAr: string; nameFr: string | null } | null;
    }[];
  } | null;
}

interface OrderReceiptProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    shippingMethod: string;
    shippingCostDZD: number;
    subtotalDZD: number;
    totalDZD: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    wilaya: string;
    commune: string;
    address: string;
    notes: string | null;
    createdAt: string;
    items: OrderItem[];
  };
}

const shippingLabels: Record<string, { ar: string; fr: string }> = {
  HOME_DELIVERY: { ar: 'توصيل للمنزل', fr: 'Livraison à domicile' },
  OFFICE_PICKUP: { ar: 'استلام من المكتب', fr: 'Retrait au bureau' },
  STOP_DESK: { ar: 'نقطة استلام', fr: 'Point de retrait' },
  YALIDINE: { ar: 'ياليدين', fr: 'Yalidine' },
  ECO_SHIPPING: { ar: 'توصيل اقتصادي', fr: 'Livraison éco' },
};

export function OrderReceipt({ order }: OrderReceiptProps) {
  const { t } = useLanguage();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const shippingLabel = shippingLabels[order.shippingMethod] || {
    ar: order.shippingMethod,
    fr: order.shippingMethod,
  };

  return (
    <div>
      {/* Actions - hidden when printing */}
      <div className="flex items-center gap-3 mb-6 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          {t('طباعة / تحميل PDF', 'Imprimer / PDF')}
        </Button>
      </div>

      {/* Receipt - this gets printed */}
      <div
        ref={receiptRef}
        className="bg-white rounded-2xl border shadow-card p-6 sm:p-10 print:shadow-none print:border-none print:p-0 print:rounded-none"
      >
        {/* Receipt Header */}
        <div className="flex items-start justify-between border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">حقيبتي Hakibati</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('الأدوات المدرسية بنقرة واحدة', 'Fournitures scolaires en un clic')}
            </p>
          </div>
          <div className="text-start">
            <p className="text-sm font-bold">{t('فاتورة طلب', 'Facture commande')}</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 justify-start">
              <Hash className="h-3 w-3" />
              {order.orderNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 justify-start">
              <Calendar className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 print:hidden">
          <OrderStatusTimeline status={order.status} />
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t('معلومات العميل', 'Informations client')}
            </h3>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {order.customerName}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {displayPhone(order.customerPhone)}
              </p>
              {order.customerEmail && (
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  {order.customerEmail}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              {t('عنوان التوصيل', 'Adresse de livraison')}
            </h3>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {order.wilaya}
              </p>
              <p className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {order.commune}
              </p>
              <p className="flex items-center gap-2">
                <Home className="h-3.5 w-3.5 text-muted-foreground" />
                <span dir="auto">{order.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                {t(shippingLabel.ar, shippingLabel.fr)}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Package className="h-4 w-4 text-primary" />
            {t('تفاصيل الطلب', 'Détails de la commande')}
          </h3>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">{t('المنتج', 'Produit')}</th>
                  <th className="px-4 py-3 text-center font-medium w-24">{t('الكمية', 'Qté')}</th>
                  <th className="px-4 py-3 text-end font-medium w-32">{t('السعر', 'Prix')}</th>
                  <th className="px-4 py-3 text-end font-medium w-32">{t('المجموع', 'Total')}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {item.supplyItem?.nameAr || item.hakibatiPack?.nameAr || item.itemName || '-'}
                      </span>
                      {(item.supplyItem?.nameFr || item.hakibatiPack?.nameFr) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.supplyItem?.nameFr || item.hakibatiPack?.nameFr}
                        </p>
                      )}
                      {item.hakibatiPack?.items && item.hakibatiPack.items.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            {t('المحتويات:', 'Contenu:')}
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {item.hakibatiPack.items.map((pi, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="text-primary">•</span>
                                {pi.supplyItem?.nameAr} ×{pi.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3 text-left text-muted-foreground">
                      {formatDZD(item.unitPriceDZD)}
                    </td>
                    <td className="px-4 py-3 text-left font-semibold">
                      {formatDZD(item.totalPriceDZD)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-72 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('المجموع الفرعي', 'Sous-total')}</span>
              <span>{formatDZD(order.subtotalDZD)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('مصاريف التوصيل', 'Frais de livraison')}</span>
              <span>{formatDZD(order.shippingCostDZD)}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between text-lg font-extrabold">
              <span>{t('المجموع الكلي', 'Total général')}</span>
              <span className="text-primary">{formatDZD(order.totalDZD)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="rounded-xl bg-muted/30 p-4 mb-6">
            <p className="text-sm font-medium flex items-center gap-2 mb-1">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
              {t('ملاحظات', 'Notes')}
            </p>
            <p className="text-sm text-muted-foreground" dir="auto">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t('شكراً لثقتكم بـ حقيبتي', 'Merci de votre confiance en Hakibati')}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {t('للاستفسارات: contact@hakibati.dz | 0663-14-17-88', 'Contact: contact@hakibati.dz | 0663-14-17-88')}
          </p>
        </div>
      </div>
    </div>
  );
}
