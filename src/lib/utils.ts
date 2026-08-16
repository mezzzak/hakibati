import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getUserLocale(): string {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('hakibati-language');
    if (lang === 'fr') return 'fr-DZ';
  }
  return 'ar-DZ';
}

export function formatDZD(amount: number, locale?: string): string {
  return new Intl.NumberFormat(locale || getUserLocale(), {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(getUserLocale(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function displayPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  // Convert stored international 213... back to national 0... for display
  if (phone.startsWith('213') && phone.length > 10) {
    return '0' + phone.slice(3);
  }
  return phone;
}

export interface PackContentItem {
  supplyItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  display: string;
}

export interface PackItemName {
  isPack: boolean;
  nameAr: string;
  nameFr: string;
  contents: PackContentItem[];
  legacyContents: string[];
}

export function parsePackItemName(itemName: string | null | undefined): PackItemName {
  if (!itemName || !itemName.startsWith('__PACK__')) {
    return { isPack: false, nameAr: itemName || '', nameFr: '', contents: [], legacyContents: [] };
  }
  const rest = itemName.slice('__PACK__'.length);
  const newlineIndex = rest.indexOf('\n');
  const namesPart = newlineIndex >= 0 ? rest.slice(0, newlineIndex) : rest;
  const contentsPart = newlineIndex >= 0 ? rest.slice(newlineIndex + 1) : '';
  const [nameAr, nameFr] = namesPart.split('|||');
  const rawItems = contentsPart
    ? contentsPart.split(' · ').filter((s) => s.trim().length > 0)
    : [];

  const contents: PackContentItem[] = [];
  const legacyContents: string[] = [];

  for (const raw of rawItems) {
    const parts = raw.split('::');
    if (parts.length >= 4) {
      const qty = parseInt(parts[3], 10);
      contents.push({
        supplyItemId: parts[0],
        name: parts[1],
        unitPrice: parseInt(parts[2], 10) || 0,
        quantity: isNaN(qty) ? 1 : qty,
        display: `${parts[1]} ×${isNaN(qty) ? 1 : qty}`,
      });
    } else {
      legacyContents.push(raw);
    }
  }

  return { isPack: true, nameAr: nameAr || '', nameFr: nameFr || '', contents, legacyContents };
}

export function buildPackItemName(nameAr: string, nameFr: string, contents: PackContentItem[]): string {
  const lines = contents.map((c) => `${c.supplyItemId}::${c.name}::${c.unitPrice}::${c.quantity}`).join(' · ');
  return `__PACK__${nameAr}|||${nameFr}\n${lines}`;
}
