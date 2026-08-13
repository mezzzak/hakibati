import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ProfileForm } from '@/components/profile-form';
import { UserCircle } from 'lucide-react';

export default async function AccountProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
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
            <h1 className="text-2xl font-extrabold tracking-tight">ملفي الشخصي</h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              تحديث بياناتك الشخصية وعنوان التوصيل
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
