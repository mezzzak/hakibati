import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  const brands = ['UNIBALL', 'Pentel', 'Faber-Castell', 'Maped', 'Staedtler', 'Pilot', 'Bic'];

  for (const brand of brands) {
    const pens = items.filter(i => {
      const t = `${i.nameAr} ${i.nameFr} ${i.brand || ''}`.toLowerCase();
      return i.brand?.toLowerCase() === brand.toLowerCase() &&
        (t.includes('stylo') || t.includes('قلم') || t.includes('bille') || t.includes('حبر'));
    });
    console.log(`\n=== ${brand} ===`);
    pens.forEach(i => console.log(`  ${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA | ${i.brand}`));
  }
}

main().finally(() => p.$disconnect());
