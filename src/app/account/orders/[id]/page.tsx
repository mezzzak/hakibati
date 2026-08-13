import { getServerSession } from 'next-auth/next';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getUserOrderById } from '@/lib/order-actions';
import { OrderReceipt } from '@/components/order-receipt';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const result = await getUserOrderById(params.id, session.user.id);

  if (!result.success || !result.order) {
    notFound();
  }

  // Serialize order to convert Date fields to strings for the client component
  const order = JSON.parse(JSON.stringify(result.order));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-3 transition-all hover:text-primary print:hidden"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للطلبات
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">
            طلب #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            تم الطلب بتاريخ {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
          </p>
        </div>
      </div>

      <OrderReceipt order={order} />
    </div>
  );
}
