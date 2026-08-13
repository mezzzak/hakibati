import { HeroSection } from '@/components/hero-section';
import { GradeSelector } from '@/components/grade-selector';
import { HowItWorks } from '@/components/how-it-works';
import { FeaturedPacks } from '@/components/featured-packs';
import { Testimonials } from '@/components/testimonials';
import { CTABanner } from '@/components/cta-banner';
import { getAllPacks } from '@/lib/db';

export default async function Home() {
  const packs = await getAllPacks({ activeOnly: true });
  const featuredPacks = packs.slice(0, 6).map((p) => ({
    id: p.id,
    nameAr: p.nameAr,
    nameFr: p.nameFr,
    descriptionAr: p.descriptionAr,
    descriptionFr: p.descriptionFr,
    gradeLevel: p.gradeLevel,
    imageUrl: p.imageUrl,
    basePriceDZD: p.basePriceDZD,
    discountPercent: p.discountPercent,
  }));

  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedPacks packs={featuredPacks} />
      <GradeSelector />
      <Testimonials />
      <CTABanner />
    </>
  );
}
