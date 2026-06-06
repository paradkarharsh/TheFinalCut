import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
// @ts-ignore
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import SplashScreen from '@/components/ui/SplashScreen';
import KonamiCode from '@/components/ui/KonamiCode';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TheFinalCut — Cinema Redefined',
    template: '%s | TheFinalCut',
  },
  description:
    'The ultimate movie & TV series discovery platform. Deep analytics, AI recommendations, cinematic ratings, and immersive exploration.',
  keywords: [
    'movies', 'TV series', 'film discovery', 'movie ratings', 'AI recommendations',
    'cinema analytics', 'TheFinalCut', 'streaming', 'watchlist',
  ],
  authors: [{ name: 'TheFinalCut' }],
  creator: 'TheFinalCut',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thefinalcut.app',
    title: 'TheFinalCut — Cinema Redefined',
    description: 'The ultimate movie & TV series discovery platform.',
    siteName: 'TheFinalCut',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheFinalCut — Cinema Redefined',
    description: 'The ultimate movie & TV series discovery platform.',
    creator: '@thefinalcut',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#E50914',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-cinema-black text-white antialiased">
        <QueryProvider>
          <AuthProvider>
            <SplashScreen />
            <KonamiCode />
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  color: '#F0F0F0',
                  border: '1px solid rgba(229,9,20,0.3)',
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                },
                success: {
                  iconTheme: { primary: '#E50914', secondary: '#F0F0F0' },
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
