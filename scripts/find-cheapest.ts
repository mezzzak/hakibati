import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  // Ministry list requirements for CEM
  const needs = [
    { name: 'كراس 192 صفحة', keywords: ['192'] },
    { name: 'كراس 120 صفحة', keywords: ['120'] },
    { name: 'كراس 96 صفحة', keywords: ['96'] },
    { name: 'كراس 64 صفحة', keywords: ['64'] },
    { name: 'كراس 48 صفحة', keywords: ['48'] },
    { name: 'كراس 32 صفحة', keywords: ['32'] },
    { name: 'كراس أعمال تطبيقية (ح.ك)', keywords: ['تطبيقية', 'travaux pratiques'] },
    { name: 'كراس موسيقى/صولفيج', keywords: ['موسيقى', 'صولفيج', 'solfège', 'musique'] },
    { name: 'قلم حبر أزرق', keywords: ['حبر أزرق', 'bille bleu'] },
    { name: 'قلم حبر أخضر', keywords: ['حبر أخضر', 'bille vert', 'vert'] },
    { name: 'قلم رصاص HB', keywords: ['رصاص HB', 'crayon HB'] },
    { name: 'ممحاة', keywords: ['ممحاة', 'gomme'] },
    { name: 'مبراة', keywords: ['مبراة', 'taille-crayon'] },
    { name: 'علبة أقلام ملونة', keywords: ['أقلام ملونة', 'crayons de couleur'] },
    { name: 'غراء', keywords: ['غراء', 'colle'] },
    { name: 'مسطرة', keywords: ['مسطرة', 'règle'] },
    { name: 'كوس/منقلة', keywords: ['منقلة', 'rapporteur'] },
    { name: 'مدور/بركار', keywords: ['مدور', 'بركار', 'compas'] },
    { name: 'مثلث', keywords: ['مثلث', 'équerre'] },
    { name: 'حافظة أوراق مزدوجة', keywords: ['حافظة', 'chemise', 'porte-documents'] },
    { name: 'ورق ميليمتري', keywords: ['ميليمتري', 'millimétré'] },
    { name: 'ورق شفاف', keywords: ['شفاف', 'transparent', 'calque'] },
    { name: 'آلة حاسبة', keywords: ['حاسبة', 'calculatrice'] },
    { name: 'أوراق رسم', keywords: ['رسم', 'dessin'] },
    { name: 'أقلام لباد', keywords: ['لباد', 'feutres'] },
    { name: 'ألوان مائية', keywords: ['مائية', 'aquarelle'] },
    { name: 'فرشاة', keywords: ['فرشاة', 'pinceau'] },
    { name: 'أغلفة بلاستيكية', keywords: ['أغلفة', 'couvertures'] },
    { name: 'بطاقات لاصقة', keywords: ['بطاقات', 'étiquettes'] },
    { name: 'حقيبة ظهر', keywords: ['حقيبة', 'cartable', 'sac à dos'] },
  ];

  for (const need of needs) {
    const matches = items.filter(i => {
      const text = `${i.nameAr} ${i.nameFr} ${i.category}`.toLowerCase();
      return need.keywords.some(k => text.includes(k.toLowerCase()));
    });

    const cheapest = matches[0];
    console.log(`\n${need.name}:`);
    if (cheapest) {
      console.log(`  ✅ CHEAPEST: ${cheapest.nameAr} / ${cheapest.nameFr} — ${cheapest.unitPriceDZD} DA (${cheapest.brand || 'no brand'}) [${cheapest.id}]`);
      if (matches.length > 1) {
        console.log(`  Alternatives:`);
        matches.slice(1, 4).forEach(m => {
          console.log(`    • ${m.nameAr} / ${m.nameFr} — ${m.unitPriceDZD} DA (${m.brand || 'no brand'}) [${m.id}]`);
        });
      }
    } else {
      console.log(`  ❌ NOT FOUND`);
    }
  }
}

main().finally(() => p.$disconnect());
