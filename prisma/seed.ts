import { PrismaClient, GradeLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Hakibati database...');

  // ─────────────────────────────────────────────
  // 1. Supply Items (Fournitures)
  // ─────────────────────────────────────────────
  const cahier64 = await prisma.supplyItem.upsert({
    where: { id: 'cahier-seyes-64' },
    update: {},
    create: {
      id: 'cahier-seyes-64',
      nameAr: 'دفتر سَيِّه 64 صفحة',
      nameFr: 'Cahier Seyès 64 pages',
      descriptionAr: 'دفتر تخطيط سَيِّه 64 صفحة، غلاف بلاستيكي متين، ورق أبيض عالي الجودة',
      descriptionFr: 'Cahier à grands carreaux Seyès 64 pages, couverture plastique robuste',
      category: 'cahiers',
      imageUrl: '/supplies/cahier-seyes-64.jpg',
      unitPriceDZD: 65,
      stockQuantity: 500,
    },
  });

  const cahier96 = await prisma.supplyItem.upsert({
    where: { id: 'cahier-seyes-96' },
    update: {},
    create: {
      id: 'cahier-seyes-96',
      nameAr: 'دفتر سَيِّه 96 صفحة',
      nameFr: 'Cahier Seyès 96 pages',
      descriptionAr: 'دفتر تخطيط سَيِّه 96 صفحة للتلاميذ، غلاف كرتوني مقوى',
      descriptionFr: 'Cahier Seyès 96 pages, couverture cartonnée renforcée',
      category: 'cahiers',
      imageUrl: '/supplies/cahier-seyes-96.jpg',
      unitPriceDZD: 85,
      stockQuantity: 500,
    },
  });

  const cahier288 = await prisma.supplyItem.upsert({
    where: { id: 'cahier-seyes-288' },
    update: {},
    create: {
      id: 'cahier-seyes-288',
      nameAr: 'دفتر سَيِّه 288 صفحة',
      nameFr: 'Cahier Seyès 288 pages',
      descriptionAr: 'دفتر سَيِّه 288 صفحة، مثالي للثانوي، غلاف جلدي أنيق',
      descriptionFr: 'Cahier Seyès 288 pages, idéal pour le lycée, couverture cuir synthétique',
      category: 'cahiers',
      imageUrl: '/supplies/cahier-seyes-288.jpg',
      unitPriceDZD: 180,
      stockQuantity: 300,
    },
  });

  const bicBleu = await prisma.supplyItem.upsert({
    where: { id: 'stylo-bic-bleu' },
    update: {},
    create: {
      id: 'stylo-bic-bleu',
      nameAr: 'قلم بيك أزرق',
      nameFr: 'Stylo Bic Bleu',
      descriptionAr: 'قلم حبر جاف بيك كلاسيكي، أزرق، رأس متوسط، حزمة من 4 أقلام',
      descriptionFr: 'Stylo Bic classique à bille, bleu, pointe moyenne, lot de 4',
      category: 'stylos',
      imageUrl: '/supplies/bic-bleu.jpg',
      unitPriceDZD: 120,
      stockQuantity: 1000,
    },
  });

  const bicNoir = await prisma.supplyItem.upsert({
    where: { id: 'stylo-bic-noir' },
    update: {},
    create: {
      id: 'stylo-bic-noir',
      nameAr: 'قلم بيك أسود',
      nameFr: 'Stylo Bic Noir',
      descriptionAr: 'قلم حبر جاف بيك كلاسيكي، أسود، رأس متوسط',
      descriptionFr: 'Stylo Bic classique à bille, noir, pointe moyenne',
      category: 'stylos',
      imageUrl: '/supplies/bic-noir.jpg',
      unitPriceDZD: 120,
      stockQuantity: 1000,
    },
  });

  const bicRouge = await prisma.supplyItem.upsert({
    where: { id: 'stylo-bic-rouge' },
    update: {},
    create: {
      id: 'stylo-bic-rouge',
      nameAr: 'قلم بيك أحمر',
      nameFr: 'Stylo Bic Rouge',
      descriptionAr: 'قلم حبر جاف بيك، أحمر للتصحيح والتعليق',
      descriptionFr: 'Stylo Bic rouge pour correction et annotation',
      category: 'stylos',
      imageUrl: '/supplies/bic-rouge.jpg',
      unitPriceDZD: 120,
      stockQuantity: 800,
    },
  });

  const mapedGeo = await prisma.supplyItem.upsert({
    where: { id: 'trousse-geometrie-maped' },
    update: {},
    create: {
      id: 'trousse-geometrie-maped',
      nameAr: 'مجموعة هندسة مابيد 8 قطع',
      nameFr: 'Trousse de géométrie Maped 8 pièces',
      descriptionAr: 'مجموعة هندسة كاملة مابيد: مسطرة، منقلة، مثلثان، بركار، مغرضة، ممحاة، قلم رصاص',
      descriptionFr: 'Trousse complète Maped : règle, rapporteur, équerres, compas, taille-crayon, gomme, crayon',
      category: 'geometrie',
      imageUrl: '/supplies/maped-geo.jpg',
      unitPriceDZD: 450,
      stockQuantity: 400,
    },
  });

  const cansonA4 = await prisma.supplyItem.upsert({
    where: { id: 'canson-croquis-a4' },
    update: {},
    create: {
      id: 'canson-croquis-a4',
      nameAr: 'دفتر رسم كانسون A4',
      nameFr: 'Bloc de croquis Canson A4',
      descriptionAr: 'دفتر رسم كانسون A4، 100 صفحة، ورق 90غ، مناسب للفنون التشكيلية',
      descriptionFr: 'Bloc de croquis Canson A4, 100 feuilles, papier 90g, idéal pour les arts plastiques',
      category: 'arts',
      imageUrl: '/supplies/canson-a4.jpg',
      unitPriceDZD: 350,
      stockQuantity: 250,
    },
  });

  const cartablePrimaire = await prisma.supplyItem.upsert({
    where: { id: 'cartable-primaire' },
    update: {},
    create: {
      id: 'cartable-primaire',
      nameAr: 'حقيبة ظهر ابتدائي',
      nameFr: 'Cartable Primaire',
      descriptionAr: 'حقيبة ظهر مدرسية للابتدائي، مقاومة للماء، عجلات اختيارية، ألوان متعددة',
      descriptionFr: 'Cartable à roulettes pour le primaire, imperméable, couleurs variées',
      category: 'cartables',
      imageUrl: '/supplies/cartable-primaire.jpg',
      unitPriceDZD: 2800,
      stockQuantity: 200,
    },
  });

  const cartableCollege = await prisma.supplyItem.upsert({
    where: { id: 'cartable-college' },
    update: {},
    create: {
      id: 'cartable-college',
      nameAr: 'حقيبة ظهر متوسط وثانوي',
      nameFr: 'Sac à dos Collège / Lycée',
      descriptionAr: 'حقيبة ظهر عصرية للمتوسط والثانوي، عدة جيوب، دعامات ظهر مريحة',
      descriptionFr: 'Sac à dos moderne pour le collège et le lycée, multiples poches, bretelles ergonomiques',
      category: 'cartables',
      imageUrl: '/supplies/cartable-college.jpg',
      unitPriceDZD: 3500,
      stockQuantity: 200,
    },
  });

  const gommeMaped = await prisma.supplyItem.upsert({
    where: { id: 'gomme-maped' },
    update: {},
    create: {
      id: 'gomme-maped',
      nameAr: 'ممحاة مابيد أنيقة',
      nameFr: 'Gomme Maped Essentials',
      descriptionAr: 'ممحاة مابيد ناعمة لا تترك أثراً، مناسبة للأقلام الرصاص',
      descriptionFr: 'Gomme Maped douce sans trace, adaptée aux crayons à papier',
      category: 'accessoires',
      imageUrl: '/supplies/gomme-maped.jpg',
      unitPriceDZD: 45,
      stockQuantity: 1500,
    },
  });

  const tailleCrayon = await prisma.supplyItem.upsert({
    where: { id: 'taille-crayon-maped' },
    update: {},
    create: {
      id: 'taille-crayon-maped',
      nameAr: 'مبراة مابيد مزدوجة',
      nameFr: 'Taille-crayon Maped double',
      descriptionAr: 'مبراة مابيد بفتحتين (عادية وكبيرة)، حاوية لجمع النفايات',
      descriptionFr: 'Taille-crayon Maped 2 trous avec réservoir',
      category: 'accessoires',
      imageUrl: '/supplies/taille-crayon.jpg',
      unitPriceDZD: 55,
      stockQuantity: 1200,
    },
  });

  const cahierPetitsCarreaux = await prisma.supplyItem.upsert({
    where: { id: 'cahier-petits-carreaux-96' },
    update: {},
    create: {
      id: 'cahier-petits-carreaux-96',
      nameAr: 'دفتر صغير القماش 96 صفحة',
      nameFr: 'Cahier petits carreaux 96 pages',
      descriptionAr: 'دفتر تخطيط صغير القماش 5×5، 96 صفحة، غلاف بلاستيكي',
      descriptionFr: 'Cahier petits carreaux 5×5, 96 pages, couverture plastique',
      category: 'cahiers',
      imageUrl: '/supplies/cahier-petits-carreaux.jpg',
      unitPriceDZD: 85,
      stockQuantity: 500,
    },
  });

  const regle30 = await prisma.supplyItem.upsert({
    where: { id: 'regle-30cm-plastique' },
    update: {},
    create: {
      id: 'regle-30cm-plastique',
      nameAr: 'مسطرة بلاستيكية 30 سم',
      nameFr: 'Règle plastique 30 cm',
      descriptionAr: 'مسطرة شفافة 30 سم، مقاومة للكسر',
      descriptionFr: 'Règle transparente 30 cm, incassable',
      category: 'geometrie',
      imageUrl: '/supplies/regle-30cm.jpg',
      unitPriceDZD: 35,
      stockQuantity: 1000,
    },
  });

  const calculatriceCasio = await prisma.supplyItem.upsert({
    where: { id: 'calculatrice-casio-scientifique' },
    update: {},
    create: {
      id: 'calculatrice-casio-scientifique',
      nameAr: 'آلة حاسبة علمية كاسيو fx-991',
      nameFr: 'Calculatrice scientifique Casio fx-991',
      descriptionAr: 'آلة حاسبة علمية كاسيو fx-991ES PLUS، موافقة للبرامج المدرسية الجزائرية',
      descriptionFr: 'Calculatrice scientifique Casio fx-991ES PLUS, conforme aux programmes scolaires algériens',
      category: 'electronique',
      imageUrl: '/supplies/casio-fx991.jpg',
      unitPriceDZD: 3200,
      stockQuantity: 150,
    },
  });

  const equerre60 = await prisma.supplyItem.upsert({
    where: { id: 'equerre-60-degres' },
    update: {},
    create: {
      id: 'equerre-60-degres',
      nameAr: 'مثلث 60 درجة',
      nameFr: 'Équerre 60°',
      descriptionAr: 'مثلث هندسي 60 درجة، شفاف، 25 سم',
      descriptionFr: 'Équerre 60° transparente, 25 cm',
      category: 'geometrie',
      imageUrl: '/supplies/equerre-60.jpg',
      unitPriceDZD: 40,
      stockQuantity: 800,
    },
  });

  const equerre45 = await prisma.supplyItem.upsert({
    where: { id: 'equerre-45-degres' },
    update: {},
    create: {
      id: 'equerre-45-degres',
      nameAr: 'مثلث 45 درجة',
      nameFr: 'Équerre 45°',
      descriptionAr: 'مثلث هندسي 45 درجة، شفاف، 21 سم',
      descriptionFr: 'Équerre 45° transparente, 21 cm',
      category: 'geometrie',
      imageUrl: '/supplies/equerre-45.jpg',
      unitPriceDZD: 40,
      stockQuantity: 800,
    },
  });

  const rapporteur = await prisma.supplyItem.upsert({
    where: { id: 'rapporteur-180' },
    update: {},
    create: {
      id: 'rapporteur-180',
      nameAr: 'منقلة 180 درجة',
      nameFr: 'Rapporteur 180°',
      descriptionAr: 'منقلة شفافة 180 درجة، قطر 10 سم',
      descriptionFr: 'Rapporteur transparent 180°, diamètre 10 cm',
      category: 'geometrie',
      imageUrl: '/supplies/rapporteur.jpg',
      unitPriceDZD: 35,
      stockQuantity: 900,
    },
  });

  const compasMaped = await prisma.supplyItem.upsert({
    where: { id: 'compas-maped-metal' },
    update: {},
    create: {
      id: 'compas-maped-metal',
      nameAr: 'بركار مابيد معدني',
      nameFr: 'Compas Maped métal',
      descriptionAr: 'بركار معدني مابيد مع قلم رصاص وبديل',
      descriptionFr: 'Compas Maped en métal avec mine de crayon et rechange',
      category: 'geometrie',
      imageUrl: '/supplies/compas-maped.jpg',
      unitPriceDZD: 180,
      stockQuantity: 500,
    },
  });

  const crayonHb = await prisma.supplyItem.upsert({
    where: { id: 'crayon-hb-maped' },
    update: {},
    create: {
      id: 'crayon-hb-maped',
      nameAr: 'قلم رصاص HB مابيد (حزمة 12)',
      nameFr: 'Crayons HB Maped (lot de 12)',
      descriptionAr: 'أقلام رصاص HB مابيد، حزمة 12 قلم، خشب عالي الجودة',
      descriptionFr: 'Crayons HB Maped, lot de 12, bois de qualité supérieure',
      category: 'stylos',
      imageUrl: '/supplies/crayon-hb.jpg',
      unitPriceDZD: 150,
      stockQuantity: 1000,
    },
  });

  console.log(`✅ Created ${await prisma.supplyItem.count()} supply items`);

  // ─────────────────────────────────────────────
  // 2. Hakibati Packs — 12 premade packs
  // ─────────────────────────────────────────────

  const packDefinitions = [
    // Primaire: AP1–AP5
    {
      id: 'pack-ap1',
      nameAr: 'حقيبة السنة الأولى ابتدائي (1AP)',
      nameFr: 'Pack 1ère Année Primaire (1AP)',
      descriptionAr: 'حقيبة خفيفة ومثالية لتلميذ السنة الأولى ابتدائي: دفاتر 64 صفحة، أقلام ألوان، حقيبة ظهر صغيرة',
      descriptionFr: 'Kit léger et idéal pour élève de 1ère année primaire : cahiers 64 pages, crayons de couleur, petit cartable',
      gradeLevel: GradeLevel.AP1,
      basePriceDZD: 4200,
      discountPercent: 8,
      items: [
        { supplyItemId: cahier64.id, quantity: 8 },
        { supplyItemId: bicBleu.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartablePrimaire.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-ap2',
      nameAr: 'حقيبة السنة الثانية ابتدائي (2AP)',
      nameFr: 'Pack 2ème Année Primaire (2AP)',
      descriptionAr: 'حقيبة متوازنة لتلميذ السنة الثانية ابتدائي: دفاتر متنوعة، أدوات كتابة، حقيبة ظهر',
      descriptionFr: 'Kit équilibré pour élève de 2ème année primaire : cahiers variés, fournitures d\'écriture, cartable',
      gradeLevel: GradeLevel.AP2,
      basePriceDZD: 4500,
      discountPercent: 10,
      items: [
        { supplyItemId: cahier64.id, quantity: 6 },
        { supplyItemId: cahier96.id, quantity: 2 },
        { supplyItemId: bicBleu.id, quantity: 2 },
        { supplyItemId: bicRouge.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartablePrimaire.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-ap3',
      nameAr: 'حقيبة السنة الثالثة ابتدائي (3AP)',
      nameFr: 'Pack 3ème Année Primaire (3AP)',
      descriptionAr: 'حقيبة كاملة لتلميذ السنة الثالثة ابتدائي: دفاتر 64 و96 صفحة، أدوات هندسة بسيطة',
      descriptionFr: 'Kit complet pour élève de 3ème année primaire : cahiers 64 et 96 pages, géométrie de base',
      gradeLevel: GradeLevel.AP3,
      basePriceDZD: 4800,
      discountPercent: 10,
      items: [
        { supplyItemId: cahier64.id, quantity: 4 },
        { supplyItemId: cahier96.id, quantity: 4 },
        { supplyItemId: bicBleu.id, quantity: 2 },
        { supplyItemId: bicRouge.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartablePrimaire.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-ap4',
      nameAr: 'حقيبة السنة الرابعة ابتدائي (4AP)',
      nameFr: 'Pack 4ème Année Primaire (4AP)',
      descriptionAr: 'حقيبة متكاملة لتلميذ السنة الرابعة ابتدائي: دفاتر متنوعة، أدوات هندسة، حقيبة ظهر متينة',
      descriptionFr: 'Kit complet pour élève de 4ème année primaire : cahiers variés, géométrie, cartable robuste',
      gradeLevel: GradeLevel.AP4,
      basePriceDZD: 5100,
      discountPercent: 12,
      items: [
        { supplyItemId: cahier64.id, quantity: 2 },
        { supplyItemId: cahier96.id, quantity: 6 },
        { supplyItemId: bicBleu.id, quantity: 2 },
        { supplyItemId: bicRouge.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartablePrimaire.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-ap5',
      nameAr: 'حقيبة السنة الخامسة ابتدائي (5AP)',
      nameFr: 'Pack 5ème Année Primaire (5AP)',
      descriptionAr: 'حقيبة متقدمة لتلميذ السنة الخامسة ابتدائي: دفاتر سميكة، أدوات كتابة متنوعة، هندسة كاملة',
      descriptionFr: 'Kit avancé pour élève de 5ème année primaire : gros cahiers, stylos variés, géométrie complète',
      gradeLevel: GradeLevel.AP5,
      basePriceDZD: 5500,
      discountPercent: 12,
      items: [
        { supplyItemId: cahier64.id, quantity: 2 },
        { supplyItemId: cahier96.id, quantity: 6 },
        { supplyItemId: bicBleu.id, quantity: 2 },
        { supplyItemId: bicNoir.id, quantity: 1 },
        { supplyItemId: bicRouge.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartablePrimaire.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 1 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
      ],
    },
    // CEM: AM1–AM4
    {
      id: 'pack-am1',
      nameAr: 'حقيبة السنة الأولى متوسط (1AM)',
      nameFr: 'Pack 1ère Année CEM (1AM)',
      descriptionAr: 'حقيبة مثالية لتلميذ السنة الأولى متوسط: دفاتر 96 صفحة، أدوات هندسة، حقيبة ظهر',
      descriptionFr: 'Kit idéal pour élève de 1ère année CEM : cahiers 96 pages, géométrie, sac à dos',
      gradeLevel: GradeLevel.AM1,
      basePriceDZD: 6200,
      discountPercent: 10,
      items: [
        { supplyItemId: cahier96.id, quantity: 6 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 2 },
        { supplyItemId: bicBleu.id, quantity: 2 },
        { supplyItemId: bicNoir.id, quantity: 1 },
        { supplyItemId: bicRouge.id, quantity: 1 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-am2',
      nameAr: 'حقيبة السنة الثانية متوسط (2AM)',
      nameFr: 'Pack 2ème Année CEM (2AM)',
      descriptionAr: 'حقيبة متوازنة لتلميذ السنة الثانية متوسط: دفاتر متنوعة، هندسة كاملة',
      descriptionFr: 'Kit équilibré pour élève de 2ème année CEM : cahiers variés, géométrie complète',
      gradeLevel: GradeLevel.AM2,
      basePriceDZD: 6500,
      discountPercent: 10,
      items: [
        { supplyItemId: cahier96.id, quantity: 6 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 4 },
        { supplyItemId: bicBleu.id, quantity: 2 },
        { supplyItemId: bicNoir.id, quantity: 1 },
        { supplyItemId: bicRouge.id, quantity: 1 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 2 },
        { supplyItemId: tailleCrayon.id, quantity: 1 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-am3',
      nameAr: 'حقيبة السنة الثالثة متوسط (3AM)',
      nameFr: 'Pack 3ème Année CEM (3AM)',
      descriptionAr: 'حقيبة متكاملة لتلميذ السنة الثالثة متوسط: دفاتر متنوعة، أدوات هندسة، آلة حاسبة',
      descriptionFr: 'Kit complet pour élève de 3ème année CEM : cahiers variés, géométrie, calculatrice',
      gradeLevel: GradeLevel.AM3,
      basePriceDZD: 7200,
      discountPercent: 12,
      items: [
        { supplyItemId: cahier96.id, quantity: 6 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 4 },
        { supplyItemId: cahier288.id, quantity: 2 },
        { supplyItemId: bicBleu.id, quantity: 3 },
        { supplyItemId: bicNoir.id, quantity: 2 },
        { supplyItemId: bicRouge.id, quantity: 2 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: calculatriceCasio.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 3 },
        { supplyItemId: tailleCrayon.id, quantity: 2 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-am4',
      nameAr: 'حقيبة السنة الرابعة متوسط (4AM)',
      nameFr: 'Pack 4ème Année CEM (4AM)',
      descriptionAr: 'حقيبة متقدمة لتلميذ السنة الرابعة متوسط: دفاتر سميكة، هندسة كاملة، آلة حاسبة علمية',
      descriptionFr: 'Kit avancé pour élève de 4ème année CEM : gros cahiers, géométrie complète, calculatrice scientifique',
      gradeLevel: GradeLevel.AM4,
      basePriceDZD: 7500,
      discountPercent: 12,
      items: [
        { supplyItemId: cahier96.id, quantity: 4 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 4 },
        { supplyItemId: cahier288.id, quantity: 4 },
        { supplyItemId: bicBleu.id, quantity: 3 },
        { supplyItemId: bicNoir.id, quantity: 2 },
        { supplyItemId: bicRouge.id, quantity: 2 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: calculatriceCasio.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 3 },
        { supplyItemId: tailleCrayon.id, quantity: 2 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
    // Lycée: AS1–AS3
    {
      id: 'pack-as1',
      nameAr: 'حقيبة السنة الأولى ثانوي (1AS)',
      nameFr: 'Pack 1ère Année Lycée (1AS)',
      descriptionAr: 'حقيبة متخصصة لتلميذ السنة الأولى ثانوي: دفاتر سميكة، آلة حاسبة علمية، هندسة كاملة',
      descriptionFr: 'Kit spécialisé pour élève de 1ère année lycée : gros cahiers, calculatrice scientifique, géométrie complète',
      gradeLevel: GradeLevel.AS1,
      basePriceDZD: 8800,
      discountPercent: 12,
      items: [
        { supplyItemId: cahier288.id, quantity: 4 },
        { supplyItemId: cahier96.id, quantity: 4 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 4 },
        { supplyItemId: bicBleu.id, quantity: 3 },
        { supplyItemId: bicNoir.id, quantity: 2 },
        { supplyItemId: bicRouge.id, quantity: 2 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 2 },
        { supplyItemId: equerre60.id, quantity: 1 },
        { supplyItemId: equerre45.id, quantity: 1 },
        { supplyItemId: rapporteur.id, quantity: 1 },
        { supplyItemId: compasMaped.id, quantity: 1 },
        { supplyItemId: calculatriceCasio.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 3 },
        { supplyItemId: tailleCrayon.id, quantity: 2 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-as2',
      nameAr: 'حقيبة السنة الثانية ثانوي (2AS)',
      nameFr: 'Pack 2ème Année Lycée (2AS)',
      descriptionAr: 'حقيبة متقدمة لتلميذ السنة الثانية ثانوي: دفاتر سميكة، آلة حاسبة متطورة، هندسة احترافية',
      descriptionFr: 'Kit avancé pour élève de 2ème année lycée : gros cahiers, calculatrice avancée, géométrie professionnelle',
      gradeLevel: GradeLevel.AS2,
      basePriceDZD: 9200,
      discountPercent: 14,
      items: [
        { supplyItemId: cahier288.id, quantity: 6 },
        { supplyItemId: cahier96.id, quantity: 4 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 4 },
        { supplyItemId: bicBleu.id, quantity: 4 },
        { supplyItemId: bicNoir.id, quantity: 3 },
        { supplyItemId: bicRouge.id, quantity: 3 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 2 },
        { supplyItemId: equerre60.id, quantity: 1 },
        { supplyItemId: equerre45.id, quantity: 1 },
        { supplyItemId: rapporteur.id, quantity: 1 },
        { supplyItemId: compasMaped.id, quantity: 1 },
        { supplyItemId: calculatriceCasio.id, quantity: 1 },
        { supplyItemId: cansonA4.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 3 },
        { supplyItemId: tailleCrayon.id, quantity: 2 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
    {
      id: 'pack-as3',
      nameAr: 'حقيبة السنة الثالثة ثانوي (3AS)',
      nameFr: 'Pack 3ème Année Lycée (3AS)',
      descriptionAr: 'حقيبة نهائية متكاملة لطلاب البكالوريا: دفاتر سميكة، آلة حاسبة علمية، هندسة كاملة، دفتر رسم',
      descriptionFr: 'Kit final complet pour bacheliers : gros cahiers, calculatrice scientifique, géométrie complète, bloc de croquis',
      gradeLevel: GradeLevel.AS3,
      basePriceDZD: 9800,
      discountPercent: 15,
      items: [
        { supplyItemId: cahier288.id, quantity: 8 },
        { supplyItemId: cahier96.id, quantity: 4 },
        { supplyItemId: cahierPetitsCarreaux.id, quantity: 4 },
        { supplyItemId: bicBleu.id, quantity: 4 },
        { supplyItemId: bicNoir.id, quantity: 3 },
        { supplyItemId: bicRouge.id, quantity: 3 },
        { supplyItemId: mapedGeo.id, quantity: 1 },
        { supplyItemId: regle30.id, quantity: 2 },
        { supplyItemId: equerre60.id, quantity: 1 },
        { supplyItemId: equerre45.id, quantity: 1 },
        { supplyItemId: rapporteur.id, quantity: 1 },
        { supplyItemId: compasMaped.id, quantity: 1 },
        { supplyItemId: calculatriceCasio.id, quantity: 1 },
        { supplyItemId: cansonA4.id, quantity: 1 },
        { supplyItemId: gommeMaped.id, quantity: 3 },
        { supplyItemId: tailleCrayon.id, quantity: 2 },
        { supplyItemId: crayonHb.id, quantity: 1 },
        { supplyItemId: cartableCollege.id, quantity: 1 },
      ],
    },
  ];

  for (const def of packDefinitions) {
    await prisma.hakibatiPack.upsert({
      where: { id: def.id },
      update: {},
      create: {
        id: def.id,
        nameAr: def.nameAr,
        nameFr: def.nameFr,
        descriptionAr: def.descriptionAr,
        descriptionFr: def.descriptionFr,
        gradeLevel: def.gradeLevel,
        imageUrl: `/packs/${def.id}.jpg`,
        basePriceDZD: def.basePriceDZD,
        discountPercent: def.discountPercent,
        isActive: true,
        items: {
          create: def.items,
        },
      },
    });
    console.log(`  ✅ Created pack: ${def.nameAr}`);
  }

  console.log(`\n✅ Created ${await prisma.hakibatiPack.count()} Hakibati packs`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
