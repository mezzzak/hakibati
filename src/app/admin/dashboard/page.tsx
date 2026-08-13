import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
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
} from 'lucide-react';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  const role = session.user.role;
  if (!role || !STAFF_ROLES.includes(role)) {
    redirect('/');
  }

  const isAdmin = role === 'ADMIN' || role === 'MASTER_ADMIN';

  let analytics = null;
  if (isAdmin) {
    const analyticsResult = await getAdminAnalytics();
    if (analyticsResult.success && 'data' in analyticsResult) {
      analytics = analyticsResult.data;
    }
  }

  const notifResult = await getAdminNotifications(role);
  const notifs = notifResult.success && notifResult.data ? notifResult.data : { pendingOrders: 0, pendingReviews: 0, breakdown: { pendingConfirmation: 0, confirmed: 0, dispatched: 0 }, total: 0 };

  const statusLabels: Record<string, string> = {
    PENDING_CONFIRMATION: 'بانتظار التأكيد',
    CONFIRMED: 'مؤكد',
    DISPATCHED: 'قيد الإرسال',
    DELIVERED: 'تم التسليم',
    CANCELLED: 'ملغى',
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
        return { text: 'طلب بانتظار التأكيد', icon: <Clock className="h-4 w-4" />, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' };
      case 'PREP_AGENT':
        return { text: 'طلب جاهز للتجهيز', icon: <Package className="h-4 w-4" />, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' };
      case 'SHIPPING_AGENT':
        return { text: 'طلب قيد الإرسال', icon: <Truck className="h-4 w-4" />, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' };
      default:
        return { text: 'طلب يحتاج معالجة', icon: <AlertCircle className="h-4 w-4" />, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' };
    }
  };

  const n = notifLabel();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm">
          {isAdmin ? 'نظرة عامة على أداء المتجر' : 'نظرة عامة على المهام المطلوبة'}
        </p>
      </div>

      {/* Notifications */}
      {notifs.total > 0 && (
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Bell className="h-4 w-4 text-primary" />
            <span>إشعارات جديدة</span>
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
                    <span>{notifs.breakdown.pendingConfirmation} بانتظار التأكيد</span>
                  </Link>
                )}
                {notifs.breakdown.confirmed > 0 && (
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span>{notifs.breakdown.confirmed} جاهز للتجهيز</span>
                  </Link>
                )}
                {notifs.breakdown.dispatched > 0 && (
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <Truck className="h-4 w-4" />
                    <span>{notifs.breakdown.dispatched} قيد الإرسال</span>
                  </Link>
                )}
              </>
            )}
            {notifs.pendingReviews > 0 && (
              <Link
                href="/admin/reviews"
                className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{notifs.pendingReviews} تقييم بانتظار المراجعة</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Agent Quick Stats */}
      {!isAdmin && notifs.breakdown && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="بانتظار التأكيد"
            value={notifs.breakdown.pendingConfirmation.toString()}
            icon={<Clock className="h-5 w-5" />}
            color="bg-amber-500"
          />
          <MetricCard
            title="جاهز للتجهيز"
            value={notifs.breakdown.confirmed.toString()}
            icon={<Package className="h-5 w-5" />}
            color="bg-blue-500"
          />
          <MetricCard
            title="قيد الإرسال"
            value={notifs.breakdown.dispatched.toString()}
            icon={<Truck className="h-5 w-5" />}
            color="bg-indigo-500"
          />
        </div>
      )}

      {/* Admin Analytics */}
      {isAdmin && analytics && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="إجمالي الإيرادات"
              value={formatDZD(analytics.totalRevenue)}
              icon={<TrendingUp className="h-5 w-5" />}
              color="bg-primary"
            />
            <MetricCard
              title="إجمالي الطلبات"
              value={analytics.totalOrders.toString()}
              icon={<ShoppingCart className="h-5 w-5" />}
              color="bg-blue-500"
            />
            <MetricCard
              title="معدل الإنجاز"
              value={`${analytics.fulfillmentRate}%`}
              icon={<PackageCheck className="h-5 w-5" />}
              color="bg-emerald-500"
            />
            <MetricCard
              title="الطلبات النشطة"
              value={analytics.ordersByStatus
                .filter((s: any) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED')
                .reduce((sum: number, s: any) => sum + s._count.status, 0)
                .toString()}
              icon={<BarChart3 className="h-5 w-5" />}
              color="bg-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Orders by Status */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">الطلبات حسب الحالة</h2>
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
                أعلى 5 ولايات
              </h2>
              <div className="space-y-3">
                {analytics.topWilayas.map((w: any, idx: number) => (
                  <div key={w.wilaya} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm">{w.wilaya}</span>
                      <span className="text-sm font-bold">{w._count.wilaya} طلب</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Packs */}
            <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                أكثر الحقائب مبيعاً
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
                      <p className="text-xs text-muted-foreground">{pack.totalSold} مباع</p>
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
