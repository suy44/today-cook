import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'واش نطيب اليوم؟ 🇩🇿 | دوريها وخلي الحظ يختار',
  description: 'تطبيق جزائري مرح يحل حيرة كل يوم: ما تزيديش تحتاري واش تطيبي! دوري عجلة الحظ واكتشفي أشهى الأطباق والوصفات الجزائرية الأصيلة.',
  applicationName: 'واش نطيب اليوم؟',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'واش نطيب اليوم؟',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ea580c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9KXYZQ7X22"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9KXYZQ7X22');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-stone-900 text-stone-900 selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}

