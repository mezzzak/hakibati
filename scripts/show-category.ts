import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  // Show items by relevant categories
  const categories = ['كراسات ودفاتر', 'أدوات الكتابة', 'الهندسة والقياس', 'الرسم والفنون', 'accessoires', 'cahiers', 'stylos', 'geometrie', 'arts', 'electronique', 'cartables'];

  for (const cat of categories) {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length === 0) continue;
    console.log(`\n=== ${cat} (${catItems.length} items) ===`);
    catItems.forEach(i => {
      console.log(`  ${i.unitPriceDZD} DA | ${i.nameAr} / ${i.nameFr} | brand: ${i.brand || 'none'} | [${i.id}]`);
    });
  }

  // Also search for specific items
  console.log('\n=== Search: أخضر / vert ===');
  items.filter(i => `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('vert') || `${i.nameAr} ${i.nameFr}`.toLowerCase().includes('أخضر')).forEach(i => {
    console.log(`  ${i.unitPriceDZD} DA | ${i.nameAr} / ${i.nameFr} | [${i.id}]`);
  });

  console.log('\n=== Search: شفاف / transparent / calque ===');
  items.filter(i => {
    const text = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return text.includes('شفاف') || text.includes('transparent') || text.includes('calque');
  }).forEach(i => {
    console.log(`  ${i.unitPriceDZD} DA | ${i.nameAr} / ${i.nameFr} | [${i.id}]`);
  });

  console.log('\n=== Search: أغلفة / couverture ===');
  items.filter(i => {
    const text = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return text.includes('أغلفة') || text.includes('couverture');
  }).forEach(i => {
    console.log(`  ${i.unitPriceDZD} DA | ${i.nameAr} / ${i.nameFr} | [${i.id}]`);
  });

  console.log('\n=== Search: 12 colors / 12 لون ===');
  items.filter(i => {
    const text = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return text.includes('12');
  }).forEach(i => {
    console.log(`  ${i.unitPriceDZD} DA | ${i.nameAr} / ${i.nameFr} | [${i.id}]`);
  });
}

main().finally(() => p.$disconnect());
