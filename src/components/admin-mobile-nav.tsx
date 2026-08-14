'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  MessageSquare,
  Users,
  Menu,
  X,
} from 'lucide-react';

const ALL_NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', labelFr: 'Tableau de bord', icon: LayoutDashboard, roles: ['ADMIN', 'MASTER_ADMIN'] },
  { href: '/admin/orders', label: 'الطلبات', labelFr: 'Commandes', icon: ShoppingCart, roles: ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'] },
  { href: '/admin/products', label: 'المنتجات', labelFr: 'Produits', icon: Package, roles: ['ADMIN', 'MASTER_ADMIN'] },
  { href: '/admin/packs', label: 'الحقائب المدرسية', labelFr: 'Kits scolaires', icon: Boxes, roles: ['ADMIN', 'MASTER_ADMIN'] },
  { href: '/admin/shipping', label: 'أسعار التوصيل', labelFr: 'Tarifs livraison', icon: Truck, roles: ['ADMIN', 'MASTER_ADMIN'] },
  { href: '/admin/reviews', label: 'التقييمات', labelFr: 'Avis', icon: MessageSquare, roles: ['ADMIN', 'MASTER_ADMIN'] },
  { href: '/admin/users', label: 'المستخدمين', labelFr: 'Utilisateurs', icon: Users, roles: ['MASTER_ADMIN'] },
];

interface AdminMobileNavProps {
  role: string;
}

export function AdminMobileNav({ role }: AdminMobileNavProps) {
  const pathname = usePathname();
  const { t, isAr } = useLanguage();
  const [open, setOpen] = useState(false);

  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <div className="lg:hidden">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full rounded-lg border bg-card px-4 py-3 text-sm font-medium"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span>{t('قائمة الإدارة', 'Menu admin')}</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="mt-2 rounded-xl border bg-card shadow-sm overflow-hidden">
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{isAr ? item.label : item.labelFr}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
