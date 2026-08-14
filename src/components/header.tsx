'use client';

import { ShoppingCart, MapPin, Globe, UserCircle, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserDropdown } from '@/components/user-dropdown';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { totalItems, toggleCart } = useCartStore();
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();
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

        </div>
      </div>
    </header>
  );
}
