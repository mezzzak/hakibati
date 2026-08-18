import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const fakeIds = [
  'cahier-192-eco', 'cahier-120-eco', 'cahier-48-eco', 'cahier-32-eco',
  'cahier-tp-eco', 'cahier-musique-32-eco',
  'stylo-bleu-eco', 'stylo-vert-eco', 'crayon-hb-eco', 'crayon-b2-eco',
  'crayons-couleurs-eco', 'colle-blanche-eco', 'chemise-double-eco',
  'papier-millimetre-eco', 'papier-transparent-eco', 'calculatrice-simple-eco',
  'papier-dessin-eco', 'feutres-eco', 'aquarelle-eco', 'pinceaux-eco',
  'couvertures-plastique-eco', 'couvertures-livres-eco', 'etiquettes-eco',
  'sac-a-dos-eco',
];

async function main() {
  // Delete pack items referencing fake products first
  const deletedPackItems = await p.packItem.deleteMany({
    where: { supplyItemId: { in: fakeIds } },
  });
  console.log(`Deleted ${deletedPackItems.count} pack items using fake products`);

  // Delete cart items referencing fake products
  const deletedCartItems = await p.cartItem.deleteMany({
    where: { supplyItemId: { in: fakeIds } },
  });
  console.log(`Deleted ${deletedCartItems.count} cart items using fake products`);

  // Delete order items referencing fake products
  const deletedOrderItems = await p.orderItem.deleteMany({
    where: { supplyItemId: { in: fakeIds } },
  });
  console.log(`Deleted ${deletedOrderItems.count} order items using fake products`);

  // Delete the fake supply items
  const deletedItems = await p.supplyItem.deleteMany({
    where: { id: { in: fakeIds } },
  });
  console.log(`Deleted ${deletedItems.count} fake supply items`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => p.$disconnect());
