import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  console.log('=== calculatrice / calculator ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('calcul') || t.includes('حاسب') || t.includes('calculatrice');
  }).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== classeur / binder / مصنف ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return t.includes('classeur') || t.includes('مصنف') || t.includes('binder') || t.includes('ring');
  }).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== papier dessin / drawing paper / ورق رسم ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return (t.includes('dessin') || t.includes('رسم')) && !t.includes('لاصق') && !t.includes('adhésif');
  }).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));

  console.log('\n=== crayon / pencil / رصاص (not gomme/taille) ===');
  items.filter(i => {
    const t = `${i.nameAr} ${i.nameFr}`.toLowerCase();
    return (t.includes('crayon') || t.includes('قلم') || t.includes('رصاص')) && !t.includes('gomme') && !t.includes('ممحاة') && !t.includes('taille') && !t.includes('مبراة');
  }).slice(0, 15).forEach(i => console.log(`${i.id} | ${i.nameAr} / ${i.nameFr} | ${i.unitPriceDZD} DA`));
}

main().finally(() => p.$disconnect());
