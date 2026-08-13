const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { phone: '0555000000' },
    data: {
      password: '$2b$12$6xXVcpXWfoWMm9dRxvdNiOP6Rr/1JI5oPwFqDsIis5jFncPr.rMle',
    },
  });
  console.log('Admin password reset to: admin123');
}

main().then(() => prisma.$disconnect());
