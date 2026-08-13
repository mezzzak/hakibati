/**
 * ─────────────────────────────────────────────
 * Hakibati Courier Integration Layer
 * Supports: Yalidine Express, Maystro Delivery
 * ─────────────────────────────────────────────
 */

export interface ShippingPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerPhone2?: string;
  wilaya: string;
  commune: string;
  address: string;
  notes?: string;
  codAmount: number; // Cash on delivery amount in DZD
  products: {
    name: string;
    quantity: number;
  }[];
}

export interface ShippingResponse {
  success: boolean;
  trackingNumber?: string;
  barcodeUrl?: string;
  labelUrl?: string;
  estimatedDelivery?: string;
  error?: string;
}

export type CourierProvider = 'YALIDINE' | 'MAYSTRO';

// ─────────────────────────────────────────────
// Yalidine Express API Stub
// Docs: https://yalidine.com/api-docs (placeholder)
// ─────────────────────────────────────────────

const YALIDINE_API_BASE = process.env.YALIDINE_API_URL ?? 'https://api.yalidine.com/v1';
const YALIDINE_API_KEY = process.env.YALIDINE_API_KEY ?? '';

async function pushToYalidine(payload: ShippingPayload): Promise<ShippingResponse> {
  try {
    // Uncomment when API credentials are available:
    // const res = await fetch(`${YALIDINE_API_BASE}/shipments`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${YALIDINE_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     reference: payload.orderNumber,
    //     fullname: payload.customerName,
    //     phone: payload.customerPhone,
    //     phone2: payload.customerPhone2,
    //     wilaya: payload.wilaya,
    //     commune: payload.commune,
    //     address: payload.address,
    //     comment: payload.notes,
    //     cod: payload.codAmount,
    //     products: payload.products,
    //   }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.message);

    // Stub response for development / pre-integration
    const trackingNumber = `YLD-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      trackingNumber,
      barcodeUrl: generateBarcodeSvg(trackingNumber),
      labelUrl: `${YALIDINE_API_BASE}/labels/${trackingNumber}`,
      estimatedDelivery: getEstimatedDelivery(3),
    };
  } catch (err: any) {
    console.error('[Yalidine] Push failed:', err);
    return { success: false, error: err.message ?? 'Yalidine API error' };
  }
}

// ─────────────────────────────────────────────
// Maystro Delivery API Stub
// Docs: https://maystro.dz/api (placeholder)
// ─────────────────────────────────────────────

const MAYSTRO_API_BASE = process.env.MAYSTRO_API_URL ?? 'https://api.maystro.dz/v2';
const MAYSTRO_API_KEY = process.env.MAYSTRO_API_KEY ?? '';

async function pushToMaystro(payload: ShippingPayload): Promise<ShippingResponse> {
  try {
    // Uncomment when API credentials are available:
    // const res = await fetch(`${MAYSTRO_API_BASE}/orders`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-API-Key': MAYSTRO_API_KEY,
    //   },
    //   body: JSON.stringify({
    //     external_ref: payload.orderNumber,
    //     recipient_name: payload.customerName,
    //     recipient_phone: payload.customerPhone,
    //     recipient_phone_alt: payload.customerPhone2,
    //     wilaya_name: payload.wilaya,
    //     commune_name: payload.commune,
    //     detailed_address: payload.address,
    //     instruction: payload.notes,
    //     amount_to_collect: payload.codAmount,
    //     items: payload.products.map((p) => ({
    //       name: p.name,
    //       quantity: p.quantity,
    //     })),
    //   }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.message);

    // Stub response for development / pre-integration
    const trackingNumber = `MYS-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      trackingNumber,
      barcodeUrl: generateBarcodeSvg(trackingNumber),
      labelUrl: `${MAYSTRO_API_BASE}/waybills/${trackingNumber}`,
      estimatedDelivery: getEstimatedDelivery(2),
    };
  } catch (err: any) {
    console.error('[Maystro] Push failed:', err);
    return { success: false, error: err.message ?? 'Maystro API error' };
  }
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

export async function pushOrderToCourier(
  provider: CourierProvider,
  payload: ShippingPayload
): Promise<ShippingResponse> {
  switch (provider) {
    case 'YALIDINE':
      return pushToYalidine(payload);
    case 'MAYSTRO':
      return pushToMaystro(payload);
    default:
      return { success: false, error: 'Unknown courier provider' };
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getEstimatedDelivery(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Generates a Code-128 barcode as an inline SVG.
 * This is a simplified stub — replace with a proper barcode library
 * (e.g. jsbarcode or a server-side rendering) for production.
 */
function generateBarcodeSvg(data: string): string {
  const width = data.length * 12 + 40;
  const height = 80;
  // Simple visual placeholder barcode (alternating bars)
  let bars = '';
  for (let i = 0; i < data.length; i++) {
    const x = 20 + i * 12;
    const w = 6;
    bars += `<rect x="${x}" y="10" width="${w}" height="50" fill="#000"/>`;
  }
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white"/>${bars}<text x="${width / 2}" y="72" text-anchor="middle" font-size="12" font-family="monospace">${data}</text></svg>`;
}
