import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, SupplyItem, HakibatiPack } from '@/types';

export interface CartStateItem {
  id: string;
  quantity: number;
  supplyItem?: SupplyItem;
  hakibatiPack?: HakibatiPack;
}

interface CartStore {
  items: CartStateItem[];
  isOpen: boolean;
  addItem: (item: CartStateItem) => void;
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
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
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

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCartOpen: (open) => set({ isOpen: open }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => {
          const price =
            item.supplyItem?.unitPriceDZD ??
            item.hakibatiPack?.basePriceDZD ??
            0;
          return sum + price * item.quantity;
        }, 0),
    }),
    {
      name: 'hakibati-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
