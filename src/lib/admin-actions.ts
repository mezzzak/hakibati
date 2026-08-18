'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './db';
import { OrderStatus, GradeLevel } from '@prisma/client';

// ─────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────
export async function getAdminAnalytics() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRevenueAgg,
      totalOrders,
      ordersByStatus,
      topWilayas,
      topPacks,
      totalPageViews,
      uniqueVisitors,
      pageViewsLast7Days,
      pageViewsLast30Days,
      topPages,
    ] = await Promise.all([
        prisma.order.aggregate({
          _sum: { totalDZD: true },
          where: { status: { not: OrderStatus.CANCELLED } },
        }),
        prisma.order.count(),
        prisma.order.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        prisma.order.groupBy({
          by: ['wilaya'],
          _count: { wilaya: true },
          orderBy: { _count: { wilaya: 'desc' } },
          take: 5,
        }),
        prisma.orderItem.groupBy({
          by: ['hakibatiPackId'],
          where: { hakibatiPackId: { not: null } },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
        prisma.pageView.count(),
        prisma.pageView.groupBy({
          by: ['sessionId'],
          _count: { sessionId: true },
        }).then((res) => res.length),
        prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.pageView.groupBy({
          by: ['path'],
          _count: { path: true },
          orderBy: { _count: { path: 'desc' } },
          take: 5,
        }),
      ]);

    const deliveredCount =
      ordersByStatus.find((s) => s.status === OrderStatus.DELIVERED)?._count.status || 0;
    const fulfillmentRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;

    const topPackIds = topPacks.map((p) => p.hakibatiPackId!).filter(Boolean);
    const packDetails =
      topPackIds.length > 0
        ? await prisma.hakibatiPack.findMany({
            where: { id: { in: topPackIds } },
            select: { id: true, nameAr: true },
          })
        : [];

    const topPacksWithNames = topPacks.map((p) => ({
      id: p.hakibatiPackId,
      nameAr: packDetails.find((d) => d.id === p.hakibatiPackId)?.nameAr || 'Unknown',
      totalSold: p._sum.quantity || 0,
    }));

    return {
      success: true,
      data: {
        totalRevenue: totalRevenueAgg._sum.totalDZD || 0,
        totalOrders,
        fulfillmentRate,
        ordersByStatus,
        topWilayas,
        topPacks: topPacksWithNames,
        visitors: {
          totalPageViews,
          uniqueVisitors,
          pageViewsLast7Days,
          pageViewsLast30Days,
          topPages,
        },
      },
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return { success: false, error: 'Failed to load analytics' };
  }
}

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────
export async function getAllOrders(options?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const where = options?.status ? { status: options.status as OrderStatus } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
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
          user: { select: { id: true, fullName: true, phone: true } },
          callLogs: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { success: true, orders, total, page, totalPages: Math.ceil(total / limit) };
  } catch (error) {
    console.error('Get all orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function updateOrderStatusAdmin(id: string, status: string, adminNotes?: string) {
  try {
    const now = new Date();
    const data: Record<string, any> = { status: status as OrderStatus };

    if (status === 'CONFIRMED') data.confirmedAt = now;
    if (status === 'DISPATCHED') data.dispatchedAt = now;
    if (status === 'DELIVERED') data.deliveredAt = now;
    if (status === 'CANCELLED') data.cancelledAt = now;
    if (adminNotes !== undefined) data.adminNotes = adminNotes;

    const order = await prisma.order.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/orders');
    return { success: true, order };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Failed to update order' };
  }
}

export async function createCallLog(data: {
  orderId: string;
  agentName?: string;
  outcome: string;
  notes?: string;
}) {
  try {
    const callLog = await prisma.callLog.create({ data });
    revalidatePath('/admin/orders');
    return { success: true, callLog };
  } catch (error) {
    console.error('Create call log error:', error);
    return { success: false, error: 'Failed to create call log' };
  }
}

export async function getCallLogs(orderId: string) {
  try {
    const callLogs = await prisma.callLog.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, callLogs };
  } catch (error) {
    console.error('Get call logs error:', error);
    return { success: false, error: 'Failed to fetch call logs' };
  }
}

// ─────────────────────────────────────────────
// Products (Supply Items)
// ─────────────────────────────────────────────
export async function getAllProducts() {
  try {
    const products = await prisma.supplyItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, products };
  } catch (error) {
    console.error('Get products error:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function createProduct(data: {
  nameAr: string;
  nameFr?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  brand?: string;
  category?: string;
  categoryAr?: string;
  categoryFr?: string;
  unitPriceDZD: number;
  costPriceDZD?: number;
  retailPriceDZD?: number;
  stockQuantity: number;
  imageUrl?: string;
}) {
  try {
    const payload = {
      ...data,
      category: data.category || data.categoryAr || 'autre',
    };
    const product = await prisma.supplyItem.create({ data: payload });
    revalidatePath('/admin/products');
    return { success: true, product };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(
  id: string,
  data: {
    nameAr?: string;
    nameFr?: string;
    descriptionAr?: string;
    descriptionFr?: string;
    brand?: string;
    category?: string;
    categoryAr?: string;
    categoryFr?: string;
    unitPriceDZD?: number;
    costPriceDZD?: number;
    retailPriceDZD?: number;
    stockQuantity?: number;
    imageUrl?: string;
    isActive?: boolean;
  }
) {
  try {
    const payload = { ...data };
    if (payload.categoryAr && !payload.category) {
      payload.category = payload.categoryAr;
    }
    const product = await prisma.supplyItem.update({ where: { id }, data: payload });
    revalidatePath('/admin/products');
    return { success: true, product };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.supplyItem.delete({ where: { id } });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function deleteAllProducts() {
  try {
    const { count } = await prisma.supplyItem.deleteMany({});
    revalidatePath('/admin/products');
    return { success: true, count };
  } catch (error) {
    console.error('Delete all products error:', error);
    return { success: false, error: 'Failed to delete all products' };
  }
}

// ─────────────────────────────────────────────
// Packs
// ─────────────────────────────────────────────
export async function getAllPacksAdmin() {
  try {
    const packs = await prisma.hakibatiPack.findMany({
      include: {
        items: {
          include: { supplyItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, packs };
  } catch (error) {
    console.error('Get packs error:', error);
    return { success: false, error: 'Failed to fetch packs' };
  }
}

export async function createPack(data: {
  nameAr: string;
  nameFr?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  gradeLevel: string;
  basePriceDZD: number;
  discountPercent: number;
  imageUrl?: string;
  items: { supplyItemId: string; quantity: number; isOptional?: boolean }[];
}) {
  try {
    const pack = await prisma.hakibatiPack.create({
      data: {
        nameAr: data.nameAr,
        nameFr: data.nameFr,
        descriptionAr: data.descriptionAr,
        descriptionFr: data.descriptionFr,
        gradeLevel: data.gradeLevel as GradeLevel,
        basePriceDZD: data.basePriceDZD,
        discountPercent: data.discountPercent,
        imageUrl: data.imageUrl,
        items: {
          create: data.items.map((item) => ({
            supplyItemId: item.supplyItemId,
            quantity: item.quantity,
            isOptional: item.isOptional ?? false,
          })),
        },
      },
      include: { items: { include: { supplyItem: true } } },
    });
    revalidatePath('/admin/packs');
    return { success: true, pack };
  } catch (error) {
    console.error('Create pack error:', error);
    return { success: false, error: 'Failed to create pack' };
  }
}

export async function updatePack(
  id: string,
  data: {
    nameAr?: string;
    nameFr?: string;
    descriptionAr?: string;
    descriptionFr?: string;
    gradeLevel?: string;
    basePriceDZD?: number;
    discountPercent?: number;
    imageUrl?: string;
    isActive?: boolean;
    items?: { supplyItemId: string; quantity: number; isOptional?: boolean }[];
  }
) {
  try {
    const updateData: any = { ...data };
    if (data.gradeLevel) updateData.gradeLevel = data.gradeLevel as GradeLevel;
    delete updateData.items;

    if (data.items) {
      await prisma.packItem.deleteMany({ where: { hakibatiPackId: id } });
      updateData.items = {
        create: data.items.map((item) => ({
          supplyItemId: item.supplyItemId,
          quantity: item.quantity,
          isOptional: item.isOptional ?? false,
        })),
      };
    }

    const pack = await prisma.hakibatiPack.update({
      where: { id },
      data: updateData,
      include: { items: { include: { supplyItem: true } } },
    });
    revalidatePath('/admin/packs');
    return { success: true, pack };
  } catch (error) {
    console.error('Update pack error:', error);
    return { success: false, error: 'Failed to update pack' };
  }
}

export async function deletePack(id: string) {
  try {
    await prisma.hakibatiPack.delete({ where: { id } });
    revalidatePath('/admin/packs');
    return { success: true };
  } catch (error) {
    console.error('Delete pack error:', error);
    return { success: false, error: 'Failed to delete pack' };
  }
}

export async function deleteAllPacks() {
  try {
    const { count } = await prisma.hakibatiPack.deleteMany({});
    revalidatePath('/admin/packs');
    return { success: true, count };
  } catch (error) {
    console.error('Delete all packs error:', error);
    return { success: false, error: 'Failed to delete all packs' };
  }
}

// ─────────────────────────────────────────────
// CSV Upload Helpers
// ─────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content: string): string[][] {
  // Strip UTF-8 BOM that Excel and other tools prepend
  const clean = content.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter((l) => l.trim() !== '');
  return lines.map(parseCSVLine);
}

function escapeCSV(value: string | number | boolean | null | undefined): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(rows: (string | number | boolean | null | undefined)[][]): string {
  return rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
}

// ─────────────────────────────────────────────
// Products CSV Upload
// ─────────────────────────────────────────────

export async function uploadProductsCSV(csvContent: string) {
  try {
    const rows = parseCSV(csvContent);
    if (rows.length < 2) {
      return { success: false, error: 'CSV فارغ أو غير صالح. يجب أن يحتوي على صف عنوان + صفوف بيانات.' };
    }

    const headers = rows[0];
    const required = ['nameAr', 'categoryAr', 'unitPriceDZD'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      return { success: false, error: `الأعمدة المطلوبة ناقصة: ${missing.join(', ')}` };
    }

    const getCol = (row: string[], header: string) => {
      const idx = headers.indexOf(header);
      return idx >= 0 ? row[idx] : undefined;
    };

    const dataRows = rows.slice(1);
    const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const nameAr = getCol(row, 'nameAr') || '';
      if (!nameAr) {
        results.skipped++;
        continue;
      }

      const id = getCol(row, 'id');
      try {
        const data = {
          nameAr,
          nameFr: getCol(row, 'nameFr') || null,
          descriptionAr: getCol(row, 'descriptionAr') || null,
          descriptionFr: getCol(row, 'descriptionFr') || null,
          brand: getCol(row, 'brand') || null,
          category: getCol(row, 'category') || getCol(row, 'categoryAr') || 'autre',
          categoryAr: getCol(row, 'categoryAr') || null,
          categoryFr: getCol(row, 'categoryFr') || null,
          unitPriceDZD: Number(getCol(row, 'unitPriceDZD')) || 0,
          costPriceDZD: Number(getCol(row, 'costPriceDZD')) || 0,
          retailPriceDZD: Number(getCol(row, 'retailPriceDZD')) || 0,
          stockQuantity: Number(getCol(row, 'stockQuantity')) || 0,
          imageUrl: getCol(row, 'imageUrl') || null,
          isActive: getCol(row, 'isActive')?.toLowerCase() === 'false' ? false : true,
        };
        if (id) {
          const existing = await prisma.supplyItem.findUnique({ where: { id } });
          if (existing) {
            await prisma.supplyItem.update({ where: { id }, data });
            results.updated++;
          } else {
            await prisma.supplyItem.create({ data });
            results.created++;
          }
        } else {
          await prisma.supplyItem.create({ data });
          results.created++;
        }
      } catch (err: any) {
        results.errors.push(`صف ${i + 2} (${nameAr}): ${err.message || 'خطأ غير معروف'}`);
      }
    }

    revalidatePath('/admin/products');
    return { success: true, results };
  } catch (error: any) {
    console.error('Upload products CSV error:', error);
    return { success: false, error: error.message || 'فشل رفع ملف المنتجات' };
  }
}

// ─────────────────────────────────────────────
// Packs CSV Upload
// ─────────────────────────────────────────────

export async function uploadPacksCSV(csvContent: string) {
  try {
    const rows = parseCSV(csvContent);
    if (rows.length < 2) {
      return { success: false, error: 'CSV فارغ أو غير صالح. يجب أن يحتوي على صف عنوان + صفوف بيانات.' };
    }

    const headers = rows[0];
    const required = ['nameAr', 'gradeLevel', 'basePriceDZD', 'items'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      return { success: false, error: `الأعمدة المطلوبة ناقصة: ${missing.join(', ')}` };
    }

    const getCol = (row: string[], header: string) => {
      const idx = headers.indexOf(header);
      return idx >= 0 ? row[idx] : undefined;
    };

    // Fetch all supply items for lookup by nameAr
    const allSupplyItems = await prisma.supplyItem.findMany({ select: { id: true, nameAr: true } });
    const supplyMap = new Map(allSupplyItems.map((s) => [s.nameAr.trim(), s.id]));

    const dataRows = rows.slice(1);
    const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const nameAr = getCol(row, 'nameAr') || '';
      if (!nameAr) {
        results.skipped++;
        continue;
      }

      const gradeLevel = getCol(row, 'gradeLevel') || 'CUSTOM';
      const validGrades = Object.values(GradeLevel);
      if (!validGrades.includes(gradeLevel as GradeLevel)) {
        results.errors.push(`صف ${i + 2} (${nameAr}): المستوى الدراسي "${gradeLevel}" غير صالح`);
        continue;
      }

      // Parse items: "itemName:qty|itemName2:qty2"
      const itemsRaw = getCol(row, 'items') || '';
      const packItems: { supplyItemId: string; quantity: number }[] = [];
      const itemParts = itemsRaw.split('|').filter(Boolean);
      const missingItems: string[] = [];

      for (const part of itemParts) {
        const [itemName, qtyStr] = part.split(':');
        const trimmedName = itemName?.trim();
        if (!trimmedName) continue;
        const supplyId = supplyMap.get(trimmedName);
        if (!supplyId) {
          missingItems.push(trimmedName);
          continue;
        }
        packItems.push({ supplyItemId: supplyId, quantity: Number(qtyStr) || 1 });
      }

      if (missingItems.length > 0) {
        results.errors.push(`صف ${i + 2} (${nameAr}): منتجات غير موجودة: ${missingItems.join(', ')}`);
        continue;
      }

      if (packItems.length === 0) {
        results.errors.push(`صف ${i + 2} (${nameAr}): لا يوجد عناصر صالحة في الحقيبة`);
        continue;
      }

      const id = getCol(row, 'id');
      try {
        const data: any = {
          nameAr,
          nameFr: getCol(row, 'nameFr') || null,
          descriptionAr: getCol(row, 'descriptionAr') || null,
          descriptionFr: getCol(row, 'descriptionFr') || null,
          gradeLevel: gradeLevel as GradeLevel,
          basePriceDZD: Number(getCol(row, 'basePriceDZD')) || 0,
          discountPercent: Number(getCol(row, 'discountPercent')) || 0,
          imageUrl: getCol(row, 'imageUrl') || null,
          isActive: getCol(row, 'isActive')?.toLowerCase() === 'false' ? false : true,
        };
        if (id) {
          await prisma.packItem.deleteMany({ where: { hakibatiPackId: id } });
          await prisma.hakibatiPack.update({
            where: { id },
            data: { ...data, items: { create: packItems } },
          });
          results.updated++;
        } else {
          await prisma.hakibatiPack.create({
            data: { ...data, items: { create: packItems } },
          });
          results.created++;
        }
      } catch (err: any) {
        results.errors.push(`صف ${i + 2} (${nameAr}): ${err.message || 'خطأ غير معروف'}`);
      }
    }

    revalidatePath('/admin/packs');
    return { success: true, results };
  } catch (error: any) {
    console.error('Upload packs CSV error:', error);
    return { success: false, error: error.message || 'فشل رفع ملف الحقائب' };
  }
}

// ─────────────────────────────────────────────
// Shipping Rates
// ─────────────────────────────────────────────

export async function getAllShippingRates() {
  try {
    const rates = await prisma.shippingRate.findMany({
      orderBy: [{ wilaya: 'asc' }, { method: 'asc' }],
    });
    return { success: true, rates };
  } catch (error) {
    console.error('Get shipping rates error:', error);
    return { success: false, error: 'Failed to fetch shipping rates' };
  }
}

export async function upsertShippingRate(data: {
  wilaya: string;
  method: string;
  costDZD: number;
}) {
  try {
    const rate = await prisma.shippingRate.upsert({
      where: {
        wilaya_method: {
          wilaya: data.wilaya,
          method: data.method,
        },
      },
      update: { costDZD: data.costDZD },
      create: {
        wilaya: data.wilaya,
        method: data.method,
        costDZD: data.costDZD,
      },
    });
    revalidatePath('/admin/shipping');
    return { success: true, rate };
  } catch (error) {
    console.error('Upsert shipping rate error:', error);
    return { success: false, error: 'Failed to save shipping rate' };
  }
}

export async function toggleShippingRate(id: string, isActive: boolean) {
  try {
    const rate = await prisma.shippingRate.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/admin/shipping');
    return { success: true, rate };
  } catch (error) {
    console.error('Toggle shipping rate error:', error);
    return { success: false, error: 'Failed to update shipping rate' };
  }
}

export async function deleteAllShippingRates() {
  try {
    const { count } = await prisma.shippingRate.deleteMany({});
    revalidatePath('/admin/shipping');
    return { success: true, count };
  } catch (error) {
    console.error('Delete all shipping rates error:', error);
    return { success: false, error: 'Failed to delete all shipping rates' };
  }
}

export async function uploadShippingRatesCSV(csvContent: string) {
  try {
    const rows = parseCSV(csvContent);
    if (rows.length < 2) {
      return { success: false, error: 'CSV فارغ أو غير صالح. يجب أن يحتوي على صف عنوان + صفوف بيانات.' };
    }

    const headers = rows[0];
    const required = ['wilaya', 'method', 'costDZD'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      return { success: false, error: `الأعمدة المطلوبة ناقصة: ${missing.join(', ')}` };
    }

    const getCol = (row: string[], header: string) => {
      const idx = headers.indexOf(header);
      return idx >= 0 ? row[idx] : undefined;
    };

    const dataRows = rows.slice(1);
    const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const wilaya = getCol(row, 'wilaya')?.trim() || '';
      const method = getCol(row, 'method')?.trim() || '';
      const costDZD = Number(getCol(row, 'costDZD'));

      if (!wilaya || !method || isNaN(costDZD)) {
        results.skipped++;
        continue;
      }

      try {
        const isActiveVal = getCol(row, 'isActive');
        const isActive = isActiveVal !== undefined ? isActiveVal.toLowerCase() !== 'false' : true;
        const existing = await prisma.shippingRate.findUnique({
          where: { wilaya_method: { wilaya, method } },
        });
        await prisma.shippingRate.upsert({
          where: { wilaya_method: { wilaya, method } },
          update: { costDZD, isActive },
          create: { wilaya, method, costDZD, isActive },
        });
        if (existing) {
          results.updated++;
        } else {
          results.created++;
        }
      } catch (err: any) {
        results.errors.push(`صف ${i + 2} (${wilaya} / ${method}): ${err.message || 'خطأ غير معروف'}`);
      }
    }

    revalidatePath('/admin/shipping');
    return { success: true, results };
  } catch (error: any) {
    console.error('Upload shipping rates CSV error:', error);
    return { success: false, error: error.message || 'فشل رفع ملف أسعار التوصيل' };
  }
}

// ─────────────────────────────────────────────
// Products CSV Download
// ─────────────────────────────────────────────

export async function downloadProductsCSV() {
  try {
    const products = await prisma.supplyItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['id', 'nameAr', 'nameFr', 'descriptionAr', 'descriptionFr', 'brand', 'categoryAr', 'categoryFr', 'unitPriceDZD', 'costPriceDZD', 'retailPriceDZD', 'stockQuantity', 'imageUrl', 'isActive'];
    const rows = products.map((p) => [
      p.id,
      p.nameAr,
      p.nameFr,
      p.descriptionAr,
      p.descriptionFr,
      p.brand,
      p.categoryAr,
      p.categoryFr,
      p.unitPriceDZD,
      p.costPriceDZD,
      p.retailPriceDZD,
      p.stockQuantity,
      p.imageUrl,
      p.isActive,
    ]);

    return { success: true, csv: '\uFEFF' + toCSV([headers, ...rows]) };
  } catch (error: any) {
    console.error('Download products CSV error:', error);
    return { success: false, error: error.message || 'فشل تحميل ملف المنتجات' };
  }
}

// ─────────────────────────────────────────────
// Packs CSV Download
// ─────────────────────────────────────────────

export async function downloadPacksCSV() {
  try {
    const packs = await prisma.hakibatiPack.findMany({
      include: {
        items: {
          include: { supplyItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['id', 'nameAr', 'nameFr', 'descriptionAr', 'descriptionFr', 'gradeLevel', 'basePriceDZD', 'discountPercent', 'imageUrl', 'isActive', 'items'];
    const rows = packs.map((p) => {
      const items = p.items.map((i) => `${i.supplyItem.nameAr}:${i.quantity}`).join('|');
      return [
        p.id,
        p.nameAr,
        p.nameFr,
        p.descriptionAr,
        p.descriptionFr,
        p.gradeLevel,
        p.basePriceDZD,
        p.discountPercent,
        p.imageUrl,
        p.isActive,
        items,
      ];
    });

    return { success: true, csv: '\uFEFF' + toCSV([headers, ...rows]) };
  } catch (error: any) {
    console.error('Download packs CSV error:', error);
    return { success: false, error: error.message || 'فشل تحميل ملف الحقائب' };
  }
}

// ─────────────────────────────────────────────
// Shipping Rates CSV Download
// ─────────────────────────────────────────────

export async function downloadShippingRatesCSV() {
  try {
    const rates = await prisma.shippingRate.findMany({
      orderBy: [{ wilaya: 'asc' }, { method: 'asc' }],
    });

    const headers = ['wilaya', 'method', 'costDZD', 'isActive'];
    const rows = rates.map((r) => [r.wilaya, r.method, r.costDZD, r.isActive]);

    return { success: true, csv: '\uFEFF' + toCSV([headers, ...rows]) };
  } catch (error: any) {
    console.error('Download shipping rates CSV error:', error);
    return { success: false, error: error.message || 'فشل تحميل ملف أسعار التوصيل' };
  }
}

// ─────────────────────────────────────────────
// Seed Default Shipping Rates
// ─────────────────────────────────────────────

export async function seedDefaultShippingRates() {
  try {
    const wilayas = [
      'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار',
      'البليدة','البويرة','تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجزائر',
      'الجلفة','جيجل','سطيف','سعيدة','سكيكدة','سيدي بلعباس','عنابة','قالمة',
      'قسنطينة','المدية','مستغانم','المسيلة','معسكر','ورقلة','وهران','البيض',
      'إليزي','برج بوعريريج','بومرداس','الطارف','تندوف','تيسمسيلت','الوادي',
      'خنشلة','سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تيموشنت',
      'غرداية','غليزان','تيميمون','برج باجي مختار','أولاد جلال','بني عباس',
      'عين صالح','عين قزام','توقرت','جانت','المغير','المنيعة',
    ];

    const data = wilayas.flatMap((wilaya) => [
      { wilaya, method: 'STOP_DESK', costDZD: 0, isActive: true },
      { wilaya, method: 'HOME_DELIVERY', costDZD: 400, isActive: true },
    ]);

    const results = { created: 0, updated: 0 };

    for (const row of data) {
      const existing = await prisma.shippingRate.findUnique({
        where: { wilaya_method: { wilaya: row.wilaya, method: row.method } },
      });
      await prisma.shippingRate.upsert({
        where: { wilaya_method: { wilaya: row.wilaya, method: row.method } },
        update: { costDZD: row.costDZD, isActive: row.isActive },
        create: row,
      });
      if (existing) {
        results.updated++;
      } else {
        results.created++;
      }
    }

    revalidatePath('/admin/shipping');
    return { success: true, results };
  } catch (error: any) {
    console.error('Seed shipping rates error:', error);
    return { success: false, error: error.message || 'فشل تعبئة أسعار التوصيل' };
  }
}

// ─────────────────────────────────────────────
// Admin Notifications
// ─────────────────────────────────────────────

export async function getAdminNotifications(role?: string) {
  try {
    const [pendingConfirmation, confirmed, dispatched, pendingReviews] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING_CONFIRMATION' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.order.count({ where: { status: 'DISPATCHED' } }),
      prisma.review.count({ where: { isApproved: false } }),
    ]);

    let pendingOrders = 0;
    switch (role) {
      case 'ORDER_CONFIRMATION_AGENT':
        pendingOrders = pendingConfirmation;
        break;
      case 'PREP_AGENT':
        pendingOrders = confirmed;
        break;
      case 'SHIPPING_AGENT':
        pendingOrders = dispatched;
        break;
      default:
        pendingOrders = pendingConfirmation + confirmed + dispatched;
    }

    const canSeeReviews = role === 'ADMIN' || role === 'MASTER_ADMIN';

    return {
      success: true,
      data: {
        pendingOrders,
        pendingReviews: canSeeReviews ? pendingReviews : 0,
        breakdown: { pendingConfirmation, confirmed, dispatched },
        total: pendingOrders + (canSeeReviews ? pendingReviews : 0),
      },
    };
  } catch (error) {
    console.error('Get admin notifications error:', error);
    return {
      success: false,
      data: { pendingOrders: 0, pendingReviews: 0, breakdown: { pendingConfirmation: 0, confirmed: 0, dispatched: 0 }, total: 0 },
    };
  }
}

// ─────────────────────────────────────────────
// User Management (Master Admin only)
// ─────────────────────────────────────────────

export async function getAllUsers(options?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options?.role) where.role = options.role;
    if (options?.search) {
      where.OR = [
        { fullName: { contains: options.search, mode: 'insensitive' } },
        { phone: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          phone: true,
          email: true,
          fullName: true,
          role: true,
          wilaya: true,
          commune: true,
          address: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { success: true, users, total, page, limit };
  } catch (error) {
    console.error('Get all users error:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function createStaffUser(data: {
  phone: string;
  fullName: string;
  password: string;
  role: string;
  wilaya: string;
  email?: string;
}) {
  try {
    if (data.role === 'MASTER_ADMIN') {
      const existing = await prisma.user.findFirst({ where: { role: 'MASTER_ADMIN' } });
      if (existing) {
        return { success: false, error: 'لا يمكن إنشاء أكثر من حساب مدير نظام واحد' };
      }
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        phone: data.phone,
        fullName: data.fullName,
        password: hashedPassword,
        role: data.role as any,
        wilaya: data.wilaya,
        email: data.email || null,
      },
    });

    return { success: true, user: { id: user.id, phone: user.phone, fullName: user.fullName, role: user.role } };
  } catch (error: any) {
    console.error('Create staff user error:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'رقم الهاتف أو البريد الإلكتروني مستخدم مسبقاً' };
    }
    return { success: false, error: error.message || 'فشل إنشاء المستخدم' };
  }
}

export async function deleteUser(id: string) {
  try {
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (target?.role === 'MASTER_ADMIN') {
      return { success: false, error: 'لا يمكن حذف حساب مدير النظام' };
    }
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { success: false, error: error.message || 'فشل حذف المستخدم' };
  }
}

export async function updateUserRole(id: string, role: string) {
  try {
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (target?.role === 'MASTER_ADMIN') {
      return { success: false, error: 'لا يمكن تغيير دور مدير النظام' };
    }
    if (role === 'MASTER_ADMIN') {
      const existing = await prisma.user.findFirst({ where: { role: 'MASTER_ADMIN' } });
      if (existing && existing.id !== id) {
        return { success: false, error: 'يوجد حساب مدير نظام آخر مسبقاً' };
      }
    }
    const user = await prisma.user.update({
      where: { id },
      data: { role: role as any },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error('Update user role error:', error);
    return { success: false, error: error.message || 'فشل تحديث الدور' };
  }
}

// ─────────────────────────────────────────────
// Order Items Editing
// ─────────────────────────────────────────────

async function recalculateOrderTotals(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;

  const subtotal = order.items.reduce((sum, item) => sum + item.totalPriceDZD, 0);
  const total = subtotal + order.shippingCostDZD;

  await prisma.order.update({
    where: { id: orderId },
    data: { subtotalDZD: subtotal, totalDZD: total },
  });
}

export async function removeOrderItem(orderId: string, itemId: string) {
  try {
    await prisma.orderItem.delete({ where: { id: itemId } });
    await recalculateOrderTotals(orderId);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    console.error('Remove order item error:', error);
    return { success: false, error: error.message || 'فشل حذف العنصر' };
  }
}

export async function addOrderItem(
  orderId: string,
  data: {
    itemName: string;
    quantity: number;
    unitPriceDZD: number;
    supplyItemId?: string;
  }
) {
  try {
    const total = data.unitPriceDZD * data.quantity;
    await prisma.orderItem.create({
      data: {
        orderId,
        itemName: data.itemName,
        quantity: data.quantity,
        unitPriceDZD: data.unitPriceDZD,
        totalPriceDZD: total,
        supplyItemId: data.supplyItemId || null,
      },
    });
    await recalculateOrderTotals(orderId);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    console.error('Add order item error:', error);
    return { success: false, error: error.message || 'فشل إضافة العنصر' };
  }
}

export async function updateOrderItemQuantity(orderId: string, itemId: string, quantity: number) {
  try {
    if (quantity < 1) {
      return { success: false, error: 'الكمية يجب أن تكون 1 على الأقل' };
    }
    const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return { success: false, error: 'العنصر غير موجود' };
    }
    const total = item.unitPriceDZD * quantity;
    await prisma.orderItem.update({
      where: { id: itemId },
      data: { quantity, totalPriceDZD: total },
    });
    await recalculateOrderTotals(orderId);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    console.error('Update order item quantity error:', error);
    return { success: false, error: error.message || 'فشل تحديث الكمية' };
  }
}

export async function updateOrderItemData(orderId: string, itemId: string, data: {
  itemName: string;
  unitPriceDZD: number;
  quantity: number;
}) {
  try {
    const total = data.unitPriceDZD * data.quantity;
    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        itemName: data.itemName,
        unitPriceDZD: data.unitPriceDZD,
        quantity: data.quantity,
        totalPriceDZD: total,
      },
    });
    await recalculateOrderTotals(orderId);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    console.error('Update order item data error:', error);
    return { success: false, error: error.message || 'فشل تحديث العنصر' };
  }
}
