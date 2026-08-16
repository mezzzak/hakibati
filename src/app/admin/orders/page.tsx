'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-provider';
import { getAllOrders } from '@/lib/admin-actions';
import { AdminOrderDrawer } from '@/components/admin-order-drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDZD, formatDate, displayPhone } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Eye,
  RefreshCw,
  Phone,
  Printer,
  FileDown,
} from 'lucide-react';

const statusLabels: Record<string, { ar: string; fr: string }> = {
  PENDING_CONFIRMATION: { ar: 'بانتظار التأكيد', fr: 'En attente' },
  CONFIRMED: { ar: 'مؤكد', fr: 'Confirmé' },
  DISPATCHED: { ar: 'قيد الإرسال', fr: 'En cours d\'envoi' },
  DELIVERED: { ar: 'تم التسليم', fr: 'Livré' },
  CANCELLED: { ar: 'ملغى', fr: 'Annulé' },
};

export default function AdminOrdersPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { t, isAr } = useLanguage();
  const userRole = (session?.user?.role as string) || 'ADMIN';
  const isLoadingSession = sessionStatus === 'loading';

  const allTabs = [
    { key: 'ALL', label: t('الكل', 'Tout') },
    { key: 'PENDING_CONFIRMATION', label: t('بانتظار التأكيد', 'En attente') },
    { key: 'CONFIRMED', label: t('مؤكد', 'Confirmé') },
    { key: 'DISPATCHED', label: t('قيد الإرسال', 'En cours') },
    { key: 'DELIVERED', label: t('تم التسليم', 'Livré') },
    { key: 'CANCELLED', label: t('ملغى', 'Annulé') },
  ];

  const allowedStatuses = (() => {
    switch (userRole) {
      case 'SHIPPING_AGENT':
        return ['ALL', 'DISPATCHED', 'DELIVERED'];
      case 'PREP_AGENT':
        return ['ALL', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'];
      case 'ORDER_CONFIRMATION_AGENT':
        return ['ALL', 'PENDING_CONFIRMATION', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
      default:
        return ['ALL', 'PENDING_CONFIRMATION', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
    }
  })();

  const tabs = allTabs.filter((tab) => allowedStatuses.includes(tab.key));

  const statusConfig: Record<string, { color: string; icon: any }> = {
    PENDING_CONFIRMATION: { color: 'bg-amber-100 text-amber-700', icon: Clock },
    CONFIRMED: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    DISPATCHED: { color: 'bg-indigo-100 text-indigo-700', icon: Truck },
    DELIVERED: { color: 'bg-emerald-100 text-emerald-700', icon: PackageCheck },
    CANCELLED: { color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const getDefaultTab = (role: string) => {
    if (role === 'SHIPPING_AGENT') return 'ALL';
    if (role === 'PREP_AGENT') return 'ALL';
    return 'ALL';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTab(userRole));
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (isLoadingSession) return;
    if (showLoading) setLoading(true);
    const status = activeTab === 'ALL' ? undefined : activeTab;
    const result = await getAllOrders({ status });
    if (result.success) {
      let fetched = result.orders || [];
      // Extra safety: filter orders by role so agents only see what they can act on
      if (userRole === 'SHIPPING_AGENT') {
        fetched = fetched.filter((o) => ['DISPATCHED', 'DELIVERED'].includes(o.status));
      } else if (userRole === 'PREP_AGENT') {
        fetched = fetched.filter((o) => ['CONFIRMED', 'DISPATCHED', 'DELIVERED'].includes(o.status));
      }
      setOrders(fetched);
    }
    if (showLoading) setLoading(false);
  }, [activeTab, userRole, isLoadingSession]);

  // Sync selectedOrder with orders list when drawer is open
  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const updated = orders.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  // Update active tab when session role becomes known
  useEffect(() => {
    if (!isLoadingSession) {
      const defaultTab = getDefaultTab(userRole);
      setActiveTab(defaultTab);
    }
  }, [userRole, isLoadingSession]);

  useEffect(() => {
    if (!isLoadingSession) {
      fetchOrders();
    }
  }, [fetchOrders, isLoadingSession]);

  // Auto-poll only when drawer is closed
  useEffect(() => {
    if (drawerOpen) return;
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders, drawerOpen]);

  // Refresh when user returns to the tab (only if drawer closed)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !drawerOpen) {
        fetchOrders(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchOrders, drawerOpen]);

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const openPrintReceipt = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items.map((item: any, idx: number) => {
      const name = item.itemName || item.supplyItem?.nameAr || item.hakibatiPack?.nameAr || '—';
      return `<tr>
        <td style="border:1px solid #ddd;padding:8px;text-align:center">${idx + 1}</td>
        <td style="border:1px solid #ddd;padding:8px">${name}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center">${item.quantity}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center">${item.unitPriceDZD} د.ج</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center">${item.totalPriceDZD} د.ج</td>
      </tr>`;
    }).join('');

    const receiptHtml = `<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="utf-8">
<title>فاتورة ${order.orderNumber}</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; max-width: 720px; margin: 0 auto; color: #333; }
.header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
.header h1 { margin: 0; font-size: 28px; color: #2563eb; }
.header p { margin: 8px 0 0; font-size: 14px; color: #666; }
.meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 14px; }
.meta-box { background: #f8fafc; border-radius: 8px; padding: 12px 16px; flex: 1; margin: 0 6px; }
.meta-box strong { display: block; margin-bottom: 4px; color: #2563eb; }
table { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px; }
th { background: #2563eb; color: #fff; padding: 10px; border: 1px solid #ddd; }
td { border: 1px solid #ddd; }
.totals { width: 300px; margin-right: auto; margin-left: 0; }
.total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
.total-row:last-child { border-bottom: none; font-size: 18px; font-weight: bold; color: #2563eb; border-top: 2px solid #2563eb; margin-top: 8px; padding-top: 12px; }
.footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
@media print { body { padding: 0; } .no-print { display: none; } }
</style>
</head>
<body>
<div class="header">
  <h1>حقيبتي Hakibati</h1>
  <p>فاتورة طلب — ${order.orderNumber}</p>
</div>
<div class="meta">
  <div class="meta-box">
    <strong>العميل</strong>
    ${order.customerName}<br>
    ${displayPhone(order.customerPhone)}
  </div>
  <div class="meta-box">
    <strong>العنوان</strong>
    ${order.wilaya} — ${order.commune}<br>
    ${order.address}
  </div>
  <div class="meta-box">
    <strong>الطلب</strong>
    التاريخ: ${new Date(order.createdAt).toLocaleDateString('ar-DZ')}
  </div>
</div>
<table>
  <thead>
    <tr>
      <th style="width:40px">#</th>
      <th>المنتج</th>
      <th style="width:60px">الكمية</th>
      <th style="width:100px">السعر</th>
      <th style="width:100px">المجموع</th>
    </tr>
  </thead>
  <tbody>${itemsHtml}</tbody>
</table>
<div class="totals">
  <div class="total-row"><span>المجموع الفرعي</span><span>${order.subtotalDZD} د.ج</span></div>
  <div class="total-row"><span>رسوم التوصيل</span><span>${order.shippingCostDZD} د.ج</span></div>
  <div class="total-row"><span>المجموع الإجمالي</span><span>${order.totalDZD} د.ج</span></div>
</div>
<div class="footer">
  شكراً لثقتكم بنا — Hakibati © ${new Date().getFullYear()}
</div>
</body>
</html>`;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
  };

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('الطلبات', 'Commandes')}</h1>
          <p className="text-muted-foreground text-sm">{t('إدارة ومعالجة جميع الطلبات', 'Gérer et traiter toutes les commandes')}</p>
        </div>
        <button
          onClick={() => fetchOrders(false)}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          title={t('تحديث القائمة', 'Mettre à jour la liste')}
        >
          <RefreshCw className="h-4 w-4" />
          {t('تحديث', 'Actualiser')}
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t('لا توجد طلبات', 'Aucune commande')}</div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('الرقم', 'N°')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('العميل', 'Client')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('الهاتف', 'Téléphone')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('الولاية', 'Wilaya')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('الحالة', 'Statut')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('المبلغ', 'Montant')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}>{t('التاريخ', 'Date')}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium`}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const cfg = statusConfig[order.status] || statusConfig.PENDING_CONFIRMATION;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={order.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => openOrder(order)}
                      >
                        <td className="px-4 py-3 font-mono font-bold">{order.orderNumber}</td>
                        <td className="px-4 py-3">{order.customerName}</td>
                        <td className="px-4 py-3">{displayPhone(order.customerPhone)}</td>
                        <td className="px-4 py-3">{order.wilaya}</td>
                        <td className="px-4 py-3">
                          <Badge className={cfg.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {tabs.find((t) => t.key === order.status)?.label || order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-bold text-primary">{formatDZD(order.totalDZD, isAr ? 'ar-DZ' : 'fr-DZ')}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => openPrintReceipt(order, e)}
                              className="gap-1.5 h-8 text-xs"
                            >
                              <FileDown className="h-3.5 w-3.5" />
                              {t('فاتورة', 'Facture')}
                            </Button>
                            <button className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-3 p-3">
              {orders.map((order) => {
                const cfg = statusConfig[order.status] || statusConfig.PENDING_CONFIRMATION;
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={order.id}
                    className="rounded-xl border bg-card p-4 shadow-sm active:bg-muted/40 transition-colors"
                    onClick={() => openOrder(order)}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-sm shrink-0">{order.orderNumber}</span>
                        <Badge className={`${cfg.color} text-[10px] px-1.5 py-0.5 shrink-0`}>
                          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                          {tabs.find((t) => t.key === order.status)?.label || order.status}
                        </Badge>
                      </div>
                      <span className="font-bold text-primary text-sm shrink-0">
                        {formatDZD(order.totalDZD, isAr ? 'ar-DZ' : 'fr-DZ')}
                      </span>
                    </div>

                    <p className="font-semibold text-sm text-foreground truncate">{order.customerName}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>{displayPhone(order.customerPhone)}</span>
                      <span>·</span>
                      <span>{order.wilaya}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => openPrintReceipt(order, e)}
                          className="gap-1.5 h-8 text-xs"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          {t('فاتورة', 'Facture')}
                        </Button>
                        <a
                          href={`tel:${order.customerPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground active:opacity-80 transition-opacity"
                        >
                          <Phone className="h-3 w-3" />
                          {t('اتصال', 'Appeler')}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Order Drawer */}
      <AdminOrderDrawer
        order={selectedOrder}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusUpdate={fetchOrders}
        userRole={userRole}
      />


    </div>
  );
}
