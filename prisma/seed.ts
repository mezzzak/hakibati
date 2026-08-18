import { PrismaClient, GradeLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Hakibati database...');

  // ─────────────────────────────────────────────
  // 1. Supply Items — only real inventory items exist in DB
  // ─────────────────────────────────────────────
  console.log(`✅ Using ${await prisma.supplyItem.count()} existing supply items`);

  // ─────────────────────────────────────────────
  // 2. Hakibati Packs — 12 premade packs
  // ─────────────────────────────────────────────

  const packDefinitions = [
    // Primaire: AP1–AP5 (Ministry list 2025/2026 — cheapest REAL products from inventory)
    {
      id: 'pack-ap1',
      nameAr: 'حقيبة السنة الأولى ابتدائي (1AP)',
      nameFr: 'Pack 1ère Année Primaire (1AP)',
      descriptionAr: 'حقيبة السنة الأولى ابتدائي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 1ère année primaire selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AP1,
      basePriceDZD: 5060,
      discountPercent: 8,
      items: [
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 2 }, // كراس 64 ص (Foroni)
        { supplyItemId: 'cmsxvvxri001x5lwfcxwpmomn', quantity: 1 }, // كراس رسم (Bic)
        { supplyItemId: 'cmsxvypt7007j5lwfvml4q4bd', quantity: 3 }, // أغلفة بلاستيكية للكراريس (Elba)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 1 }, // أغلفة بلاستيكية للكتب (Elba)
        { supplyItemId: 'cmsxvyw56007w5lwfxbyfn7h8', quantity: 1 }, // سبورة صغيرة + ممسحة (Bic)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 1 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwqyf003j5lwfpoi6j32s', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvye4l006v5lwf64x2bv1t', quantity: 1 }, // أوراق ملونة (Bic)
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
      ],
    },
    {
      id: 'pack-ap2',
      nameAr: 'حقيبة السنة الثانية ابتدائي (2AP)',
      nameFr: 'Pack 2ème Année Primaire (2AP)',
      descriptionAr: 'حقيبة السنة الثانية ابتدائي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 2ème année primaire selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AP2,
      basePriceDZD: 5060,
      discountPercent: 8,
      items: [
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 2 }, // كراس 64 ص (Foroni)
        { supplyItemId: 'cmsxvvxri001x5lwfcxwpmomn', quantity: 1 }, // كراس رسم (Bic)
        { supplyItemId: 'cmsxvypt7007j5lwfvml4q4bd', quantity: 3 }, // أغلفة بلاستيكية للكراريس (Elba)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 1 }, // أغلفة بلاستيكية للكتب (Elba)
        { supplyItemId: 'cmsxvyw56007w5lwfxbyfn7h8', quantity: 1 }, // سبورة صغيرة + ممسحة (Bic)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 1 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwqyf003j5lwfpoi6j32s', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvye4l006v5lwf64x2bv1t', quantity: 1 }, // أوراق ملونة (Bic)
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
      ],
    },
    {
      id: 'pack-ap3',
      nameAr: 'حقيبة السنة الثالثة ابتدائي (3AP)',
      nameFr: 'Pack 3ème Année Primaire (3AP)',
      descriptionAr: 'حقيبة السنة الثالثة ابتدائي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 3ème année primaire selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AP3,
      basePriceDZD: 5920,
      discountPercent: 10,
      items: [
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 8 }, // كراس 64 ص (Foroni)
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 3 }, // كراس 32 ص أعمال تطبيقية (Bic)
        { supplyItemId: 'cmsxvypt7007j5lwfvml4q4bd', quantity: 11 }, // أغلفة بلاستيكية للكراريس (Elba)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 1 }, // أغلفة بلاستيكية للكتب (Elba)
        { supplyItemId: 'cmsxvyw56007w5lwfxbyfn7h8', quantity: 1 }, // سبورة صغيرة + ممسحة (Bic)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 1 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwqyf003j5lwfpoi6j32s', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // كوس / مثلث (Bic)
        { supplyItemId: 'cmsxvye4l006v5lwf64x2bv1t', quantity: 1 }, // أوراق ملونة (Bic)
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
      ],
    },
    {
      id: 'pack-ap4',
      nameAr: 'حقيبة السنة الرابعة ابتدائي (4AP)',
      nameFr: 'Pack 4ème Année Primaire (4AP)',
      descriptionAr: 'حقيبة السنة الرابعة ابتدائي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 4ème année primaire selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AP4,
      basePriceDZD: 6335,
      discountPercent: 12,
      items: [
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 10 }, // كراس 64 ص (Foroni)
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 3 }, // كراس 32 ص أعمال تطبيقية (Bic)
        { supplyItemId: 'cmsxvypt7007j5lwfvml4q4bd', quantity: 13 }, // أغلفة بلاستيكية للكراريس (Elba)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 1 }, // أغلفة بلاستيكية للكتب (Elba)
        { supplyItemId: 'cmsxvyw56007w5lwfxbyfn7h8', quantity: 1 }, // سبورة صغيرة + ممسحة (Bic)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 1 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwqyf003j5lwfpoi6j32s', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // كوس / مثلث (Bic)
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 }, // منقلة (Bic)
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 }, // بركار (Bic)
        { supplyItemId: 'cmsxvye4l006v5lwf64x2bv1t', quantity: 1 }, // أوراق ملونة (Bic)
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
      ],
    },
    {
      id: 'pack-ap5',
      nameAr: 'حقيبة السنة الخامسة ابتدائي (5AP)',
      nameFr: 'Pack 5ème Année Primaire (5AP)',
      descriptionAr: 'حقيبة السنة الخامسة ابتدائي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 5ème année primaire selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AP5,
      basePriceDZD: 6335,
      discountPercent: 12,
      items: [
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 10 }, // كراس 64 ص (Foroni)
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 3 }, // كراس 32 ص أعمال تطبيقية (Bic)
        { supplyItemId: 'cmsxvypt7007j5lwfvml4q4bd', quantity: 13 }, // أغلفة بلاستيكية للكراريس (Elba)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 1 }, // أغلفة بلاستيكية للكتب (Elba)
        { supplyItemId: 'cmsxvyw56007w5lwfxbyfn7h8', quantity: 1 }, // سبورة صغيرة + ممسحة (Bic)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 1 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwqyf003j5lwfpoi6j32s', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // كوس / مثلث (Bic)
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 }, // منقلة (Bic)
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 }, // بركار (Bic)
        { supplyItemId: 'cmsxvye4l006v5lwf64x2bv1t', quantity: 1 }, // أوراق ملونة (Bic)
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
      ],
    },
    // CEM: AM1–AM4 (Ministry list 2025/2026 — cheapest REAL products from inventory)
    {
      id: 'pack-am1',
      nameAr: 'حقيبة السنة الأولى متوسط (1AM)',
      nameFr: 'Pack 1ère Année CEM (1AM)',
      descriptionAr: 'حقيبة السنة الأولى متوسط وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 1ère année CEM selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AM1,
      basePriceDZD: 7210,
      discountPercent: 5,
      items: [
        // Notebooks (قائمة الكراريس)
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 2 }, // كراس 192 ص (Bic)
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 3 }, // كراس 120 ص (Bic)
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 1 }, // كراس 96 ص (Bic)
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 4 }, // كراس 64 ص (Foroni)
        { supplyItemId: 'cmsxvv66l000d5lwfuv5ge5c4', quantity: 2 }, // كراس 48 ص (Bic)
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 2 }, // كراس 32 ص (Bic)
        { supplyItemId: 'cmsxvwnjp003c5lwf3buabbj1', quantity: 1 }, // كراس موسيقى (Bic)
        { supplyItemId: 'cmsxvw9hk002l5lwf5ya9t2bg', quantity: 3 }, // كراس ح.ك صغير (Bic)
        // Shared tools (أدوات مشتركة)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 }, // قلم حبر أزرق (Bic) — green not in stock
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 }, // غراء (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // مثلث 60° (Bic)
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 }, // منقلة (Bic)
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 }, // بركار (Bic)
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 }, // حافظة أوراق شفافة (Bic)
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 }, // ورق ميليمتري (Bic)
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 }, // ورق شفاف (Bic)
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 }, // آلة حاسبة بسيطة (Bic)
        // Arts (خاص بالتربية التشكيلية)
        { supplyItemId: 'cmsxvy2bf00675lwfm8jbsbd6', quantity: 1 }, // أوراق رسم (Bic)
        { supplyItemId: 'cmsxvwrfu003k5lwf57rxib32', quantity: 1 }, // قلم رصاص B2 (Bic)
        { supplyItemId: 'cmsxvxain004n5lwfnswxkyn0', quantity: 1 }, // أقلام لباد (Bic)
        { supplyItemId: 'cmsxvy85m006j5lwf637kt51t', quantity: 1 }, // ألوان مائية (Bic)
        { supplyItemId: 'cmsxvyb6t006p5lwf3dgbqn3l', quantity: 1 }, // فرش رسم 02+03 (Bic)
        // Covers (تغليف — حسب الحاجة)
        { supplyItemId: 'cmsxvysqw007p5lwfzcuwg51j', quantity: 1 }, // غلاف بلاستيكي للكتب (Bic)
        { supplyItemId: 'cmsxvyu70007s5lwfur5h7rde', quantity: 1 }, // بطاقات لاصقة (Bic)
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
      ],
    },
    {
      id: 'pack-am2',
      nameAr: 'حقيبة السنة الثانية متوسط (2AM)',
      nameFr: 'Pack 2ème Année CEM (2AM)',
      descriptionAr: 'حقيبة السنة الثانية متوسط وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 2ème année CEM selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AM2,
      basePriceDZD: 7210,
      discountPercent: 5,
      items: [
        // Notebooks
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 2 },
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 3 },
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 1 },
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 4 },
        { supplyItemId: 'cmsxvv66l000d5lwfuv5ge5c4', quantity: 2 },
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 2 },
        { supplyItemId: 'cmsxvwnjp003c5lwf3buabbj1', quantity: 1 },
        { supplyItemId: 'cmsxvw9hk002l5lwf5ya9t2bg', quantity: 3 },
        // Shared tools
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 },
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 },
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 },
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 },
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 },
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 },
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 },
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 },
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 },
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 },
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 },
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 },
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 },
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 },
        // Arts
        { supplyItemId: 'cmsxvy2bf00675lwfm8jbsbd6', quantity: 1 },
        { supplyItemId: 'cmsxvwrfu003k5lwf57rxib32', quantity: 1 },
        { supplyItemId: 'cmsxvxain004n5lwfnswxkyn0', quantity: 1 },
        { supplyItemId: 'cmsxvy85m006j5lwf637kt51t', quantity: 1 },
        { supplyItemId: 'cmsxvyb6t006p5lwf3dgbqn3l', quantity: 1 },
        // Covers
        { supplyItemId: 'cmsxvysqw007p5lwfzcuwg51j', quantity: 1 },
        { supplyItemId: 'cmsxvyu70007s5lwfur5h7rde', quantity: 1 },
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 },
      ],
    },
    {
      id: 'pack-am3',
      nameAr: 'حقيبة السنة الثالثة متوسط (3AM)',
      nameFr: 'Pack 3ème Année CEM (3AM)',
      descriptionAr: 'حقيبة السنة الثالثة متوسط وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 3ème année CEM selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AM3,
      basePriceDZD: 7210,
      discountPercent: 5,
      items: [
        // Notebooks
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 2 },
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 3 },
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 1 },
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 4 },
        { supplyItemId: 'cmsxvv66l000d5lwfuv5ge5c4', quantity: 2 },
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 2 },
        { supplyItemId: 'cmsxvwnjp003c5lwf3buabbj1', quantity: 1 },
        { supplyItemId: 'cmsxvw9hk002l5lwf5ya9t2bg', quantity: 3 },
        // Shared tools
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 },
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 },
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 },
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 },
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 },
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 },
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 },
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 },
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 },
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 },
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 },
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 },
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 },
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 },
        // Arts
        { supplyItemId: 'cmsxvy2bf00675lwfm8jbsbd6', quantity: 1 },
        { supplyItemId: 'cmsxvwrfu003k5lwf57rxib32', quantity: 1 },
        { supplyItemId: 'cmsxvxain004n5lwfnswxkyn0', quantity: 1 },
        { supplyItemId: 'cmsxvy85m006j5lwf637kt51t', quantity: 1 },
        { supplyItemId: 'cmsxvyb6t006p5lwf3dgbqn3l', quantity: 1 },
        // Covers
        { supplyItemId: 'cmsxvysqw007p5lwfzcuwg51j', quantity: 1 },
        { supplyItemId: 'cmsxvyu70007s5lwfur5h7rde', quantity: 1 },
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 },
      ],
    },
    {
      id: 'pack-am4',
      nameAr: 'حقيبة السنة الرابعة متوسط (4AM)',
      nameFr: 'Pack 4ème Année CEM (4AM)',
      descriptionAr: 'حقيبة السنة الرابعة متوسط وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 4ème année CEM selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AM4,
      basePriceDZD: 7210,
      discountPercent: 5,
      items: [
        // Notebooks
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 2 },
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 3 },
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 1 },
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 4 },
        { supplyItemId: 'cmsxvv66l000d5lwfuv5ge5c4', quantity: 2 },
        { supplyItemId: 'cmsxvv39q00075lwf0i359few', quantity: 2 },
        { supplyItemId: 'cmsxvwnjp003c5lwf3buabbj1', quantity: 1 },
        { supplyItemId: 'cmsxvw9hk002l5lwf5ya9t2bg', quantity: 3 },
        // Shared tools
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 },
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 },
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 },
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 },
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 },
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 },
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 },
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 },
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 },
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 },
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 },
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 },
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 },
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 },
        // Arts
        { supplyItemId: 'cmsxvy2bf00675lwfm8jbsbd6', quantity: 1 },
        { supplyItemId: 'cmsxvwrfu003k5lwf57rxib32', quantity: 1 },
        { supplyItemId: 'cmsxvxain004n5lwfnswxkyn0', quantity: 1 },
        { supplyItemId: 'cmsxvy85m006j5lwf637kt51t', quantity: 1 },
        { supplyItemId: 'cmsxvyb6t006p5lwf3dgbqn3l', quantity: 1 },
        // Covers
        { supplyItemId: 'cmsxvysqw007p5lwfzcuwg51j', quantity: 1 },
        { supplyItemId: 'cmsxvyu70007s5lwfur5h7rde', quantity: 1 },
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 },
      ],
    },
    // Lycée: AS1–AS3 (Ministry list 2025/2026 — cheapest REAL products from inventory)
    {
      id: 'pack-as1',
      nameAr: 'حقيبة السنة الأولى ثانوي (1AS)',
      nameFr: 'Pack 1ère Année Lycée (1AS)',
      descriptionAr: 'حقيبة السنة الأولى ثانوي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 1ère année lycée selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AS1,
      basePriceDZD: 9200,
      discountPercent: 12,
      items: [
        // Notebooks (قائمة الكراريس)
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 2 }, // كراس 192 ص — الرياضيات + الفيزياء (Bic)
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 4 }, // كراس 120 ص — التطبيقات + عربية + فرنسية + إنجليزية (Bic)
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 4 }, // كراس 96 ص — تكنولوجيا + تربية إسلامية + تاريخ + أمازيغية (Bic)
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 1 }, // كراس 64 ص — تربية بدنية (Foroni)
        { supplyItemId: 'cmsxvvxri001x5lwfcxwpmomn', quantity: 1 }, // كراس رسم — التربية الفنية (Bic)
        // Shared tools (أدوات مشتركة)
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 }, // آلة حاسبة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'cmsxvx1ou00455lwfi5zw6vlw', quantity: 1 }, // قلم حبر أحمر (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 }, // غراء (Bic)
        { supplyItemId: 'cmsxvzkyw009a5lwfwor2wzad', quantity: 1 }, // شريط لاصق (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // كوس / مثلث (Bic)
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 }, // منقلة (Bic)
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 }, // بركار (Bic)
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 }, // حافظة أوراق شفافة (Bic)
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 }, // ورق ميليمتري (Bic)
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 }, // ورق شفاف (Bic)
        // Arts (التربية الفنية)
        { supplyItemId: 'cmsxvy2bf00675lwfm8jbsbd6', quantity: 1 }, // أوراق رسم (Bic)
        { supplyItemId: 'cmsxvy85m006j5lwf637kt51t', quantity: 1 }, // ألوان مائية (Bic)
        { supplyItemId: 'cmsxvyb6t006p5lwf3dgbqn3l', quantity: 1 }, // فرش رسم (Bic)
        { supplyItemId: 'cmsxvznvm009g5lwf12x8rvfu', quantity: 1 }, // مقص (Bic)
        // Covers (تغليف)
        { supplyItemId: 'cmsxvyqt3007l5lwf3uxi5mi9', quantity: 12 }, // أغلفة بلاستيكية للكراريس (Éxacompta)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 5 }, // أغلفة بلاستيكية للكتب (Elba)
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
      ],
    },
    {
      id: 'pack-as2',
      nameAr: 'حقيبة السنة الثانية ثانوي (2AS)',
      nameFr: 'Pack 2ème Année Lycée (2AS)',
      descriptionAr: 'حقيبة السنة الثانية ثانوي وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 2ème année lycée selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AS2,
      basePriceDZD: 9900,
      discountPercent: 14,
      items: [
        // Notebooks
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 2 }, // كراس 192 ص — الرياضيات + الفيزياء (Bic)
        { supplyItemId: 'cmsxvvqy4001j5lwfl1202075', quantity: 1 }, // كراس 288 ص — التخصص (آداب/فلسفة/تسيير) (Bic)
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 5 }, // كراس 120 ص — التطبيقات + عربية + فرنسية + إنجليزية + جغرافيا (Bic)
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 4 }, // كراس 96 ص — تكنولوجيا/SVT + تربية إسلامية + تاريخ + أمازيغية (Bic)
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 1 }, // كراس 64 ص — تربية بدنية (Foroni)
        { supplyItemId: 'cmsxvvxri001x5lwfcxwpmomn', quantity: 1 }, // كراس رسم — التربية الفنية (Bic)
        // Shared tools
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 }, // آلة حاسبة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'cmsxvx1ou00455lwfi5zw6vlw', quantity: 1 }, // قلم حبر أحمر (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 }, // غراء (Bic)
        { supplyItemId: 'cmsxvzkyw009a5lwfwor2wzad', quantity: 1 }, // شريط لاصق (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // كوس / مثلث (Bic)
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 }, // منقلة (Bic)
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 }, // بركار (Bic)
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 }, // حافظة أوراق شفافة (Bic)
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 }, // ورق ميليمتري (Bic)
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 }, // ورق شفاف (Bic)
        // Arts
        { supplyItemId: 'cmsxvy2bf00675lwfm8jbsbd6', quantity: 1 }, // أوراق رسم (Bic)
        { supplyItemId: 'cmsxvy85m006j5lwf637kt51t', quantity: 1 }, // ألوان مائية (Bic)
        { supplyItemId: 'cmsxvyb6t006p5lwf3dgbqn3l', quantity: 1 }, // فرش رسم (Bic)
        { supplyItemId: 'cmsxvznvm009g5lwf12x8rvfu', quantity: 1 }, // مقص (Bic)
        // Covers
        { supplyItemId: 'cmsxvyqt3007l5lwf3uxi5mi9', quantity: 14 }, // أغلفة بلاستيكية للكراريس (Éxacompta)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 5 }, // أغلفة بلاستيكية للكتب (Elba)
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
      ],
    },
    {
      id: 'pack-as3',
      nameAr: 'حقيبة السنة الثالثة ثانوي (3AS)',
      nameFr: 'Pack 3ème Année Lycée (3AS)',
      descriptionAr: 'حقيبة السنة الثالثة ثانوي (بكالوريا) وفق قائمة وزارة التربية الوطنية 2025/2026 — أرخص الماركات المتوفرة',
      descriptionFr: 'Kit 3ème année lycée (Bac) selon la liste du ministère 2025/2026 — marques les moins chères en stock',
      gradeLevel: GradeLevel.AS3,
      basePriceDZD: 9600,
      discountPercent: 15,
      items: [
        // Notebooks
        { supplyItemId: 'cmsxvvn1y001b5lwfsvhro8m8', quantity: 3 }, // كراس 192 ص — الرياضيات + الفيزياء + فلسفة/عربية علمي (Bic)
        { supplyItemId: 'cmsxvvqy4001j5lwfl1202075', quantity: 2 }, // كراس 288 ص — فلسفة/عربية شعبة أدب (Bic)
        { supplyItemId: 'cmsxvviw800135lwf8uilssrc', quantity: 4 }, // كراس 120 ص — التطبيقات + فرنسية + إنجليزية + جغرافيا (Bic)
        { supplyItemId: 'cmsxvvf02000v5lwfw3l33o14', quantity: 3 }, // كراس 96 ص — SVT/تكنولوجيا + تربية إسلامية + أمازيغية (Bic)
        { supplyItemId: 'cmsxvva24000l5lwfp7gcc2yx', quantity: 1 }, // كراس 64 ص — تربية بدنية (Foroni)
        // Shared tools
        { supplyItemId: 'cmsxvxyf4005z5lwfwl6iswvi', quantity: 1 }, // آلة حاسبة (Bic)
        { supplyItemId: 'cmsxvwuts003r5lwftnmtv1b5', quantity: 2 }, // قلم حبر أزرق (Bic)
        { supplyItemId: 'cmsxvx1ou00455lwfi5zw6vlw', quantity: 1 }, // قلم حبر أحمر (Bic)
        { supplyItemId: 'pen-bic-green', quantity: 1 }, // قلم حبر أخضر (Bic)
        { supplyItemId: 'cmsxvwo19003d5lwfk1r8ftq5', quantity: 1 }, // قلم رصاص HB (Bic)
        { supplyItemId: 'cmsxvxejy004v5lwfqe797i8c', quantity: 1 }, // مبراة (Bic)
        { supplyItemId: 'cmsxvxb0b004o5lwf9bialcn8', quantity: 1 }, // ممحاة (Bic)
        { supplyItemId: 'cmsxvx7j4004h5lwfrzzt495m', quantity: 1 }, // أقلام ملونة 6 ألوان (Bic)
        { supplyItemId: 'cmsxvxkec00575lwfpmueke45', quantity: 1 }, // غراء (Bic)
        { supplyItemId: 'cmsxvzkyw009a5lwfwor2wzad', quantity: 1 }, // شريط لاصق (Bic)
        { supplyItemId: 'cmsxvxlur005a5lwfjewhs4b8', quantity: 1 }, // مسطرة 30سم (Bic)
        { supplyItemId: 'cmsxvxobu005f5lwfrmzg9mt6', quantity: 1 }, // كوس / مثلث (Bic)
        { supplyItemId: 'cmsxvxr2e005k5lwfthzbu8zi', quantity: 1 }, // منقلة (Bic)
        { supplyItemId: 'cmsxvxti8005p5lwfk7bu2ng7', quantity: 1 }, // بركار (Bic)
        { supplyItemId: 'cmsxvymfg007c5lwfsm05qxp8', quantity: 1 }, // حافظة أوراق شفافة (Bic)
        { supplyItemId: 'cmsxvyflb006y5lwfct8p3quo', quantity: 1 }, // ورق ميليمتري (Bic)
        { supplyItemId: 'cmsxvyjgq00765lwffykde9mi', quantity: 1 }, // ورق شفاف (Bic)
        // Covers
        { supplyItemId: 'cmsxvyqt3007l5lwf3uxi5mi9', quantity: 13 }, // أغلفة بلاستيكية للكراريس (Éxacompta)
        { supplyItemId: 'cmsxvyrrz007n5lwfstomonyr', quantity: 5 }, // أغلفة بلاستيكية للكتب (Elba)
        // Backpack
        { supplyItemId: 'cmsxvzpc1009j5lwfvq2nsntk', quantity: 1 }, // محفظة مدرسية (Cameleon)
        { supplyItemId: 'cmsxvzvnj009w5lwf8z6tu5k6', quantity: 1 }, // مقلمة (Bic)
      ],
    },
  ];

  // Delete existing packs so they are recreated with Ministry list
  const allPackIds = ['pack-ap1', 'pack-ap2', 'pack-ap3', 'pack-ap4', 'pack-ap5', 'pack-am1', 'pack-am2', 'pack-am3', 'pack-am4', 'pack-as1', 'pack-as2', 'pack-as3'];
  await prisma.packItem.deleteMany({
    where: {
      hakibatiPackId: { in: allPackIds },
    },
  });
  await prisma.hakibatiPack.deleteMany({
    where: { id: { in: allPackIds } },
  });

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
