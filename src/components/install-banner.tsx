'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('hakibati-install-dismissed');
    if (wasDismissed) {
      const dismissedAt = parseInt(wasDismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('hakibati-install-dismissed', Date.now().toString());
  };

  if (isInstalled || dismissed || !deferredPrompt) return null;

  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{t('ثبّت تطبيق حقيبتي على هاتفك', 'Installez l\'app Hakibati')}</p>
          <p className="text-xs text-primary-foreground/80 truncate">
            {t('وصول أسرع لطلب الأدوات المدرسية في أي وقت', 'Accès rapide pour commander vos fournitures')}
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleInstall}
          className="shrink-0 gap-1.5 bg-white text-primary hover:bg-white/90"
        >
          <Download className="h-3.5 w-3.5" />
          {t('تثبيت', 'Installer')}
        </Button>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-full p-1.5 text-primary-foreground/70 hover:bg-white/20 transition-colors"
          aria-label={t('إغلاق', 'Fermer')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
