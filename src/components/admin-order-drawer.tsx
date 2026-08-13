'use client';

import { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateOrderStatusAdmin, createCallLog } from '@/lib/admin-actions';
import { formatDZD, formatDate, displayPhone } from '@/lib/utils';
import {
  Phone,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Printer,
  User,
  Building2,
  StickyNote,
  PhoneCall,
  ClipboardList,
} from 'lucide-react';

interface CallLog {
  id: string;
  agentName: string | null;
  outcome: string;
  notes: string | null;
  createdAt: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPriceDZD: number;
  totalPriceDZD: number;
  itemName: string | null;
  supplyItem: { nameAr: string; nameFr: string | null } | null;
  hakibatiPack: {
    nameAr: string;
    nameFr: string | null;
    items: {
      quantity: number;
      supplyItem: { nameAr: string; nameFr: string | null } | null;
    }[];
  } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  shippingMethod: string;
  totalDZD: number;
  subtotalDZD: number;
  shippingCostDZD: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  guestName: string | null;
  guestPhone: string | null;
  wilaya: string;
  commune: string;
  address: string;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  items: OrderItem[];
  callLogs?: CallLog[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING_CONFIRMATION: { label: 'بانتظار التأكيد', color: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'مؤكد', color: 'bg-blue-100 text-blue-700' },
  DISPATCHED: { label: 'قيد الإرسال', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'تم التسليم', color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'ملغى', color: 'bg-red-100 text-red-700' },
};

const nextStatusMap: Record<string, string> = {
  PENDING_CONFIRMATION: 'CONFIRMED',
  CONFIRMED: 'DISPATCHED',
  DISPATCHED: 'DELIVERED',
};

interface AdminOrderDrawerProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: () => void;
  userRole?: string;
}

const ROLE_ACTIONS: Record<string, { canConfirm: boolean; canDispatch: boolean; canDeliver: boolean; canCancel: boolean; canCallLog: boolean }> = {
  ADMIN: { canConfirm: true, canDispatch: true, canDeliver: true, canCancel: true, canCallLog: true },
  MASTER_ADMIN: { canConfirm: true, canDispatch: true, canDeliver: true, canCancel: true, canCallLog: true },
  ORDER_CONFIRMATION_AGENT: { canConfirm: true, canDispatch: false, canDeliver: false, canCancel: true, canCallLog: true },
  PREP_AGENT: { canConfirm: false, canDispatch: true, canDeliver: false, canCancel: false, canCallLog: false },
  SHIPPING_AGENT: { canConfirm: false, canDispatch: false, canDeliver: true, canCancel: false, canCallLog: false },
};

