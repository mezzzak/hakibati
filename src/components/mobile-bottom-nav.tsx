'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { Home, ShoppingBag, User, ShoppingCart } from 'lucide-react';

const HIDDEN_PATHS = ['/checkout', '/login', '/order-success', '/admin'];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (HIDDEN_PATHS.some((p) => pathname?.startsWith(p))) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const navItems = [
    { href: '/', label: t('الرئيسية', 'Accueil'), icon: Home },
    { href: '/packs', label: t('الحقائب', 'Kits'), icon: ShoppingBag },
    { href: '/account/orders', label: t('حسابي', 'Compte'), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 safe-area-pb">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-border/50 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]" />
      <div className="relative grid grid-cols-5 h-[60px]">
        {/* Left tabs */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-[2px] transition-all duration-200',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center rounded-xl transition-all duration-200',
                active ? 'bg-primary/10' : 'bg-transparent',
                'w-10 h-8'
              )}>
                <Icon
                  className={cn(
                    'h-[19px] w-[19px] transition-all',
                    active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'
                  )}
                />
              </div>
              <span className={cn(
                'text-[9px] font-medium leading-none',
                active && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center FAB */}
        <div className="flex items-start justify-center -mt-5">
          <CartFAB />
        </div>

        {/* Right tabs */}
        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-[2px] transition-all duration-200',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center rounded-xl transition-all duration-200',
                active ? 'bg-primary/10' : 'bg-transparent',
                'w-10 h-8'
              )}>
                <Icon
                  className={cn(
                    'h-[19px] w-[19px] transition-all',
                    active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'
                  )}
                />
              </div>
              <span className={cn(
                'text-[9px] font-medium leading-none',
                active && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Spacer for 5th col when no admin */}
        <div className="flex flex-col items-center justify-center gap-[2px] text-muted-foreground">
          <div className="w-10 h-8" />
        </div>
      </div>
    </nav>
  );
}

function CartFAB() {
  const { toggleCart, totalItems } = useCartStore();
  const { t } = useLanguage();
  const count = totalItems();

  return (
    <button
      onClick={toggleCart}
      className="group relative flex flex-col items-center"
    >
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-90 transition-all duration-150 ring-4 ring-background">
        <ShoppingCart className="h-5 w-5 stroke-[2px]" />
      </div>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white border-2 border-background">
          {count > 9 ? '9+' : count}
        </span>
      )}
      <span className="text-[9px] font-medium text-muted-foreground mt-[2px]">
        {t('السلة', 'Panier')}
      </span>
    </button>
  );
}
