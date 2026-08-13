import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ─────────────────────────────────────────────
// Supply Items
// ─────────────────────────────────────────────
export async function getAllSupplyItems(options?: { activeOnly?: boolean; category?: string }) {
  return prisma.supplyItem.findMany({
    where: {
      isActive: options?.activeOnly ?? true ? true : undefined,
      category: options?.category,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSupplyItemById(id: string) {
  return prisma.supplyItem.findUnique({ where: { id } });
}

export async function getSupplyItemsByCategory(category: string) {
  return prisma.supplyItem.findMany({
    where: { category, isActive: true },
    orderBy: { nameAr: 'asc' },
  });
}

// ─────────────────────────────────────────────
// Hakibati Packs
// ─────────────────────────────────────────────
export async function getAllPacks(options?: { activeOnly?: boolean; gradeLevel?: string }) {
  return prisma.hakibatiPack.findMany({
    where: {
      isActive: options?.activeOnly ?? true ? true : undefined,
      gradeLevel: options?.gradeLevel as any,
    },
    include: {
      items: {
        include: { supplyItem: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPackById(id: string) {
  return prisma.hakibatiPack.findUnique({
    where: { id },
    include: {
      items: {
        include: { supplyItem: true },
      },
    },
  });
}

export async function getPacksByGradeLevel(gradeLevel: string) {
  return prisma.hakibatiPack.findMany({
    where: { gradeLevel: gradeLevel as any, isActive: true },
    include: {
      items: {
        include: { supplyItem: true },
      },
    },
    orderBy: { basePriceDZD: 'asc' },
  });
}

// ─────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────
export async function getCartItems(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) return [];
  return prisma.cartItem.findMany({
    where: {
      OR: [
        { userId: userId ?? undefined },
        { sessionId: sessionId ?? undefined },
      ],
    },
    include: {
      supplyItem: true,
      hakibatiPack: {
        include: {
          items: { include: { supplyItem: true } },
        },
      },
    },
  });
}

export async function addToCart(data: {
  userId?: string;
  sessionId?: string;
  supplyItemId?: string;
  hakibatiPackId?: string;
  quantity?: number;
}) {
  const { userId, sessionId, supplyItemId, hakibatiPackId, quantity = 1 } = data;

  const existing = await prisma.cartItem.findFirst({
    where: {
      OR: [
        { userId: userId ?? undefined },
        { sessionId: sessionId ?? undefined },
      ],
      supplyItemId: supplyItemId ?? null,
      hakibatiPackId: hakibatiPackId ?? null,
    },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      userId,
      sessionId,
      supplyItemId,
      hakibatiPackId,
      quantity,
    },
  });
}

export async function removeCartItem(id: string) {
  return prisma.cartItem.delete({ where: { id } });
}

export async function clearCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) return { count: 0 };
  return prisma.cartItem.deleteMany({
    where: {
      OR: [
        { userId: userId ?? undefined },
        { sessionId: sessionId ?? undefined },
      ],
    },
  });
}

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────
export async function createOrder(data: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  wilaya: string;
  commune: string;
  address: string;
  shippingMethod: string;
  shippingCostDZD: number;
  subtotalDZD: number;
  totalDZD: number;
  notes?: string | null;
  userId?: string | null;
  items: {
    supplyItemId?: string | null;
    hakibatiPackId?: string | null;
    quantity: number;
    unitPriceDZD: number;
    totalPriceDZD: number;
  }[];
}) {
  return prisma.order.create({
    data: {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      wilaya: data.wilaya,
      commune: data.commune,
      address: data.address,
      shippingMethod: data.shippingMethod as any,
      shippingCostDZD: data.shippingCostDZD,
      subtotalDZD: data.subtotalDZD,
      totalDZD: data.totalDZD,
      notes: data.notes,
      userId: data.userId,
      items: {
        create: data.items.map((item) => ({
          quantity: item.quantity,
          unitPriceDZD: item.unitPriceDZD,
          totalPriceDZD: item.totalPriceDZD,
          supplyItemId: item.supplyItemId,
          hakibatiPackId: item.hakibatiPackId,
        })),
      },
    },
    include: { items: true },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          supplyItem: true,
          hakibatiPack: {
            include: { items: { include: { supplyItem: true } } },
          },
        },
      },
      user: true,
    },
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          supplyItem: true,
          hakibatiPack: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  const now = new Date();
  const data: Record<string, any> = { status: status as any };

  if (status === 'CONFIRMED') data.confirmedAt = now;
  if (status === 'DISPATCHED') data.dispatchedAt = now;
  if (status === 'DELIVERED') data.deliveredAt = now;
  if (status === 'CANCELLED') data.cancelledAt = now;

  return prisma.order.update({
    where: { id },
    data,
  });
}
