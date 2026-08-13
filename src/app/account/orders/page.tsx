'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-provider';
import { getUserOrders } from '@/lib/order-actions';
import { OrderCard } from '@/components/order-card';
import Link from 'next/link';
import { Package, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccountOrdersPage() {
  const { t, isAr } = useLanguage();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      const result = await getUserOrders(session.user.id);
      if (result.success && result.orders) {
        setOrders(result.orders);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/[0.03] to-background p-6 sm:p-8 shadow-card animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-muted rounded-xl" />
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-48" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 shadow-card animate-pulse">
              <div className="h-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Card */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/[0.03] to-background p-6 sm:p-8 mb-8 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{t('طلباتي', 'Mes commandes')}</h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {t(
                'مرحباً، هنا يمكنك متابعة جميع طلباتك',
                'Bienvenue, suivez ici toutes vos commandes'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Admin shortcut */}
      {session?.user?.role === 'ADMIN' && (
        <Link
          href="/admin/dashboard"
          className="group flex items-center gap-3 rounded-xl border bg-card p-4 mb-8 shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-0.5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 ease-out-expo group-hover:scale-110">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{t('لوحة الإدارة', 'Tableau de bord')}</p>
            <p className="text-xs text-muted-foreground">
              {t('الوصول السريع لإدارة المتجر', 'Accès rapide à la gestion du magasin')}
            </p>
          </div>
          <ArrowRight className={`h-4 w-4 text-muted-foreground transition-all duration-300 ease-out-expo group-hover:text-primary ${isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
        </Link>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/5 mb-6">
            <Package className="h-12 w-12 text-primary/40" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {t('لا توجد طلبات حتى الآن', 'Aucune commande pour le moment')}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
            {t(
              'ابدأ بتصفح حقائبنا المدرسية وقم بطلبك الأول',
              'Parcourez nos kits scolaires et passez votre première commande'
            )}
          </p>
          <Button
            asChild
            className="mt-6 gap-2 rounded-xl text-base shadow-elevated transition-all duration-200 ease-out-expo hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <Link href="/#grade-selector">
              {t('تصفح الحقائب', 'Parcourir les kits')}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order as any}
              userId={session?.user?.id || ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
