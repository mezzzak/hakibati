import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminMobileNav } from '@/components/admin-mobile-nav';
import { getAdminNotifications } from '@/lib/admin-actions';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  const role = session.user.role;
  if (!role || !STAFF_ROLES.includes(role)) {
    redirect('/');
  }

  const notifResult = await getAdminNotifications(role);
  const notifs = notifResult.success && notifResult.data ? notifResult.data : { pendingOrders: 0, pendingReviews: 0, breakdown: { pendingConfirmation: 0, confirmed: 0, dispatched: 0 }, total: 0 };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col lg:flex-row">
      <AdminSidebar userName={session.user.name || 'Admin'} role={role} notifications={notifs} />
      <div className="flex-1 min-h-screen">
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-4 lg:hidden">
            <AdminMobileNav role={role} />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
