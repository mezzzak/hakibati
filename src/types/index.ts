export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum GradeLevel {
  AP1 = 'AP1',
  AP2 = 'AP2',
  AP3 = 'AP3',
  AP4 = 'AP4',
  AP5 = 'AP5',
  AM1 = 'AM1',
  AM2 = 'AM2',
  AM3 = 'AM3',
  AM4 = 'AM4',
  AS1 = 'AS1',
  AS2 = 'AS2',
  AS3 = 'AS3',
  CUSTOM = 'CUSTOM',
}

export type GradeCategory = 'primaire' | 'cem' | 'lycee' | 'custom';

export function getGradeCategory(level: GradeLevel): GradeCategory {
  switch (level) {
    case GradeLevel.AP1:
    case GradeLevel.AP2:
    case GradeLevel.AP3:
    case GradeLevel.AP4:
    case GradeLevel.AP5:
      return 'primaire';
    case GradeLevel.AM1:
    case GradeLevel.AM2:
    case GradeLevel.AM3:
    case GradeLevel.AM4:
      return 'cem';
    case GradeLevel.AS1:
    case GradeLevel.AS2:
    case GradeLevel.AS3:
      return 'lycee';
    case GradeLevel.CUSTOM:
      return 'custom';
  }
}

export function getGradeLabel(level: GradeLevel, language: 'ar' | 'fr' = 'ar'): string {
  const labels: Record<GradeLevel, { ar: string; fr: string }> = {
    [GradeLevel.AP1]: { ar: '1AP', fr: '1AP' },
    [GradeLevel.AP2]: { ar: '2AP', fr: '2AP' },
    [GradeLevel.AP3]: { ar: '3AP', fr: '3AP' },
    [GradeLevel.AP4]: { ar: '4AP', fr: '4AP' },
    [GradeLevel.AP5]: { ar: '5AP', fr: '5AP' },
    [GradeLevel.AM1]: { ar: '1AM', fr: '1AM' },
    [GradeLevel.AM2]: { ar: '2AM', fr: '2AM' },
    [GradeLevel.AM3]: { ar: '3AM', fr: '3AM' },
    [GradeLevel.AM4]: { ar: '4AM', fr: '4AM' },
    [GradeLevel.AS1]: { ar: '1AS', fr: '1AS' },
    [GradeLevel.AS2]: { ar: '2AS', fr: '2AS' },
    [GradeLevel.AS3]: { ar: '3AS', fr: '3AS' },
    [GradeLevel.CUSTOM]: { ar: 'مخصص', fr: 'Personnalisé' },
  };
  return labels[level][language];
}

export function getCategoryLabel(category: GradeCategory, language: 'ar' | 'fr' = 'ar'): string {
  const labels: Record<GradeCategory, { ar: string; fr: string }> = {
    primaire: { ar: 'الابتدائي', fr: 'Primaire' },
    cem: { ar: 'المتوسط', fr: 'CEM' },
    lycee: { ar: 'الثانوي', fr: 'Lycée' },
    custom: { ar: 'مخصص', fr: 'Personnalisé' },
  };
  return labels[category][language];
}

export enum OrderStatus {
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ShippingMethod {
  HOME_DELIVERY = 'HOME_DELIVERY',
  OFFICE_PICKUP = 'OFFICE_PICKUP',
  STOP_DESK = 'STOP_DESK',
  YALIDINE = 'YALIDINE',
  ECO_SHIPPING = 'ECO_SHIPPING',
}

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  fullName: string;
  role: Role;
  wilaya: string;
  commune?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplyItem {
  id: string;
  nameAr: string;
  nameFr?: string | null;
  descriptionAr?: string | null;
  descriptionFr?: string | null;
  brand?: string | null;
  category: string;
  imageUrl?: string | null;
  unitPriceDZD: number;
  costPriceDZD: number;
  retailPriceDZD: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackItem {
  id: string;
  quantity: number;
  isOptional: boolean;
  supplyItem: SupplyItem;
  supplyItemId: string;
  hakibatiPack: HakibatiPack;
  hakibatiPackId: string;
}

export interface HakibatiPack {
  id: string;
  nameAr: string;
  nameFr?: string | null;
  descriptionAr?: string | null;
  descriptionFr?: string | null;
  gradeLevel: GradeLevel;
  imageUrl?: string | null;
  basePriceDZD: number;
  discountPercent: number;
  isActive: boolean;
  items: PackItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  quantity: number;
  supplyItem?: SupplyItem | null;
  supplyItemId?: string | null;
  hakibatiPack?: HakibatiPack | null;
  hakibatiPackId?: string | null;
  user?: User | null;
  userId?: string | null;
  sessionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPriceDZD: number;
  totalPriceDZD: number;
  itemName?: string | null;
  supplyItem?: SupplyItem | null;
  supplyItemId?: string | null;
  hakibatiPack?: HakibatiPack | null;
  hakibatiPackId?: string | null;
  order: Order;
  orderId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  shippingMethod: ShippingMethod;
  shippingCostDZD: number;
  subtotalDZD: number;
  totalDZD: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  wilaya: string;
  commune: string;
  address: string;
  notes?: string | null;
  adminNotes?: string | null;
  items: OrderItem[];
  callLogs?: CallLog[];
  user?: User | null;
  userId?: string | null;
  confirmedAt?: Date | null;
  dispatchedAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestName?: string;
  guestPhone?: string;
  wilaya: string;
  commune: string;
  address: string;
  shippingMethod: ShippingMethod;
  notes?: string;
  cartItems: {
    supplyItemId?: string;
    hakibatiPackId?: string;
    quantity: number;
  }[];
}

export interface CallLog {
  id: string;
  orderId: string;
  agentName?: string | null;
  outcome: string;
  notes?: string | null;
  createdAt: Date;
}

export interface Wilaya {
  code: number;
  nameAr: string;
  nameFr: string;
}
