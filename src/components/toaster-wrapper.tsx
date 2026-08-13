'use client';

import { Toaster } from 'sonner';
import { useLanguage } from '@/components/language-provider';

export function ToasterWrapper() {
  const { isAr } = useLanguage();
  return (
    <Toaster
      position="top-center"
      dir={isAr ? 'rtl' : 'ltr'}
      richColors
      toastOptions={{
        style: {
          fontFamily: '"Noto Sans Arabic", system-ui, sans-serif',
        },
      }}
    />
  );
}
