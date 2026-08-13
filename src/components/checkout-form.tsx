'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { createOrder, getShippingCost } from '@/lib/order-actions';
import { toast } from 'sonner';
import { WILAYAS } from '@/lib/wilayas';
import { formatDZD } from '@/lib/utils';
import type { ShippingMethod } from '@prisma/client';
import {
  Truck,
  Building2,
  Home,
  CreditCard,
  Wallet,
  MapPin,
  Phone,
  User,
  ChevronLeft,
  Package,
  AlertCircle,
} from 'lucide-react';

interface CheckoutFormProps {
  userData?: {
    name: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
  };
}

export function CheckoutForm({ userData }: CheckoutFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCartStore();
  const { t } = useLanguage();

  const [customerName, setCustomerName] = useState(userData?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userData?.phone || '');
  const [customerPhone2, setCustomerPhone2] = useState('');
  const [wilaya, setWilaya] = useState(userData?.wilaya || '');
  const [commune, setCommune] = useState(userData?.commune || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('HOME_DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'ONLINE'>('CASH_ON_DELIVERY');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [shippingCost, setShippingCost] = useState(700);
  const [methodFees, setMethodFees] = useState<Record<string, number>>({ HOME_DELIVERY: 700, STOP_DESK: 400 });

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const wilayaRef = useRef<HTMLSelectElement>(null);
  const communeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchShipping() {
      if (!wilaya) return;
      const [home, stopDesk] = await Promise.all([
        getShippingCost(wilaya, 'HOME_DELIVERY'),
        getShippingCost(wilaya, 'STOP_DESK'),
      ]);
      setMethodFees({ HOME_DELIVERY: home, STOP_DESK: stopDesk });
      const currentCost = shippingMethod === 'HOME_DELIVERY' ? home : stopDesk;
      setShippingCost(currentCost);
    }
    fetchShipping();
  }, [wilaya, shippingMethod]);

  const focusField = (el: HTMLElement | null) => {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus();
  };

  const validatePhone = (phone: string): boolean => {
    const regex = /^(05|06|07)\d{8}$/;
    return regex.test(phone);
  };

  const handlePhoneChange = (value: string, setter: (val: string) => void) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setter(digitsOnly);
    setPhoneError('');
  };

  const subtotal = totalPrice();
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError(t('سلة التسوق فارغة', 'Votre panier est vide'));
      return;
    }

    if (!customerName.trim()) {
      const msg = t('يرجى إدخال الاسم الكامل', 'Veuillez saisir votre nom complet');
      setError(msg);
      focusField(nameRef.current);
      return;
    }

    if (!validatePhone(customerPhone)) {
      const msg = t('رقم الهاتف يجب أن يتكون من 10 أرقام ويبدأ بـ 05 أو 06 أو 07', 'Le téléphone doit comporter 10 chiffres et commencer par 05, 06 ou 07');
      setPhoneError(msg);
      setError(msg);
      focusField(phoneRef.current);
      return;
    }

    if (customerPhone2 && !validatePhone(customerPhone2)) {
      const msg = t('رقم الهاتف الثانوي غير صالح (10 أرقام تبدأ بـ 05/06/07)', 'Téléphone secondaire invalide (10 chiffres commençant par 05/06/07)');
      setPhoneError(msg);
      setError(msg);
      focusField(phone2Ref.current);
      return;
    }

    if (!wilaya.trim()) {
      const msg = t('يرجى اختيار الولاية', 'Veuillez choisir la wilaya');
      setError(msg);
      focusField(wilayaRef.current);
      return;
    }

    if (!commune.trim()) {
      const msg = t('يرجى إدخال البلدية', 'Veuillez saisir la commune');
      setError(msg);
      focusField(communeRef.current);
      return;
    }

    if (!address.trim()) {
      const msg = t('يرجى إدخال العنوان التفصيلي', 'Veuillez saisir l\'adresse détaillée');
      setError(msg);
      focusField(addressRef.current);
      return;
    }

    setLoading(true);
    setError('');
    setPhoneError('');

    const result = await createOrder({
      customerName,
      customerPhone,
      customerPhone2: customerPhone2 || undefined,
      wilaya,
      commune,
      address,
      shippingMethod,
      paymentMethod,
      notes: notes || undefined,
      userId: session?.user?.id,
      cartItems: items,
    });

    if (result.success && result.order) {
      clearCart();
      toast.success('تم إنشاء طلبك بنجاح!', {
        description: `رقم الطلب: ${result.order.orderNumber}`,
      });
      router.push(`/order-success/${result.order.id}`);
    } else {
      const msg = result.error || t('فشل في إنشاء الطلب', 'Échec de la création de la commande');
      setError(msg);
      toast.error('لم نتمكن من إتمام الطلب', { description: msg });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Personal Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {t('معلومات التوصيل', 'Informations de livraison')}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('الاسم الكامل', 'Nom complet')} *</label>
            <input
              ref={nameRef}
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {t('رقم الهاتف الأساسي', 'Téléphone principal')} *
            </label>
            <input
              ref={phoneRef}
              type="tel"
              required
              dir="ltr"
              placeholder="05XXXXXXXX"
              value={customerPhone}
              onChange={(e) => handlePhoneChange(e.target.value, setCustomerPhone)}
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${phoneError && !validatePhone(customerPhone) ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
            />
            {phoneError && !validatePhone(customerPhone) && (
              <p className="text-xs text-destructive">{t('يجب أن يتكون من 10 أرقام ويبدأ بـ 05 أو 06 أو 07', '10 chiffres commençant par 05, 06 ou 07')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {t('رقم الهاتف الثانوي (اختياري)', 'Téléphone secondaire (optionnel)')}
            </label>
            <input
              ref={phone2Ref}
              type="tel"
              dir="ltr"
              placeholder="05XXXXXXXX"
              value={customerPhone2}
              onChange={(e) => handlePhoneChange(e.target.value, setCustomerPhone2)}
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${phoneError && customerPhone2 && !validatePhone(customerPhone2) ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
            />
            {phoneError && customerPhone2 && !validatePhone(customerPhone2) && (
              <p className="text-xs text-destructive">{t('يجب أن يتكون من 10 أرقام ويبدأ بـ 05 أو 06 أو 07', '10 chiffres commençant par 05, 06 ou 07')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t('الولاية', 'Wilaya')} *
            </label>
            <select
              ref={wilayaRef}
              required
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">{t('اختر الولاية', 'Choisir la wilaya')}</option>
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.nameAr}>
                  {w.code} - {w.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {t('البلدية', 'Commune')} *
            </label>
            <input
              ref={communeRef}
              type="text"
              required
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium">{t('العنوان التفصيلي', 'Adresse détaillée')} *</label>
            <textarea
              ref={addressRef}
              required
              rows={2}
              dir="auto"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>
      </section>

      {/* Delivery Method */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          {t('طريقة التوصيل', 'Mode de livraison')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { key: 'HOME_DELIVERY', labelAr: 'توصيل للمنزل', labelFr: 'Livraison à domicile', icon: Home },
            { key: 'STOP_DESK', labelAr: 'نقطة استلام', labelFr: 'Point de retrait (Stop Desk)', icon: Building2 },
          ].map((method) => {
            const Icon = method.icon;
            const isActive = shippingMethod === method.key;
            const fee = methodFees[method.key] ?? (method.key === 'HOME_DELIVERY' ? 700 : 400);
            return (
              <button
                key={method.key}
                type="button"
                onClick={() => setShippingMethod(method.key as ShippingMethod)}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-start transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/30'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{t(method.labelAr, method.labelFr)}</p>
                  <p className="text-xs text-muted-foreground">{wilaya ? formatDZD(fee) : '—'}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${isActive ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                  {isActive && <div className="m-1 h-2.5 w-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Payment Method */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          {t('طريقة الدفع', 'Mode de paiement')}
        </h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
            className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-start transition-all ${
              paymentMethod === 'CASH_ON_DELIVERY'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/30'
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${paymentMethod === 'CASH_ON_DELIVERY' ? 'bg-primary/10' : 'bg-muted'}`}>
              <CreditCard className={`h-5 w-5 ${paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{t('الدفع عند الاستلام', 'Paiement à la livraison')}</p>
              <p className="text-xs text-muted-foreground">{t('ادفع نقداً عند استلام طلبك', 'Payez en espèces à la réception')}</p>
            </div>
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
              {t('الأكثر استخداماً', 'Le plus utilisé')}
            </span>
          </button>

          <button
            type="button"
            disabled
            className="flex w-full items-center gap-3 rounded-xl border-2 border-muted/50 p-4 text-start opacity-50 cursor-not-allowed"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{t('Chargily Pay / CIB', 'Chargily Pay / CIB')}</p>
              <p className="text-xs text-muted-foreground">{t('قريباً', 'Bientôt disponible')}</p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
              {t('قريباً', 'Bientôt')}
            </span>
          </button>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-3">
        <label className="text-sm font-medium">{t('ملاحظات إضافية (اختياري)', 'Notes supplémentaires (optionnel)')}</label>
        <textarea
          rows={2}
          dir="auto"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('أي تعليمات خاصة بالتوصيل...', 'Instructions de livraison spéciales...')}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </section>

      {/* Order Summary */}
      <section className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="text-lg font-bold">{t('ملخص الطلب', 'Récapitulatif')}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t('المجموع الفرعي', 'Sous-total')}</span>
            <span>{mounted ? formatDZD(subtotal) : '—'}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t('رسوم التوصيل', 'Frais de livraison')}</span>
            <span>{formatDZD(shippingCost)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>{t('المجموع الإجمالي', 'Total général')}</span>
            <span className="text-primary">{mounted ? formatDZD(total) : '—'}</span>
          </div>
        </div>
      </section>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 text-base"
        disabled={loading || !mounted || items.length === 0}
      >
        <ChevronLeft className="h-5 w-5" />
        {loading
          ? t('جار تأكيد الطلب...', 'Confirmation...')
          : t('تأكيد الطلب', 'Confirmer la commande')}
      </Button>
    </form>
  );
}
