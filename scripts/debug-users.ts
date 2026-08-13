import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { phone: '0555000000' },
  });
  console.log('Users with phone 0555000000:', users.length);
  users.forEach((u, i) => {
    console.log(`  [${i}] id=${u.id} role=${u.role} name=${u.fullName}`);
  });

  const allAdmins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'MASTER_ADMIN'] } },
    orderBy: { createdAt: 'asc' },
  });
  console.log('\nAll admin/master users:');
  allAdmins.forEach((u) => {
    console.log(`  ${u.phone} | ${u.role} | ${u.fullName}`);
  });

  await prisma.$disconnect();
}

main();
