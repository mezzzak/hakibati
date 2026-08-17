'use client';

import { ShoppingCart, MapPin, Globe, UserCircle, Phone, Menu, X, ShoppingBag, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
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
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = totalItems();
  const isStaff = session?.user?.role ? STAFF_ROLES.includes(session.user.role) : false;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <>
      {/* Top info bar */}
      <div className="w-full bg-primary/[0.04] border-b border-primary/10">
        <div className="container mx-auto flex items-center justify-center gap-4 sm:gap-6 h-7 sm:h-8 px-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="font-medium">{t('التوصيل لـ 58 ولاية', 'Livraison vers 58 wilayas')}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3 text-primary" />
            <span className="hidden sm:inline font-medium">{t('مركز الاتصال:', 'Centre d\'appel:')}</span>
            <span dir="ltr" className="font-semibold tabular-nums">0663 14 17 88</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto grid grid-cols-[1fr_auto_1fr] h-16 items-center px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 justify-self-start">
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              {language === 'fr' ? 'Hakibati' : 'حقيبتي'}
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 justify-self-center">
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
              <Link href="/about">
                {t('من نحن', 'Qui sommes-nous')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
              <Link href="/track-order">
                {t('تتبع الطلب', 'Suivi')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
              <Link href="/packs">
                {t('الحقائب', 'Nos kits')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
              <Link href="/#testimonials">
                {t('آراء الأولياء', 'Avis des parents')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
              <Link href="/faq">
                {t('الأسئلة الشائعة', 'FAQ')}
              </Link>
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 justify-self-end">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
              className="gap-1.5 text-sm px-2"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold">
                {language === 'ar' ? 'Fr' : 'Ar'}
              </span>
            </Button>

            {/* Account / Login — desktop dropdown */}
            <div className="hidden md:block">
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
            </div>

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

            {/* Mobile hamburger — user menu only */}
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
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-3 space-y-1">
              {/* Nav links */}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t('من نحن', 'Qui sommes-nous')}
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t('تتبع الطلب', 'Suivi')}
              </Link>
              <Link
                href="/packs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t('الحقائب', 'Nos kits')}
              </Link>
              <Link
                href="/#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t('آراء الأولياء', 'Avis des parents')}
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t('الأسئلة الشائعة', 'FAQ')}
              </Link>
              <div className="border-t my-1" />

              {mounted && session?.user ? (
                <>
                  {/* User info */}
                  <div className="px-3 py-2 mb-2">
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.role || t('عميل', 'Client')}</p>
                  </div>

                  {isStaff ? (
                    <Link
                      href={session.user.role === 'ADMIN' || session.user.role === 'MASTER_ADMIN' ? '/admin/dashboard' : '/admin/orders'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      {t('لوحة الإدارة', 'Tableau de bord')}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/account/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        {t('طلباتي', 'Mes commandes')}
                      </Link>
                      <Link
                        href="/account/reviews"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4 text-primary" />
                        {t('تقييماتي', 'Mes avis')}
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <UserCircle className="h-4 w-4 text-primary" />
                        {t('ملفي الشخصي', 'Mon profil')}
                      </Link>
                    </>
                  )}

                  <div className="border-t my-1" />

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('تسجيل الخروج', 'Déconnexion')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <UserCircle className="h-4 w-4 text-primary" />
                  {t('تسجيل الدخول', 'Connexion')}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
