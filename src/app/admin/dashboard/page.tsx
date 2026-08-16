'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { getAdminAnalytics, getAdminNotifications } from '@/lib/admin-actions';
import { formatDZD } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingCart,
  PackageCheck,
  MapPin,
  Award,
  BarChart3,
  Bell,
  AlertCircle,
  MessageSquare,
  Clock,
  Truck,
  Package,
  Eye,
  Users,
  Globe,
} from 'lucide-react';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, isAr } = useLanguage();

  const [analytics, setAnalytics] = useState<any>(null);
  const [notifs, setNotifs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = (session?.user?.role as string) || '';
  const isAdmin = role === 'ADMIN' || role === 'MASTER_ADMIN';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    if (status === 'authenticated' && (!role || !STAFF_ROLES.includes(role))) {
      router.push('/');
    }
  }, [status, role, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchData() {
      let analyticsData = null;
      if (isAdmin) {
        const analyticsResult = await getAdminAnalytics();
        if (analyticsResult.success && 'data' in analyticsResult) {
          analyticsData = analyticsResult.data;
        }
      }

      const notifResult = await getAdminNotifications(role);
      const notifsData = notifResult.success && notifResult.data
        ? notifResult.data
        : { pendingOrders: 0, pendingReviews: 0, breakdown: { pendingConfirmation: 0, confirmed: 0, dispatched: 0 }, total: 0 };

      setAnalytics(analyticsData);
      setNotifs(notifsData);
      setLoading(false);
    }

    fetchData();
  }, [status, isAdmin, role]);

  if (loading || status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    PENDING_CONFIRMATION: t('بانتظار التأكيد', 'En attente'),
    CONFIRMED: t('مؤكد', 'Confirmé'),
    DISPATCHED: t('قيد الإرسال', 'En cours d\'envoi'),
    DELIVERED: t('تم التسليم', 'Livré'),
    CANCELLED: t('ملغى', 'Annulé'),
  };

  const statusColors: Record<string, string> = {
    PENDING_CONFIRMATION: 'bg-amber-500',
    CONFIRMED: 'bg-blue-500',
    DISPATCHED: 'bg-indigo-500',
    DELIVERED: 'bg-emerald-500',
    CANCELLED: 'bg-red-500',
  };

  const notifLabel = () => {
    switch (role) {
      case 'ORDER_CONFIRMATION_AGENT':
        return { text: t('طلب بانتظار التأكيد', 'Commande en attente'), icon: <Clock className="h-4 w-4" />, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' };
      case 'PREP_AGENT':
        return { text: t('طلب جاهز للتجهيز', 'Commande prête'), icon: <Package className="h-4 w-4" />, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' };
      case 'SHIPPING_AGENT':
        return { text: t('طلب قيد الإرسال', 'Commande en cours'), icon: <Truck className="h-4 w-4" />, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' };
      default:
        return { text: t('طلب يحتاج معالجة', 'Commande à traiter'), icon: <AlertCircle className="h-4 w-4" />, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' };
    }
  };

  const n = notifLabel();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('لوحة التحكم', 'Tableau de bord')}</h1>
        <p className="text-muted-foreground text-sm">
          {isAdmin ? t('نظرة عامة على أداء المتجر', 'Vue d\'ensemble des performances') : t('نظرة عامة على المهام المطلوبة', 'Vue d\'ensemble des tâches')}
        </p>
      </div>

      {/* Notifications */}
      {notifs && notifs.total > 0 && (
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Bell className="h-4 w-4 text-primary" />
            <span>{t('إشعارات جديدة', 'Nouvelles notifications')}</span>
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {notifs.total}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {notifs.pendingOrders > 0 && (
              <Link
                href="/admin/orders"
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors ${n.color}`}
              >
                {n.icon}
                <span>{notifs.pendingOrders} {n.text}</span>
              </Link>
            )}
            {isAdmin && notifs.breakdown && (
              <>
                {notifs.breakdown.pendingConfirmation > 0 && (
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    <span>{notifs.breakdown.pendingConfirmation} {t('بانتظار التأكيد', 'En attente')}</span>
                  </Link>
                )}
                {notifs.breakdown.confirmed > 0 && (
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span>{notifs.breakdown.confirmed} {t('جاهز للتجهيز', 'Prêt')}</span>
                  </Link>
                )}
                {notifs.breakdown.dispatched > 0 && (
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <Truck className="h-4 w-4" />
                    <span>{notifs.breakdown.dispatched} {t('قيد الإرسال', 'En cours')}</span>
                  </Link>
                )}
              </>
            )}
            {isAdmin && notifs.pendingReviews > 0 && (
              <Link
                href="/admin/reviews"
                className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{notifs.pendingReviews} {t('تقييم بانتظار المراجعة', 'Avis en attente')}</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Agent Quick Stats */}
      {!isAdmin && notifs?.breakdown && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title={t('بانتظار التأكيد', 'En attente')}
            value={notifs.breakdown.pendingConfirmation.toString()}
            icon={<Clock className="h-5 w-5" />}
            color="bg-amber-500"
          />
          <MetricCard
            title={t('جاهز للتجهيز', 'Prêt')}
            value={notifs.breakdown.confirmed.toString()}
            icon={<Package className="h-5 w-5" />}
            color="bg-blue-500"
          />
          <MetricCard
            title={t('قيد الإرسال', 'En cours')}
            value={notifs.breakdown.dispatched.toString()}
            icon={<Truck className="h-5 w-5" />}
            color="bg-indigo-500"
          />
        </div>
      )}

      {/* Admin Analytics */}
      {isAdmin && analytics && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <MetricCard
              title={t('إجمالي الإيرادات', 'Revenus totaux')}
              value={formatDZD(analytics.totalRevenue, isAr ? 'ar-DZ' : 'fr-DZ')}
              icon={<TrendingUp className="h-5 w-5" />}
              color="bg-primary"
            />
            <MetricCard
              title={t('إجمالي الطلبات', 'Total commandes')}
              value={analytics.totalOrders.toString()}
              icon={<ShoppingCart className="h-5 w-5" />}
              color="bg-blue-500"
            />
            <MetricCard
              title={t('معدل الإنجاز', 'Taux d\'accomplissement')}
              value={`${analytics.fulfillmentRate}%`}
              icon={<PackageCheck className="h-5 w-5" />}
              color="bg-emerald-500"
            />
            <MetricCard
              title={t('الطلبات النشطة', 'Commandes actives')}
              value={analytics.ordersByStatus
                .filter((s: any) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED')
                .reduce((sum: number, s: any) => sum + s._count.status, 0)
                .toString()}
              icon={<BarChart3 className="h-5 w-5" />}
              color="bg-amber-500"
            />
          </div>

          {/* Visitor Analytics */}
          {analytics?.visitors && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">{t('إحصائيات الزوار', 'Statistiques des visiteurs')}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <MetricCard
                  title={t('إجمالي المشاهدات', 'Total vues')}
                  value={String(analytics.visitors.totalPageViews ?? 0)}
                  icon={<Eye className="h-5 w-5" />}
                  color="bg-violet-500"
                />
                <MetricCard
                  title={t('زوار فريدون', 'Visiteurs uniques')}
                  value={String(analytics.visitors.uniqueVisitors ?? 0)}
                  icon={<Users className="h-5 w-5" />}
                  color="bg-pink-500"
                />
                <MetricCard
                  title={t('مشاهدات 7 أيام', 'Vues 7 jours')}
                  value={String(analytics.visitors.pageViewsLast7Days ?? 0)}
                  icon={<BarChart3 className="h-5 w-5" />}
                  color="bg-cyan-500"
                />
                <MetricCard
                  title={t('مشاهدات 30 يوم', 'Vues 30 jours')}
                  value={String(analytics.visitors.pageViewsLast30Days ?? 0)}
                  icon={<TrendingUp className="h-5 w-5" />}
                  color="bg-orange-500"
                />
              </div>

              {/* Top Pages */}
              {analytics.visitors.topPages && analytics.visitors.topPages.length > 0 && (
                <div className="rounded-2xl border bg-card p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {t('أكثر الصفحات زيارة', 'Pages les plus visitées')}
                  </h2>
                  <div className="space-y-3">
                    {analytics.visitors.topPages.map((p: any, idx: number) => (
                      <div key={p.path} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-sm font-mono">{p.path}</span>
                          <span className="text-sm font-bold">{p._count?.path ?? 0} {t('مشاهدة', 'vue')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Orders by Status */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">{t('الطلبات حسب الحالة', 'Commandes par statut')}</h2>
              <div className="space-y-3">
                {analytics.ordersByStatus.map((item: any) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${statusColors[item.status] || 'bg-gray-400'}`} />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm">{statusLabels[item.status] || item.status}</span>
                      <span className="text-sm font-bold">{item._count.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Wilayas */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t('أعلى 5 ولايات', 'Top 5 wilayas')}
              </h2>
              <div className="space-y-3">
                {analytics.topWilayas.map((w: any, idx: number) => (
                  <div key={w.wilaya} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm">{w.wilaya}</span>
                      <span className="text-sm font-bold">{w._count.wilaya} {t('طلب', 'commande')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Packs */}
            <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {t('أكثر الحقائب مبيعاً', 'Kits les plus vendus')}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analytics.topPacks.map((pack: any, idx: number) => (
                  <div
                    key={pack.id}
                    className="flex items-center gap-3 rounded-xl border p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{pack.nameAr}</p>
                      <p className="text-xs text-muted-foreground">{pack.totalSold} {t('مباع', 'vendu')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${color}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-extrabold">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
