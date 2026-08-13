const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 1,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });
  
  if (orders.length === 0) {
    console.log('No orders found');
    return;
  }
  
  const order = orders[0];
  console.log('Order:', order.orderNumber);
  console.log('Items count:', order.items.length);
  order.items.forEach((item, i) => {
    console.log(`Item ${i + 1}:`, {
      name: item.itemName,
      customDescription: item.customDescription,
      hasDescription: !!item.customDescription,
    });
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
