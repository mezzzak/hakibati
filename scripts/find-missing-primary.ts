import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  console.log('=== stylo / green ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('stylo') || t.includes('قلم') || t.includes('vert') || t.includes('أخضر') || t.includes('green');
  }).slice(0, 20).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== crayon / رصاص ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('crayon') || t.includes('رصاص') || t.includes('pencil');
  }).slice(0, 20).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== pate / modeler / clay / عجينة ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('pâte') || t.includes('modeler') || t.includes('clay') || t.includes('عجينة') || t.includes('plasticine');
  }).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== counting / comptine / قريصات / numération ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('comptine') || t.includes('counting') || t.includes('numération') || t.includes('قريصات') || t.includes('boulier');
  }).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== cartable primary / ابتدائي ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('cartable') || t.includes('حقيبة') || t.includes('sac') || t.includes('محفظة');
  }).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));
}

main().finally(() => p.$disconnect());
