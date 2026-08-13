const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ take: 5 });
  console.log('Users:', JSON.stringify(users, null, 2));
  console.log('Total users:', await prisma.user.count());
}

main().then(() => prisma.$disconnect());
