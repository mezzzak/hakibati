'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './db';
import { ShippingMethod, OrderStatus } from '@prisma/client';
import type { CartItem } from '@/store/useCartStore';

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HAK-${year}-${random}`;
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\s/g, '').replace(/-/g, '');
  // Convert international 213... back to national 0... format
  if (cleaned.startsWith('213') && cleaned.length > 10) {
    cleaned = '0' + cleaned.slice(3);
  }
  return cleaned;
}

export async function getShippingCost(wilaya: string, method: string): Promise<number> {
  try {
    const rate = await prisma.shippingRate.findUnique({
      where: {
        wilaya_method: {
          wilaya,
          method,
        },
      },
    });
    if (rate && rate.isActive) {
      return rate.costDZD;
    }
  } catch {
    // fallback to defaults
  }
  // Default fallback values
  const defaults: Record<string, number> = {
    HOME_DELIVERY: 700,
    STOP_DESK: 400,
    OFFICE_PICKUP: 400,
    YALIDINE: 600,
    ECO_SHIPPING: 350,
  };
  return defaults[method] ?? 500;
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerPhone2?: string;
  customerEmail?: string;
  wilaya: string;
  commune: string;
  address: string;
  shippingMethod: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE';
  notes?: string;
  userId?: string;
  cartItems: CartItem[];
}) {
  try {
    // Validate required fields
    if (!data.customerName?.trim() || !data.customerPhone?.trim() || !data.wilaya?.trim() || !data.commune?.trim() || !data.address?.trim()) {
      return { success: false, error: 'جميع الحقول مطلوبة ما عدا الهاتف الثانوي' };
    }
    if (!data.cartItems || data.cartItems.length === 0) {
      return { success: false, error: 'سلة التسوق فارغة' };
    }

    const orderNumber = generateOrderNumber();
    const normalizedPhone = normalizePhone(data.customerPhone);

    let subtotal = 0;
    const orderItems = data.cartItems.map((item) => {
      const unitPrice =
        item.type === 'supply'
          ? item.supplyItem?.unitPriceDZD ?? 0
          : item.customPrice ?? item.hakibatiPack?.basePriceDZD ?? 0;
      const total = unitPrice * item.quantity;
      subtotal += total;
      let itemName: string | null;
      if (item.type === 'supply') {
        itemName = item.supplyItem?.nameAr ?? null;
      } else {
        const nameAr = item.hakibatiPack?.nameAr || '';
        const nameFr = item.hakibatiPack?.nameFr || '';
        const contents = item.customDescription || '';
        itemName = `__PACK__${nameAr}|||${nameFr}\n${contents}`;
      }
      return {
        quantity: item.quantity,
        unitPriceDZD: unitPrice,
        totalPriceDZD: total,
        itemName,
        supplyItemId: item.type === 'supply' ? item.supplyItem?.id : null,
        hakibatiPackId: item.type === 'pack' ? item.hakibatiPack?.id : null,
      };
    });

    // Shipping cost calculation from DB
    const method = data.shippingMethod as ShippingMethod;
    const shippingCost = await getShippingCost(data.wilaya, data.shippingMethod);

    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: OrderStatus.PENDING_CONFIRMATION,
        shippingMethod: method,
        shippingCostDZD: shippingCost,
        subtotalDZD: subtotal,
        totalDZD: total,
        customerName: data.customerName,
        customerPhone: normalizedPhone,
        customerEmail: data.customerEmail || null,
        guestName: data.customerName || null,
        guestPhone: data.customerPhone2 || null,
        wilaya: data.wilaya,
        commune: data.commune,
        address: data.address,
        notes: data.notes || null,
        userId: data.userId || null,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    revalidatePath('/account/orders');
    return { success: true, order };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            supplyItem: true,
            hakibatiPack: {
              include: {
                items: {
                  include: { supplyItem: true },
                },
              },
            },
          },
        },
      },
    });
    return { success: true, order };
  } catch (error) {
    console.error('Get order error:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            supplyItem: true,
            hakibatiPack: {
              include: {
                items: {
                  include: { supplyItem: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Get user orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function getUserOrderById(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            supplyItem: true,
            hakibatiPack: {
              include: {
                items: {
                  include: { supplyItem: true },
                },
              },
            },
          },
        },
      },
    });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true, order };
  } catch (error) {
    console.error('Get user order error:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function getOrderByOrderNumber(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: {
        items: {
          include: {
            supplyItem: true,
            hakibatiPack: {
              include: {
                items: {
                  include: { supplyItem: true },
                },
              },
            },
          },
        },
      },
    });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true, order };
  } catch (error) {
    console.error('Track order error:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function reorderOrder(orderId: string, userId: string) {
  try {
    const originalOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            supplyItem: true,
            hakibatiPack: true,
          },
        },
      },
    });

    if (!originalOrder) {
      return { success: false, error: 'Order not found' };
    }

    const orderNumber = generateOrderNumber();
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        status: OrderStatus.PENDING_CONFIRMATION,
        shippingMethod: originalOrder.shippingMethod,
        shippingCostDZD: originalOrder.shippingCostDZD,
        subtotalDZD: originalOrder.subtotalDZD,
        totalDZD: originalOrder.totalDZD,
        customerName: originalOrder.customerName,
        customerPhone: originalOrder.customerPhone,
        customerEmail: originalOrder.customerEmail,
        wilaya: originalOrder.wilaya,
        commune: originalOrder.commune,
        address: originalOrder.address,
        notes: originalOrder.notes,
        userId,
        items: {
          create: originalOrder.items.map((item) => ({
            quantity: item.quantity,
            unitPriceDZD: item.unitPriceDZD,
            totalPriceDZD: item.totalPriceDZD,
            itemName: item.itemName,
            supplyItemId: item.supplyItemId,
            hakibatiPackId: item.hakibatiPackId,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath('/account/orders');
    return { success: true, order: newOrder };
  } catch (error) {
    console.error('Reorder error:', error);
    return { success: false, error: 'Failed to reorder' };
  }
}

export async function registerUser(data: {
  fullName: string;
  phone: string;
  password: string;
  wilaya: string;
  commune: string;
  address: string;
  email?: string;
}) {
  try {
    const existing = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existing) {
      return { success: false, error: 'رقم الهاتف مسجل مسبقاً' };
    }

    const hashedPassword = await import('bcryptjs').then((bcrypt) =>
      bcrypt.hash(data.password, 12)
    );

    const user = await prisma.user.create({
      data: {
        phone: data.phone,
        fullName: data.fullName,
        password: hashedPassword,
        wilaya: data.wilaya,
        commune: data.commune,
        address: data.address,
        email: data.email || null,
      },
    });

    return { success: true, user: { id: user.id, phone: user.phone, name: user.fullName } };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'فشل في إنشاء الحساب' };
  }
}

export async function updateProfile(data: {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  email?: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (!user) {
      return { success: false, error: 'المستخدم غير موجود' };
    }

    await prisma.user.update({
      where: { phone: data.phone },
      data: {
        fullName: data.fullName,
        wilaya: data.wilaya,
        commune: data.commune,
        address: data.address,
        email: data.email || null,
      },
    });

    revalidatePath('/account/profile');
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'فشل في تحديث البيانات' };
  }
}
