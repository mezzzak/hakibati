'use client';

import { BookOpen, Truck, ShieldCheck, Heart, Users, Target } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

function AboutContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary/[0.04] py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {t('من نحن', 'Qui sommes-nous')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'حقيبتي هي خدمتكم المفضلة لتوفير الأدوات المدرسية في الجزائر',
              'Hakibati est votre service préféré pour les fournitures scolaires en Algérie'
            )}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center gap-4 rounded-2xl border bg-background p-8 shadow-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {t('رسالتنا', 'Notre mission')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    'تبسيط موسم العودة إلى المدارس على الأسر الجزائرية بتوفير حقائب مدرسية كاملة وذات جودة عالية تصل إلى باب المنزل.',
                    'Simplifier la rentrée scolaire pour les familles algériennes en fournissant des kits complets et de qualité, livrés à domicile.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4 rounded-2xl border bg-background p-8 shadow-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {t('قيمنا', 'Nos valeurs')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    'الجودة، الثقة، والتوفير. نؤمن بأن كل تلميذ يستحق أدوات مدرسية من ماركات أصلية بأسعار مناسبة.',
                    'Qualité, confiance et économie. Nous croyons que chaque élève mérite des fournitures de marques authentiques à prix juste.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t('لماذا تختار حقيبتي؟', 'Pourquoi choisir Hakibati ?')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: t('حقائب شاملة', 'Kits complets'),
                desc: t(
                  'نغطي جميع المراحل الدراسية من التحضيري إلى الثانوي',
                  'Nous couvrons tous les niveaux scolaires de la maternelle au lycée'
                ),
              },
              {
                icon: Truck,
                title: t('توصيل وطني', 'Livraison nationale'),
                desc: t(
                  'نوصل إلى جميع ولايات الجزائر الـ 58 بسرعة وموثوقية',
                  'Livraison rapide et fiable vers les 58 wilayas d\'Algérie'
                ),
              },
              {
                icon: ShieldCheck,
                title: t('جودة مضمونة', 'Qualité garantie'),
                desc: t(
                  'نتعامل فقط مع ماركات أصلية معتمدة وموثوقة',
                  'Nous travaillons uniquement avec des marques authentiques et certifiées'
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center gap-3 rounded-2xl border bg-background p-6 shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Community */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t('مجتمعنا', 'Notre communauté')}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              'نفخر بخدمة آلاف الأسر الجزائرية كل عام. نعمل باستمرار لتحسين تجربتكم ونقدم لكم الأفضل دائماً.',
              'Nous sommes fiers de servir des milliers de familles algériennes chaque année. Nous travaillons sans cesse pour améliorer votre expérience.'
            )}
          </p>
        </div>
      </section>
    </main>
  );
}

export default function AboutPage() {
  return <AboutContent />;
}
