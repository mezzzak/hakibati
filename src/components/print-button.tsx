'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function PrintButton({ variant = 'outline', size = 'sm', className }: PrintButtonProps) {
  const { t } = useLanguage();
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={`gap-2 print:hidden ${className || ''}`}
    >
      <Printer className="h-4 w-4" />
      {t('طباعة / تحميل PDF', 'Imprimer / Télécharger PDF')}
    </Button>
  );
}
