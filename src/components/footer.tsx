'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  CreditCard,
  Clock,
} from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      {/* Trust bar */}
      <div className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                icon: Truck,
                key: 'fast-delivery',
                title: t('توصيل سريع', 'Livraison rapide'),
                desc: t('58 ولاية', '58 wilayas'),
              },
              {
                icon: ShieldCheck,
                key: 'quality',
                title: t('جودة مضمونة', 'Qualité garantie'),
                desc: t('منتجات أصلية', 'Produits originaux'),
              },
              {
                icon: CreditCard,
                key: 'cod',
                title: t('الدفع عند الاستلام', 'Paiement à la livraison'),
                desc: t('بدون دفع مسبق', 'Sans paiement anticipé'),
              },
              {
                icon: Clock,
                key: 'service',
                title: t('خدمة 7/7', 'Service 7/7'),
                desc: t('من 8ص إلى 8م', '8h - 20h'),
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold text-primary tracking-tight">
                حقيبتي
              </span>
              <span className="text-lg font-semibold text-primary/80">
                Hakibati
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'منصة حقيبتي لتوفير مجموعات الأدوات المدرسية الجاهزة مع التوصيل إلى جميع ولايات الجزائر.',
                'Plateforme Hakibati pour fournir des kits scolaires complets avec livraison dans toutes les wilayas d\'Algérie.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold">
              {t('روابط سريعة', 'Liens rapides')}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', key: 'home', label: t('الرئيسية', 'Accueil') },
                { href: '/packs', key: 'packs', label: t('الحقائب المدرسية', 'Kits scolaires') },
                { href: '/account/orders', key: 'orders', label: t('طلباتي', 'Mes commandes') },
                { href: '/login', key: 'login', label: t('تسجيل الدخول', 'Connexion') },
              ].map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 ease-out-expo hover:text-primary hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold">
              {t('الدعم والمساعدة', 'Support')}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/how-to-order', key: 'how-to', label: t('كيفية الطلب', 'Comment commander') },
                { href: '/delivery', key: 'delivery', label: t('طرق التوصيل', 'Modes de livraison') },
                { href: '/returns', key: 'returns', label: t('سياسة الإرجاع', 'Politique de retour') },
                { href: '/faq', key: 'faq', label: t('الأسئلة الشائعة', 'FAQ') },
              ].map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 ease-out-expo hover:text-primary hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold">
              {t('تواصل معنا', 'Contactez-nous')}
            </h3>
            <div className="space-y-2.5">
              <a
                href="tel:0663141788"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span dir="ltr">0663-14-17-88</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span dir="ltr">contact@hakibati.dz</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>{t('الجزائر العاصمة', 'Alger, Algérie')}</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.instagram.com/dz.hakibati/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 ease-out-expo hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/dz.hakibati/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 ease-out-expo hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/213663141788"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 ease-out-expo hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:-translate-y-0.5"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {t('حقيبتي. جميع الحقوق محفوظة.', 'Hakibati. Tous droits réservés.')}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-all duration-200 ease-out-expo hover:text-primary hover:underline underline-offset-2"
            >
              {t('شروط الاستخدام', 'Conditions d\'utilisation')}
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-all duration-200 ease-out-expo hover:text-primary hover:underline underline-offset-2"
            >
              {t('سياسة الخصوصية', 'Politique de confidentialité')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
