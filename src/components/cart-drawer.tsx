'use client';

import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useLanguage } from '@/components/language-provider';
import { formatDZD } from '@/lib/utils';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Package, ArrowRight, Boxes } from 'lucide-react';

export function CartDrawer() {
  const { isOpen, setCartOpen, items, updateQuantity, removeItem, totalPrice, clearCart } =
    useCartStore();
  const { t, isAr } = useLanguage();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setCartOpen}
      title={t('سلة التسوق', 'Panier')}
      side="right"
      size="wide"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
              <ShoppingBag className="h-10 w-10 text-primary/60" />
            </div>
          </div>
          <p className="text-muted-foreground font-semibold text-base">
            {t('سلة التسوق فارغة', 'Votre panier est vide')}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2 max-w-[220px]">
            {t('اختر الحقيبة المدرسية المناسبة لابنك واضغط "أضف للسلة"', 'Choisissez le kit scolaire adapté à votre enfant')}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5 gap-1.5"
            asChild
            onClick={() => setCartOpen(false)}
          >
            <Link href="/#grade-selector">
              {t('اختر مستوى طفلك', 'Choisir le niveau')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/30"
              >
                {/* Thumbnail placeholder */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground text-xs font-bold">
                  <Package className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">
                    {item.type === 'supply'
                      ? (isAr ? item.supplyItem?.nameAr : (item.supplyItem?.nameFr || item.supplyItem?.nameAr))
                      : (isAr ? item.hakibatiPack?.nameAr : (item.hakibatiPack?.nameFr || item.hakibatiPack?.nameAr))}
                  </p>
                  {item.customDescription && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {item.customDescription}
                    </p>
                  )}
                  <p className="text-sm font-bold text-primary mt-1">
                    {formatDZD(
                      item.type === 'supply'
                        ? item.supplyItem?.unitPriceDZD ?? 0
                        : item.customPrice ?? item.hakibatiPack?.basePriceDZD ?? 0
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-md"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-md"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('المجموع', 'Total')}
              </span>
              <span className="text-xl font-bold text-primary">
                {formatDZD(totalPrice())}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={clearCart}>
                {t('إفراغ', 'Vider')}
              </Button>
              <Button className="gap-2" asChild onClick={() => setCartOpen(false)}>
                <Link href="/checkout">
                  {t('تأكيد الطلب', 'Commander')}
                </Link>
              </Button>
            </div>
            <Button variant="outline" className="w-full gap-2" asChild onClick={() => setCartOpen(false)}>
              <Link href="/#grade-selector">
                <Boxes className="h-4 w-4" />
                {t('أضف حزمة أخرى', 'Ajouter un autre kit')}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
