import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.update({
    where: { phone: '0555000000' },
    data: {
      role: 'MASTER_ADMIN',
      password,
      fullName: 'Master Admin Hakibati',
    },
  });

  console.log('✅ Master Admin reset:');
  console.log('   Phone:', admin.phone);
  console.log('   Role:', admin.role);
  console.log('   Password: admin123');
  console.log('   Login with: 0555000000 / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
