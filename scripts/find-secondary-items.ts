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
    { label: 'cahier 192', keywords: [['192', 'كراس'], ['192', 'cahier']] },
    { label: 'cahier 120', keywords: [['120', 'كراس'], ['120', 'cahier']] },
    { label: 'cahier 96', keywords: [['96', 'كراس'], ['96', 'cahier']] },
    { label: 'cahier 64', keywords: [['64', 'كراس'], ['64', 'cahier']] },
    { label: 'cahier 288', keywords: [['288', 'كراس'], ['288', 'cahier']] },
    { label: 'calculatrice scientifique', keywords: [['حاسبة', 'علمية'], ['calculatrice', 'scientifique'], ['calculatrice', 'casio']] },
    { label: 'regle / مسطرة', keywords: [['مسطرة'], ['règle']] },
    { label: 'equerre / كوس', keywords: [['كوس'], ['équerre'], ['equerre']] },
    { label: 'rapporteur / منقلة', keywords: [['منقلة'], ['rapporteur']] },
    { label: 'compas / مدور', keywords: [['بركار'], ['مدور'], ['compas']] },
    { label: 'cartable/محفظة', keywords: [['محفظة'], ['cartable'], ['sac']] },
    { label: 'trousse / مقلمة', keywords: [['مقلمة'], ['trousse']] },
    { label: 'stylo bleu', keywords: [['قلم', 'أزرق'], ['stylo', 'bleu']] },
    { label: 'stylo rouge', keywords: [['قلم', 'أحمر'], ['stylo', 'rouge']] },
    { label: 'stylo vert', keywords: [['قلم', 'أخضر'], ['stylo', 'vert']] },
    { label: 'crayon HB', keywords: [['قلم', 'رصاص'], ['crayon', 'hb'], ['pencil', 'hb']] },
    { label: 'taille-crayon', keywords: [['مبراة'], ['taille']] },
    { label: 'gomme', keywords: [['ممحاة'], ['gomme']] },
    { label: 'crayons couleur', keywords: [['أقلام', 'ملونة'], ['crayons', 'couleur']] },
    { label: 'colle / غراء', keywords: [['غراء'], ['colle'], ['glue']] },
    { label: 'ruban adhesif / شريط', keywords: [['شريط', 'لاصق'], ['ruban', 'adhésif'], ['scotch']] },
    { label: 'couverture cahiers', keywords: [['غلاف', 'كراس'], ['couverture', 'cahier'], ['protège-cahier']] },
    { label: 'couverture livres', keywords: [['غلاف', 'كتاب'], ['couverture', 'livre'], ['protège-livre']] },
    { label: 'papier millimetre', keywords: [['مليمتري'], ['millimétré'], ['millimetre']] },
    { label: 'pochette transparente / حافظة', keywords: [['حافظة', 'شفافة'], ['pochette'], ['chemise']] },
    { label: 'papier dessin / رسم', keywords: [['رسم', 'ورق'], ['dessin', 'papier'], ['papier', 'dessin']] },
    { label: 'couleurs aquarelle', keywords: [['مائية', 'ألوان'], ['aquarelle'], ['watercolor']] },
    { label: 'pinceaux', keywords: [['فرش'], ['pinceau']] },
    { label: 'ciseaux / مقص', keywords: [['مقص'], ['ciseaux']] },
    { label: 'cahier dessin', keywords: [['رسم', 'كراس'], ['dessin', 'cahier']] },
    { label: 'classeur / مصنف', keywords: [['مصنف'], ['classeur'], ['classeur', 'anneaux']] },
    { label: 'cahier 32-48 petit', keywords: [['32', 'كراس'], ['48', 'كراس']] },
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
