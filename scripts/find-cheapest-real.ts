import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });

  const find = (keywords: string[]) => {
    return items.find(i => {
      const text = `${i.nameAr} ${i.nameFr} ${i.category}`.toLowerCase();
      return keywords.every(k => text.includes(k.toLowerCase()));
    });
  };

  const needs = [
    { key: 'cahier 96', keywords: ['96'] },
    { key: 'cahier 64', keywords: ['64'] },
    { key: 'regle 30', keywords: ['مسطرة', 'règle'] },
    { key: 'equerre 60', keywords: ['60', 'équerre', 'مثلث'] },
    { key: 'rapporteur', keywords: ['منقلة', 'rapporteur'] },
    { key: 'cartable/sac', keywords: ['حقيبة', 'cartable', 'sac'] },
  ];

  for (const n of needs) {
    const match = find(n.keywords);
    if (match) {
      console.log(`${n.key}: ${match.id} | ${match.nameAr} / ${match.nameFr} | ${match.unitPriceDZD} DA | brand: ${match.brand || 'none'}`);
    } else {
      console.log(`${n.key}: NOT FOUND`);
    }
  }
}

main().finally(() => p.$disconnect());
