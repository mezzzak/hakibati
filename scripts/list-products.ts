import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const items = await p.supplyItem.findMany({
    where: { isActive: true },
    orderBy: { unitPriceDZD: 'asc' },
  });
  console.log(JSON.stringify(items.map(i => ({
    id: i.id,
    nameAr: i.nameAr,
    nameFr: i.nameFr,
    category: i.category,
    price: i.unitPriceDZD,
    brand: i.brand,
  })), null, 2));
}

main().finally(() => p.$disconnect());
