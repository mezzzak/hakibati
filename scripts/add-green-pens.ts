import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const greenPens = [
    { id: 'pen-uniball-green',    brand: 'UNIBALL',        price: 30 },
    { id: 'pen-pentel-green',     brand: 'Pentel',         price: 30 },
    { id: 'pen-faber-green',      brand: 'Faber-Castell',  price: 35 },
    { id: 'pen-maped-green',      brand: 'Maped',          price: 30 },
    { id: 'pen-staedtler-green',  brand: 'Staedtler',      price: 30 },
    { id: 'pen-pilot-green',      brand: 'Pilot',          price: 35 },
    { id: 'pen-bic-green',        brand: 'Bic',            price: 30 },
  ];

  for (const pen of greenPens) {
    await prisma.supplyItem.upsert({
      where: { id: pen.id },
      update: {},
      create: {
        id: pen.id,
        nameAr: 'قلم حبر أخضر',
        nameFr: 'Stylo bille vert',
        descriptionAr: `قلم حبر جاف ${pen.brand}، أخضر، رأس متوسط`,
        descriptionFr: `Stylo bille ${pen.brand}, vert, pointe moyenne`,
        category: 'stylos',
        imageUrl: '/supplies/stylo-vert.jpg',
        unitPriceDZD: pen.price,
        stockQuantity: 500,
        brand: pen.brand,
      },
    });
    console.log(`✅ Added ${pen.brand} green pen @ ${pen.price} DA`);
  }

  console.log('\n🎉 Green pens added successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
