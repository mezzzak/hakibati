'use client';

import { ShoppingCart, MapPin, Globe, Menu, X, UserCircle, Phone, Truck, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserDropdown } from '@/components/user-dropdown';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

export function Header() {
  const { totalItems, toggleCart } = useCartStore();
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = totalItems();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-extrabold text-primary tracking-tight">
            حقيبتي
          </span>
          <span className="hidden sm:inline text-lg font-semibold text-primary/80">
            Hakibati
          </span>
        </Link>

        {/* Trust Badges - desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <Badge variant="success" className="text-xs font-medium">
              {t('التوصيل لـ 58 ولاية', 'Livraison vers 58 wilayas')}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-primary" />
            <Badge variant="outline" className="text-xs font-medium border-primary/30 inline-flex items-center gap-1">
              <span>{t('مركز الاتصال:', 'Centre d\'appel:')}</span>
              <span dir="ltr">0663 14 17 88</span>
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className="gap-1.5 text-sm"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'Français' : 'العربية'}
            </span>
          </Button>

          {/* Account / Login */}
          {mounted && session?.user ? (
            <UserDropdown user={session.user} />
          ) : mounted ? (
            <Button variant="ghost" size="sm" asChild className="gap-1.5">
              <Link href="/login">
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">{t('دخول', 'Connexion')}</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="gap-1.5" disabled>
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('دخول', 'Connexion')}</span>
            </Button>
          )}

          {/* Cart Trigger */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCart}
            className="relative"
            aria-label={t('سلة التسوق', 'Panier')}
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-3">
          <nav className="flex flex-col gap-1">
            <Link
              href="/packs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-4 w-4 text-primary" />
              {t('الحقائب المدرسية', 'Kits scolaires')}
            </Link>
            <Link
              href="/how-to-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <MapPin className="h-4 w-4 text-primary" />
              {t('كيفية الطلب', 'Comment commander')}
            </Link>
            <Link
              href="/delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Truck className="h-4 w-4 text-primary" />
              {t('طرق التوصيل', 'Modes de livraison')}
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              {t('الأسئلة الشائعة', 'FAQ')}
            </Link>
            {mounted && session?.user && (
              <>
                <div className="border-t my-1" />
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <UserCircle className="h-4 w-4 text-primary" />
                  {t('طلباتي', 'Mes commandes')}
                </Link>
                {STAFF_ROLES.includes(session.user.role as string) && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t('لوحة التحكم', 'Administration')}
                  </Link>
                )}
              </>
            )}
          </nav>
          <div className="border-t pt-2 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <Badge variant="success" className="text-xs">
                {t('التوصيل لـ 58 ولاية', 'Livraison vers 58 wilayas')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <Badge variant="outline" className="text-xs border-primary/30 inline-flex items-center gap-1">
                <span>{t('مركز الاتصال:', 'Centre d\'appel:')}</span>
                <span dir="ltr">0663 14 17 88</span>
              </Badge>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
