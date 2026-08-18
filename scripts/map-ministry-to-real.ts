import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  const findCheapest = (keywords: string[], exclude: string[] = []) => {
    const matches = items.filter(i => {
      if (exclude.some(e => i.id.includes(e))) return false;
      const text = `${i.nameAr} ${i.nameFr} ${i.category}`.toLowerCase();
      return keywords.some(k => text.includes(k.toLowerCase()));
    });
    return matches[0] || null;
  };

  const mappings: Record<string, { id: string; nameAr: string; nameFr: string; price: number } | null> = {};

  // Notebooks
  mappings['cahier192'] = findCheapest(['192 صفحة', '192 pages']);
  mappings['cahier120'] = findCheapest(['120 صفحة', '120 pages']);
  mappings['cahier96'] = findCheapest(['96 صفحة', '96 pages']);
  mappings['cahier64'] = findCheapest(['64 صفحة', '64 pages']);
  mappings['cahier48'] = findCheapest(['48 صفحة', '48 pages']);
  mappings['cahier32'] = findCheapest(['32 صفحة', '32 pages']);
  mappings['cahierTp'] = findCheapest(['تطبيقية', 'travaux pratiques']);
  mappings['cahierMusique'] = findCheapest(['موسيقى', 'صولفيج', 'solfège', 'musique']);

  // Pens & pencils
  mappings['styloBleu'] = findCheapest(['حبر أزرق', 'bille bleu']);
  mappings['styloVert'] = findCheapest(['حبر أخضر', 'bille vert', 'vert']);
  mappings['crayonHb'] = findCheapest(['رصاص hb', 'crayon hb']);
  mappings['crayonB2'] = findCheapest(['رصاص b2', 'crayon b2']);

  // Accessories
  mappings['gomme'] = findCheapest(['ممحاة', 'gomme']);
  mappings['tailleCrayon'] = findCheapest(['مبراة', 'taille-crayon']);
  mappings['crayonsCouleur'] = findCheapest(['أقلام ملونة', 'crayons de couleur']);
  mappings['colle'] = findCheapest(['غراء', 'colle']);
  mappings['regle'] = findCheapest(['مسطرة', 'règle']);
  mappings['rapporteur'] = findCheapest(['منقلة', 'rapporteur']);
  mappings['compas'] = findCheapest(['مدور', 'بركار', 'compas']);
  mappings['equerre'] = findCheapest(['مثلث', 'équerre']);
  mappings['chemise'] = findCheapest(['حافظة', 'chemise', 'porte-documents']);
  mappings['papierMillimetre'] = findCheapest(['ميليمتري', 'millimétré']);
  mappings['papierTransparent'] = findCheapest(['شفاف', 'transparent', 'calque']);
  mappings['calculatrice'] = findCheapest(['حاسبة', 'calculatrice']);

  // Arts
  mappings['papierDessin'] = findCheapest(['رسم', 'dessin']);
  mappings['feutres'] = findCheapest(['لباد', 'feutres']);
  mappings['aquarelle'] = findCheapest(['مائية', 'aquarelle']);
  mappings['pinceaux'] = findCheapest(['فرشاة', 'pinceau']);

  // Covers & labels
  mappings['couvertures'] = findCheapest(['أغلفة', 'couvertures']);
  mappings['etiquettes'] = findCheapest(['بطاقات', 'étiquettes']);

  // Backpack
  mappings['sac'] = findCheapest(['حقيبة', 'cartable', 'sac à dos']);

  for (const [key, val] of Object.entries(mappings)) {
    if (val) {
      console.log(`${key}: ${val.id} | ${val.nameAr} / ${val.nameFr} | ${val.price} DA`);
    } else {
      console.log(`${key}: NOT FOUND`);
    }
  }
}

main().finally(() => p.$disconnect());
