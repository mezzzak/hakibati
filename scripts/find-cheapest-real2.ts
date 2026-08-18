import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  console.log('=== All geometry items ===');
  items
    .filter(i => i.category === 'geometrie' || `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('مثلث') || `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('équerre'))
    .forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== All cartable items ===');
  items
    .filter(i => i.category === 'cartables' || `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('cartable') || `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('حقيبة') || `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('sac'))
    .forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));
}

main().finally(() => p.$disconnect());
