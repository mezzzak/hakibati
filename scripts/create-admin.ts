import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { phone: '0555000000' },
    update: { role: 'MASTER_ADMIN', password },
    create: {
      phone: '0555000000',
      fullName: 'Master Admin Hakibati',
      password,
      wilaya: 'الجزائر',
      role: 'MASTER_ADMIN',
    },
  });

  console.log('✅ Master Admin user created/updated:', admin.phone);
  console.log('   Login: 0555000000 / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
