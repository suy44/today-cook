import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
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
      <body className="min-h-full flex flex-col bg-stone-900 text-stone-900 selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
