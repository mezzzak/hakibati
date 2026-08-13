'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getAdminNotifications } from '@/lib/admin-actions';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  MessageSquare,
  Users,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const ALL_NAV_ITEMS = [
  {
    href: '/admin/dashboard',
    label: 'لوحة التحكم',
    labelFr: 'Tableau de bord',
    icon: LayoutDashboard,
    badgeKey: null,
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
  {
    href: '/admin/orders',
    label: 'الطلبات',
    labelFr: 'Commandes',
    icon: ShoppingCart,
    badgeKey: 'pendingOrders',
    roles: ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'],
  },
  {
    href: '/admin/products',
    label: 'المنتجات',
    labelFr: 'Produits',
    icon: Package,
    badgeKey: null,
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
  {
    href: '/admin/packs',
    label: 'الحقائب المدرسية',
    labelFr: 'Kits scolaires',
    icon: Boxes,
    badgeKey: null,
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
  {
    href: '/admin/shipping',
    label: 'أسعار التوصيل',
    labelFr: 'Tarifs livraison',
    icon: Truck,
    badgeKey: null,
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
  {
    href: '/admin/reviews',
    label: 'التقييمات',
    labelFr: 'Avis',
    icon: MessageSquare,
    badgeKey: 'pendingReviews',
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
  {
    href: '/admin/users',
    label: 'المستخدمين',
    labelFr: 'Utilisateurs',
    icon: Users,
    badgeKey: null,
    roles: ['MASTER_ADMIN'],
  },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'مسؤول',
  MASTER_ADMIN: 'مدير النظام',
  ORDER_CONFIRMATION_AGENT: 'وكيل تأكيد الطلبات',
  PREP_AGENT: 'وكيل تجهيز الطلبات',
  SHIPPING_AGENT: 'وكيل الشحن',
};

interface AdminSidebarProps {
  userName: string;
  role: string;
  notifications?: {
    pendingOrders: number;
    pendingReviews: number;
    breakdown?: { pendingConfirmation: number; confirmed: number; dispatched: number };
    total: number;
  };
}

export function AdminSidebar({ userName, role, notifications }: AdminSidebarProps) {
  const pathname = usePathname();
  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));

  const [liveNotifs, setLiveNotifs] = useState(notifications);

  const refreshNotifications = useCallback(async () => {
    const result = await getAdminNotifications(role);
    if (result.success && result.data) {
      setLiveNotifs(result.data);
    }
  }, [role]);

  useEffect(() => {
    const interval = setInterval(refreshNotifications, 10000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshNotifications();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshNotifications]);

  const notifMap: Record<string, number> = {
    pendingOrders: liveNotifs?.pendingOrders ?? notifications?.pendingOrders ?? 0,
    pendingReviews: liveNotifs?.pendingReviews ?? notifications?.pendingReviews ?? 0,
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-l bg-background lg:block self-start">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold">لوحة الإدارة</p>
            <p className="text-xs text-muted-foreground">{userName}</p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 pt-3">
          <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">
            {ROLE_LABELS[role] || role}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const badgeCount = item.badgeKey ? notifMap[item.badgeKey] || 0 : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للموقع</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
