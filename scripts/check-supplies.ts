import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.supplyItem.findMany();
  console.log('Total supply items:', items.length);
  items.forEach((i) => {
    console.log(i.id, '|', i.nameAr, '| active:', i.isActive);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
