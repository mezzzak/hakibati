import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { phone: '0555000000' },
  });
  console.log('User found:', !!user);
  if (user) {
    console.log('Role:', user.role);
    console.log('Name:', user.fullName);
    console.log('Phone:', user.phone);
    console.log('Has password:', !!user.password);
  } else {
    console.log('No user with phone 0555000000');
  }
  await prisma.$disconnect();
}

main();
