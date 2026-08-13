'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './db';

// ─────────────────────────────────────────────
// Create Review (after order)
// ─────────────────────────────────────────────
export async function createReview(data: {
  orderId: string;
  rating: number;
  comment: string;
  authorName?: string;
  isAnonymous?: boolean;
  userId?: string;
}) {
  try {
    if (!data.orderId || !data.comment || !data.rating) {
      return { success: false, error: 'جميع الحقول المطلوبة غير مكتملة' };
    }
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: 'التقييم يجب أن يكون بين 1 و 5 نجوم' };
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { reviews: true },
    });
    if (!order) {
      return { success: false, error: 'الطلب غير موجود' };
    }
    if (order.reviews.length > 0) {
      return { success: false, error: 'تم إضافة تقييم لهذا الطلب مسبقاً' };
    }

    const review = await prisma.review.create({
      data: {
        orderId: data.orderId,
        rating: data.rating,
        comment: data.comment,
        authorName: data.authorName || null,
        isAnonymous: data.isAnonymous ?? false,
        userId: data.userId || null,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/reviews');
    return { success: true, review };
  } catch (error: any) {
    console.error('Create review error:', error);
    return { success: false, error: error.message || 'فشل إضافة التقييم' };
  }
}

// ─────────────────────────────────────────────
// Get Approved Reviews (for homepage)
// ─────────────────────────────────────────────
export async function getApprovedReviews(limit?: number) {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: limit ?? 9,
      include: {
        order: {
          select: { wilaya: true },
        },
      },
    });
    return { success: true, reviews };
  } catch (error) {
    console.error('Get approved reviews error:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

// ─────────────────────────────────────────────
// Get Review by Order ID
// ─────────────────────────────────────────────
export async function getReviewByOrderId(orderId: string) {
  try {
    const review = await prisma.review.findFirst({
      where: { orderId },
    });
    return { success: true, review };
  } catch (error) {
    console.error('Get review by order error:', error);
    return { success: false, error: 'Failed to fetch review' };
  }
}

// ─────────────────────────────────────────────
// Get User Reviews
// ─────────────────────────────────────────────
export async function getUserReviews(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: { orderNumber: true, wilaya: true },
        },
      },
    });
    return { success: true, reviews };
  } catch (error) {
    console.error('Get user reviews error:', error);
    return { success: false, error: 'Failed to fetch user reviews' };
  }
}

// ─────────────────────────────────────────────
// Delete Review (by user who created it)
// ─────────────────────────────────────────────
export async function deleteReview(reviewId: string, userId: string) {
  try {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });
    if (!review) {
      return { success: false, error: 'التقييم غير موجود أو ليس لديك صلاحية حذفه' };
    }

    await prisma.review.delete({ where: { id: reviewId } });
    revalidatePath('/');
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error: any) {
    console.error('Delete review error:', error);
    return { success: false, error: error.message || 'فشل حذف التقييم' };
  }
}

// ─────────────────────────────────────────────
// Admin: Get All Reviews (pending + approved)
// ─────────────────────────────────────────────
export async function getAllReviews(options?: {
  status?: 'pending' | 'approved' | 'all';
  page?: number;
  limit?: number;
}) {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    let where: any = {};
    if (options?.status === 'pending') {
      where = { isApproved: false };
    } else if (options?.status === 'approved') {
      where = { isApproved: true };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          order: {
            select: { orderNumber: true, customerName: true, wilaya: true },
          },
          user: {
            select: { fullName: true, phone: true },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { success: true, reviews, total, page, limit };
  } catch (error) {
    console.error('Get all reviews error:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

// ─────────────────────────────────────────────
// Admin: Approve Review
// ─────────────────────────────────────────────
export async function approveReview(id: string) {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
    revalidatePath('/');
    revalidatePath('/admin/reviews');
    return { success: true, review };
  } catch (error: any) {
    console.error('Approve review error:', error);
    return { success: false, error: error.message || 'فشل الموافقة على التقييم' };
  }
}

// ─────────────────────────────────────────────
// Admin: Decline / Delete Review
// ─────────────────────────────────────────────
export async function declineReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error: any) {
    console.error('Decline review error:', error);
    return { success: false, error: error.message || 'فشل رفض التقييم' };
  }
}
