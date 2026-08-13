'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-provider';
import { CheckoutForm } from '@/components/checkout-form';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const { t, isAr } = useLanguage();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<{
    name: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
  }>();

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || '',
        phone: session.user.phone || '',
        wilaya: session.user.wilaya || '',
        commune: session.user.commune || '',
        address: session.user.address || '',
      });
    }
  }, [session]);

  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-1">
          <Link href="/">
            <BackArrow className="h-4 w-4" />
            <span>{t('العودة للتسوق', 'Retour aux achats')}</span>
          </Link>
        </Button>

        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">{t('إتمام الطلب', 'Finaliser la commande')}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {t(
              'أدخل بياناتك واختر طريقة التوصيل المناسبة',
              'Entrez vos coordonnées et choisissez votre mode de livraison'
            )}
          </p>

          {!session && (
            <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm">
                {t('هل لديك حساب؟', 'Vous avez un compte ?')}{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  {t('سجّل الدخول لتعبئة بياناتك تلقائياً', 'Connectez-vous pour remplir automatiquement')}
                </Link>
              </p>
            </div>
          )}

          <CheckoutForm userData={userData} />
        </div>
      </div>
    </div>
  );
}
