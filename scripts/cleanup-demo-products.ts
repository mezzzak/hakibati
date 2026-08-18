import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const demoIds = [
  'cahier-seyes-64',
  'cahier-seyes-96',
  'cahier-seyes-288',
  'stylo-bic-bleu',
  'stylo-bic-noir',
  'stylo-bic-rouge',
  'trousse-geometrie-maped',
  'canson-croquis-a4',
  'cartable-primaire',
  'cartable-college',
  'gomme-maped',
  'taille-crayon-maped',
  'cahier-petits-carreaux-96',
  'regle-30cm-plastique',
  'calculatrice-casio-scientifique',
  'equerre-60-degres',
  'equerre-45-degres',
  'rapporteur-180',
  'compas-maped-metal',
  'crayon-hb-maped',
];

const oldPackIds = [
  'pack-ap1', 'pack-ap2', 'pack-ap3', 'pack-ap4', 'pack-ap5',
  'pack-as1', 'pack-as2', 'pack-as3',
];

async function main() {
  // Delete pack items for old packs
  const deletedPackItems = await p.packItem.deleteMany({
    where: {
      OR: [
        { supplyItemId: { in: demoIds } },
        { hakibatiPackId: { in: oldPackIds } },
      ],
    },
  });
  console.log(`Deleted ${deletedPackItems.count} pack items`);

  // Delete cart items referencing demo products
  const deletedCartItems = await p.cartItem.deleteMany({
    where: { supplyItemId: { in: demoIds } },
  });
  console.log(`Deleted ${deletedCartItems.count} cart items`);

  // Delete order items referencing demo products
  const deletedOrderItems = await p.orderItem.deleteMany({
    where: { supplyItemId: { in: demoIds } },
  });
  console.log(`Deleted ${deletedOrderItems.count} order items`);

  // Delete old packs
  const deletedPacks = await p.hakibatiPack.deleteMany({
    where: { id: { in: oldPackIds } },
  });
  console.log(`Deleted ${deletedPacks.count} old packs`);

  // Delete demo supply items
  const deletedItems = await p.supplyItem.deleteMany({
    where: { id: { in: demoIds } },
  });
  console.log(`Deleted ${deletedItems.count} demo supply items`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => p.$disconnect());
