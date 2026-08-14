import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/session-provider';
import { LanguageProvider } from '@/components/language-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { InstallBanner } from '@/components/install-banner';
import { ErrorBoundary } from '@/components/error-boundary';
import { ScrollToTop } from '@/components/scroll-to-top';
import { ToasterWrapper } from '@/components/toaster-wrapper';

export const metadata: Metadata = {
  title: 'حقيبتي | Hakibati - الأدوات المدرسية بنقرة واحدة',
  description:
    'منصة حقيبتي لتوفير مجموعات الأدوات المدرسية الجاهزة مع التوصيل إلى جميع ولايات الجزائر. اختر الصف، اضغط، واستلم!',
  keywords: [
    'حقيبتي',
    'Hakibati',
    'أدوات مدرسية',
    'cartable',
    'قرطاسية',
    'الجزائر',
    'Algérie',
    'back to school',
    'fournitures scolaires',
  ],
  authors: [{ name: 'Hakibati Team' }],
  creator: 'Hakibati',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'حقيبتي | Hakibati',
    description: 'الأدوات المدرسية بنقرة واحدة - التوصيل لجميع الولايات',
    url: '/',
    siteName: 'Hakibati',
    locale: 'ar_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'حقيبتي | Hakibati',
    description: 'الأدوات المدرسية بنقرة واحدة - التوصيل لجميع الولايات',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var lang = localStorage.getItem('hakibati-language');
                  if (lang === 'fr') {
                    document.documentElement.lang = 'fr';
                    document.documentElement.dir = 'ltr';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <SessionProvider>
          <LanguageProvider>
            <ScrollToTop />
            <Header />
            <ErrorBoundary>
              <main>{children}</main>
            </ErrorBoundary>
            <CartDrawer />
            <Footer />
            <InstallBanner />
            <ToasterWrapper />
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
