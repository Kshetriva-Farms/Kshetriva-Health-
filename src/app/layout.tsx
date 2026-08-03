import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/application/context/ThemeContext';
import { AuthProvider } from '@/application/context/AuthContext';
import { ToastProvider } from '@/application/context/ToastContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Kshetriva Health+ | Premium Farm-to-Table Wellness & AI Nutrition',
  description:
    'Exclusive health platform for Kshetriva Farms organic vegetable basket subscribers. Gemini AI nutrition advisor, daily vitals tracking, and fresh harvest recipes.',
  keywords: [
    'Kshetriva Farms',
    'Health+',
    'Organic Produce Nutrition',
    'Gemini AI Nutrition',
    'Farm Basket',
    'Cellular Health',
  ],
  authors: [{ name: 'Kshetriva Farms' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F7F5' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1612' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-emerald-500 selection:text-white bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
