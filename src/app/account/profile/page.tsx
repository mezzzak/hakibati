'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ProfileForm } from '@/components/profile-form';
import { UserCircle } from 'lucide-react';

export default function AccountProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  if (status === 'loading') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/[0.03] to-background p-6 sm:p-8 mb-8 shadow-card">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-muted rounded-xl" />
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-48" />
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

  return (
    <div>
      {/* Header Card */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/[0.03] to-background p-6 sm:p-8 mb-8 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <UserCircle className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{t('ملفي الشخصي', 'Mon profil')}</h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {t('تحديث بياناتك الشخصية وعنوان التوصيل', 'Mettez à jour vos informations personnelles et votre adresse de livraison')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xl">
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
