import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const packs = await prisma.hakibatiPack.findMany({
    include: { items: true },
  });
  for (const p of packs) {
    console.log(p.id, '|', p.nameAr, '| items:', p.items.length);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
