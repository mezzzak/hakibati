'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { Home, ShoppingBag, Package, UserCircle, LayoutDashboard } from 'lucide-react';

const HIDDEN_PATHS = ['/checkout', '/login', '/order-success', '/admin'];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems } = useCartStore();
  const { t } = useLanguage();

  // Hide on admin, checkout, login, and order-success pages
  if (HIDDEN_PATHS.some((p) => pathname?.startsWith(p))) return null;

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  const navItems = [
    { href: '/', label: t('الرئيسية', 'Accueil'), icon: Home, active: isActive('/') && pathname !== '/packs' && !pathname?.startsWith('/pack-builder') && !pathname?.startsWith('/account') },
    { href: '/packs', label: t('الحقائب', 'Kits'), icon: ShoppingBag, active: isActive('/packs') || isActive('/pack-builder') },
    { href: '/account/orders', label: t('حسابي', 'Compte'), icon: UserCircle, active: isActive('/account') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors',
                item.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={item.active ? 2.5 : 2} />
                {item.href === '/packs' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart button — opens drawer instead of navigating */}
        <CartNavButton />

        {/* Admin shortcut (conditional) */}
        {session?.user?.role && ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'].includes(session.user.role) && (
          <Link
            href="/admin/dashboard"
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors',
              isActive('/admin')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutDashboard className="h-5 w-5" strokeWidth={isActive('/admin') ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-tight">{t('إدارة', 'Admin')}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

function CartNavButton() {
  const { toggleCart, totalItems } = useCartStore();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleCart}
      className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-muted-foreground hover:text-foreground transition-colors"
    >
      <div className="relative">
        <Package className="h-5 w-5" strokeWidth={2} />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium leading-tight">{t('السلة', 'Panier')}</span>
    </button>
  );
}