export function AdminOrderDrawer({ order, open, onOpenChange, onStatusUpdate, userRole = 'ADMIN' }: AdminOrderDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [callOutcome, setCallOutcome] = useState('REACHED');
  const [callNote, setCallNote] = useState('');
  const [addingCall, setAddingCall] = useState(false);

  useEffect(() => {
    if (order) {
      setInternalNote(order.adminNotes || '');
    }
  }, [order?.id]);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    await updateOrderStatusAdmin(order.id, newStatus, internalNote || undefined);
    setLoading(false);
    onStatusUpdate();
  };

  const handleAddCallLog = async () => {
    if (!callNote.trim()) return;
    setAddingCall(true);
    await createCallLog({
      orderId: order.id,
      outcome: callOutcome,
      notes: callNote,
    });
    setAddingCall(false);
    setCallNote('');
    onStatusUpdate();
  };

  const handlePrintPackingSlip = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const slipHtml = `
<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="utf-8">
<title>بوليصة شحن - ${order.orderNumber}</title>
<style>
body { font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; }
.header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
.header h1 { margin: 0; font-size: 20px; }
.header p { margin: 4px 0 0; font-size: 14px; color: #555; }
.section { margin-bottom: 16px; }
.section-title { font-weight: bold; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px; }
.row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
.items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.items-table th, .items-table td { border: 1px solid #ddd; padding: 6px; text-align: right; }
.items-table th { background: #f5f5f5; }
.total { font-size: 16px; font-weight: bold; text-align: center; margin-top: 16px; padding: 12px; border: 2px solid #000; }
.footer { margin-top: 24px; font-size: 12px; color: #777; text-align: center; }
</style>
</head>
<body>
<div class="header">
<h1>HAKIBATI — بوليصة شحن</h1>
<p>رقم الطلب: ${order.orderNumber} &nbsp;|&nbsp; التاريخ: ${new Date(order.createdAt).toLocaleDateString('ar-DZ')}</p>
</div>
<div class="section">
<div class="section-title">بيانات المستلم</div>
<div class="row"><span>الاسم:</span><span>${order.customerName}</span></div>
<div class="row"><span>الهاتف:</span><span>${displayPhone(order.customerPhone)}</span></div>
<div class="row"><span>العنوان:</span><span>${order.address}، ${order.commune}</span></div>
<div class="row"><span>الولاية:</span><span>${order.wilaya}</span></div>
</div>
<div class="section">
<div class="section-title">طريقة التوصيل</div>
<div class="row"><span>${order.shippingMethod === 'HOME_DELIVERY' ? 'توصيل للمنزل' : order.shippingMethod === 'STOP_DESK' ? 'نقطة استلام' : order.shippingMethod}</span><span>${order.shippingCostDZD} د.ج</span></div>
</div>
<div class="section">
<div class="section-title">محتويات الطلب</div>
<table class="items-table">
<thead><tr><th>#</th><th>المنتج</th><th>الكمية</th><th>السعر</th></tr></thead>
<tbody>
${order.items.map((item, idx) => `<tr><td>${idx + 1}</td><td>${item.itemName || item.supplyItem?.nameAr || item.hakibatiPack?.nameAr || '—'}</td><td>${item.quantity}</td><td>${item.unitPriceDZD} د.ج</td></tr>`).join('')}
</tbody>
</table>
</div>
<div class="total">المبلغ المستحق عند الاستلام: ${order.totalDZD} د.ج</div>
<div class="footer">Hakibati — حقيبتي للقرطاسية المدرسية</div>
</body>
</html>`;
    printWindow.document.write(slipHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  const currentStatus = statusConfig[order.status] || statusConfig.PENDING_CONFIRMATION;
  const nextStatus = nextStatusMap[order.status];
  const perms = ROLE_ACTIONS[userRole] || ROLE_ACTIONS.ADMIN;

  const canAdvance =
    (nextStatus === 'CONFIRMED' && perms.canConfirm) ||
    (nextStatus === 'DISPATCHED' && perms.canDispatch) ||
    (nextStatus === 'DELIVERED' && perms.canDeliver);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={null} side="right" size="wide">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={currentStatus.color}>{currentStatus.label}</Badge>
              <span className="text-xs text-muted-foreground font-mono">{order.orderNumber}</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrintPackingSlip} className="gap-1.5 shrink-0">
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>

        {/* Customer Info Card */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="bg-primary/[0.04] px-5 py-3 border-b flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">بيانات العميل</h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">الاسم</p>
                <p className="text-sm font-semibold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">الهاتف</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {displayPhone(order.customerPhone)}
                </p>
              </div>
            </div>
            {order.guestPhone && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">هاتف ثانوي</p>
                <p className="text-sm font-semibold">{displayPhone(order.guestPhone)}</p>
              </div>
            )}
            {order.customerEmail && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">البريد</p>
                <p className="text-sm font-semibold">{order.customerEmail}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">العنوان</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {order.address}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">الولاية / البلدية</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {order.wilaya}، {order.commune}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="bg-primary/[0.04] px-5 py-3 border-b flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm">محتويات الطلب</h3>
            <span className="mr-auto text-xs text-muted-foreground">{order.items.length} منتج</span>
          </div>
          <div className="p-5 space-y-3">
            {order.items.map((item, idx) => (
              <div key={item.id} className={`flex items-start gap-3 py-3 ${idx !== order.items.length - 1 ? 'border-b' : ''}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-bold text-muted-foreground">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">{item.itemName || item.supplyItem?.nameAr || item.hakibatiPack?.nameAr || '—'}</p>
                      {item.supplyItem?.nameFr || item.hakibatiPack?.nameFr ? (
                        <p className="text-xs text-muted-foreground">{item.supplyItem?.nameFr || item.hakibatiPack?.nameFr}</p>
                      ) : null}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">{formatDZD(item.unitPriceDZD)}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                  </div>
                  {item.hakibatiPack?.items && item.hakibatiPack.items.length > 0 && (
                    <div className="mt-2 rounded-xl bg-muted/40 px-3 py-2">
                      <p className="text-[11px] font-medium text-muted-foreground mb-1">المحتويات</p>
                      <ul className="flex flex-wrap gap-x-3 gap-y-1">
                        {item.hakibatiPack.items.map((pi, pidx) => (
                          <li key={pidx} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            {pi.supplyItem?.nameAr} ×{pi.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="border-t bg-muted/20 px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span className="font-semibold">{formatDZD(order.subtotalDZD)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">التوصيل ({order.shippingMethod === 'HOME_DELIVERY' ? 'للمنزل' : order.shippingMethod === 'STOP_DESK' ? 'نقطة استلام' : order.shippingMethod})</span>
              <span className="font-semibold">{formatDZD(order.shippingCostDZD)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-bold">المبلغ المستحق عند الاستلام</span>
              <span className="text-lg font-extrabold text-primary">{formatDZD(order.totalDZD)}</span>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        {(canAdvance || perms.canCancel) && (
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="bg-primary/[0.04] px-5 py-3 border-b">
              <h3 className="font-bold text-sm">تحديث حالة الطلب</h3>
            </div>
            <div className="p-5 flex flex-wrap gap-3">
              {nextStatus && canAdvance && (
                <Button
                  size="default"
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={loading}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {nextStatus === 'CONFIRMED' && 'تأكيد الطلب'}
                  {nextStatus === 'DISPATCHED' && 'تجهيز للإرسال'}
                  {nextStatus === 'DELIVERED' && 'تأكيد التسليم'}
                </Button>
              )}
              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && perms.canCancel && (
                <Button
                  size="default"
                  variant="destructive"
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={loading}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  إلغاء الطلب
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Customer Notes */}
        {order.notes && (
          <div className="rounded-2xl border bg-amber-50/50 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-amber-100">
              <h3 className="font-bold text-sm text-amber-800">ملاحظات العميل</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-amber-900 leading-relaxed">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-5 py-3 border-b flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-bold text-sm">ملاحظات الإدارة</h3>
          </div>
          <div className="p-5 space-y-3">
            <textarea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="اكتب ملاحظات داخلية هنا..."
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(order.status)} disabled={loading}>
                حفظ الملاحظة
              </Button>
            </div>
          </div>
        </div>

        {/* Call Logs */}
        {perms.canCallLog && (
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="bg-primary/[0.04] px-5 py-3 border-b flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm">سجل المكالمات</h3>
            </div>
            <div className="p-5 space-y-4">
              {order.callLogs && order.callLogs.length > 0 && (
                <div className="space-y-2">
                  {order.callLogs.map((log) => (
                    <div key={log.id} className="rounded-xl border bg-muted/20 p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.outcome === 'REACHED' ? 'تم الاتصال' : log.outcome === 'NO_ANSWER' ? 'لا يوجد رد' : log.outcome === 'WRONG_NUMBER' ? 'رقم خاطئ' : log.outcome === 'CANCELLED' ? 'ألغى' : log.outcome}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{formatDate(log.createdAt)}</span>
                      </div>
                      {log.notes && <p className="text-xs text-muted-foreground">{log.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="REACHED">تم الاتصال</option>
                  <option value="NO_ANSWER">لا يوجد رد</option>
                  <option value="WRONG_NUMBER">رقم خاطئ</option>
                  <option value="CANCELLED">ألغى</option>
                </select>
                <input
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  placeholder="ملاحظة المكالمة..."
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button size="sm" onClick={handleAddCallLog} disabled={addingCall || !callNote.trim()}>
                  إضافة
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
