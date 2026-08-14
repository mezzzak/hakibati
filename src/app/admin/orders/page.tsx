'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-provider';
import { getAllOrders } from '@/lib/admin-actions';
import { AdminOrderDrawer } from '@/components/admin-order-drawer';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

const statusLabels: Record<string, { ar: string; fr: string }> = {
  PENDING_CONFIRMATION: { ar: 'بانتظار التأكيد', fr: 'En attente' },
  CONFIRMED: { ar: 'مؤكد', fr: 'Confirmé' },
  DISPATCHED: { ar: 'قيد الإرسال', fr: 'En cours d\'envoi' },
  DELIVERED: { ar: 'تم التسليم', fr: 'Livré' },
  CANCELLED: { ar: 'ملغى', fr: 'Annulé' },
};

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const { t, isAr } = useLanguage();
  const userRole = (session?.user?.role as string) || 'ADMIN';

  const tabs = [
    { key: 'ALL', label: t('الكل', 'Tout') },
    { key: 'PENDING_CONFIRMATION', label: t('بانتظار التأكيد', 'En attente') },
    { key: 'CONFIRMED', label: t('مؤكد', 'Confirmé') },
    { key: 'DISPATCHED', label: t('قيد الإرسال', 'En cours') },
    { key: 'DELIVERED', label: t('تم التسليم', 'Livré') },
    { key: 'CANCELLED', label: t('ملغى', 'Annulé') },
  ];

  const statusConfig: Record<string, { color: string; icon: any }> = {
    PENDING_CONFIRMATION: { color: 'bg-amber-100 text-amber-700', icon: Clock },
    CONFIRMED: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    DISPATCHED: { color: 'bg-indigo-100 text-indigo-700', icon: Truck },
    DELIVERED: { color: 'bg-emerald-100 text-emerald-700', icon: PackageCheck },
    CANCELLED: { color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const status = activeTab === 'ALL' ? undefined : activeTab;
    const result = await getAllOrders({ status });
    if (result.success) {
      setOrders(result.orders || []);
    }
    if (showLoading) setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-poll every 10 seconds to keep all agents synchronized
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Refresh when user returns to the tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchOrders(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchOrders]);

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

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
                          <button className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
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
