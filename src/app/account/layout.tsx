'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import Link from 'next/link';
import {
  ShoppingBag,
  UserCircle,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, isAr } = useLanguage();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-64 h-48 bg-muted rounded-2xl" />
              <div className="flex-1 h-96 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    router.push('/login');
    return null;
  }

  const navItems = [
    { href: '/account/orders', label: t('طلباتي', 'Mes commandes'), icon: ShoppingBag },
    { href: '/account/reviews', label: t('تقييماتي', 'Mes avis'), icon: MessageSquare },
    { href: '/account/profile', label: t('ملفي الشخصي', 'Mon profil'), icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-6 transition-all duration-200 ease-out-expo hover:text-primary print:hidden"
        >
          <ArrowRight className="h-4 w-4" />
          {t('العودة للرئيسية', 'Retour à l\'accueil')}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="px-3 py-2 mb-3">
                <p className="text-sm font-bold truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.phone}</p>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
