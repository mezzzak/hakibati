import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  const find = (keywords: string[]) => {
    return items.find(i => {
      const text = `${i.nameAr} ${i.nameFr} ${i.category} ${i.descriptionAr || ''} ${i.descriptionFr || ''}`.toLowerCase();
      return keywords.every(k => text.includes(k.toLowerCase()));
    });
  };

  const findAny = (keywords: string[][]) => {
    for (const kw of keywords) {
      const m = find(kw);
      if (m) return m;
    }
    return undefined;
  };

  const needs = [
    { label: 'cahier 64', keywords: [['64', 'كراس'], ['64', 'cahier']] },
    { label: 'cahier dessin / رسم', keywords: [['رسم', 'كراس'], ['dessin', 'cahier'], ['رسم', 'دفتر']] },
    { label: 'couverture plastique cahiers', keywords: [['غلاف', 'بلاستيك'], ['غلاف', 'كراس'], ['couverture', 'plastique'], ['أغلفة', 'بلاستيكية']] },
    { label: 'couverture plastique livres', keywords: [['غلاف', 'كتاب'], ['غلاف', 'livre'], ['couverture', 'livre']] },
    { label: 'ardoise / لوحة', keywords: [['لوحة', 'ممسحة'], ['ardoise'], ['slate']] },
    { label: 'trousse / مقلمة', keywords: [['مقلمة'], ['trousse'], ['pencil case']] },
    { label: 'stylo bleu', keywords: [['قلم', 'أزرق'], ['stylo', 'bleu'], ['حبر', 'أزرق']] },
    { label: 'stylo vert', keywords: [['قلم', 'أخضر'], ['stylo', 'vert'], ['حبر', 'أخضر'], ['green']] },
    { label: 'crayon HB / رصاص', keywords: [['قلم', 'رصاص'], ['crayon', 'hb'], ['pencil', 'hb'], ['رصاص']] },
    { label: 'taille-crayon / مبراة', keywords: [['مبراة'], ['taille'], ['sharpener']] },
    { label: 'gomme / ممحاة', keywords: [['ممحاة'], ['gomme']] },
    { label: 'crayons couleur 6', keywords: [['أقلام', 'ملونة'], ['crayons', 'couleur'], ['crayon', 'couleur'], ['colored', 'pencil']] },
    { label: 'regle / مسطرة', keywords: [['مسطرة'], ['règle'], ['regle']] },
    { label: 'comptine / قريصات', keywords: [['قريصات'], ['comptine'], ['counting'], ['خشبيات'], ['numération']] },
    { label: 'pate a modeler / عجينة', keywords: [['عجينة'], ['pâte'], ['modeler'], ['plasticine'], ['playdough']] },
    { label: 'papier couleur / أوراق ملونة', keywords: [['أوراق', 'ملونة'], ['papier', 'couleur'], ['colored', 'paper']] },
    { label: 'cahier petit / صغير 32-48', keywords: [['32', 'كراس'], ['48', 'كراس'], ['32', 'cahier'], ['48', 'cahier'], ['petit', 'cahier'], ['صغير', 'كراس']] },
    { label: 'equerre / كوس', keywords: [['كوس'], ['équerre'], ['equerre'], ['مثلث']] },
    { label: 'rapporteur / منقلة', keywords: [['منقلة'], ['rapporteur']] },
    { label: 'compas / مدور', keywords: [['بركار'], ['مدور'], ['compas'], ['compass']] },
  ];

  for (const n of needs) {
    const match = findAny(n.keywords);
    if (match) {
      console.log(`${n.label}: ${match.id} | ${match.nameAr} / ${match.nameFr} | ${match.unitPriceDZD} DA | brand: ${match.brand || 'none'}`);
    } else {
      console.log(`${n.label}: NOT FOUND`);
    }
  }
}

main().finally(() => p.$disconnect());
