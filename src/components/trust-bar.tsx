'use client';

import { Package, Truck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export function TrustBar() {
  const { t } = useLanguage();

  const items = [
    {
      icon: Package,
      text: t('حقائب جاهزة لكل مستوى', 'Kits prêts pour chaque niveau'),
    },
    {
      icon: Truck,
      text: t('توصيل إلى جميع الولايات', 'Livraison vers toutes les wilayas'),
    },
    {
      icon: ShieldCheck,
      text: t('ماركات أصلية مضمونة', 'Marques authentiques garanties'),
    },
  ];

  return (
    <section className="border-y bg-muted/40 py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
