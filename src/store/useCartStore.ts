'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type { SupplyItem, HakibatiPack } from '@/types';

const getLang = (): 'ar' | 'fr' => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('hakibati-language') as 'ar' | 'fr') || 'ar';
  }
  return 'ar';
};
const tr = (ar: string, fr: string) => (getLang() === 'fr' ? fr : ar);

export interface CartItem {
  id: string;
  type: 'supply' | 'pack';
  supplyItem?: SupplyItem;
  hakibatiPack?: HakibatiPack;
  quantity: number;
  customPrice?: number;
  customDescription?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id = item.id || `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const existing = get().items.find((i) =>
          i.type === item.type &&
          ((item.type === 'supply' && i.supplyItem?.id === item.supplyItem?.id) ||
            (item.type === 'pack' && i.hakibatiPack?.id === item.hakibatiPack?.id))
        );

        const itemName =
          item.type === 'supply'
            ? item.supplyItem?.nameAr
            : item.hakibatiPack?.nameAr;

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
          toast.success(tr('تم تحديث الكمية في السلة', 'Quantité mise à jour dans le panier'), {
            description: `${itemName} × ${existing.quantity + item.quantity}`,
          });
        } else {
          set({ items: [...get().items, { ...item, id }] });
          toast.success(tr('تمت الإضافة إلى السلة', 'Ajouté au panier'), {
            description: itemName,
          });
        }
      },

      removeItem: (id) => {
        const removed = get().items.find((i) => i.id === id);
        set({ items: get().items.filter((i) => i.id !== id) });
        if (removed) {
          toast.info(tr('تمت الإزالة من السلة', 'Retiré du panier'), {
            description:
              removed.type === 'supply'
                ? removed.supplyItem?.nameAr
                : removed.hakibatiPack?.nameAr,
          });
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.info(tr('تم إفراغ السلة', 'Panier vidé'));
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCartOpen: (open) => set({ isOpen: open }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => {
          let price = 0;
          if (item.type === 'supply') {
            price = item.supplyItem?.unitPriceDZD ?? 0;
          } else if (item.type === 'pack') {
            price = item.customPrice ?? item.hakibatiPack?.basePriceDZD ?? 0;
          }
          return sum + price * item.quantity;
        }, 0),
    }),
    {
      name: 'hakibati-cart-v1',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
