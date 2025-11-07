
import type {Metadata} from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer'; // Added import
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';
import { FirebaseClientProvider } from '@/firebase';
import CookieBanner from '@/components/layout/cookie-banner';
import { AccessibilityToolbar } from '@/components/layout/accessibility-toolbar';
import { ThemeProvider } from '@/lib/theme';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Venue Vendors',
  description: 'Find the best vendors for your events!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider>
          <FirebaseClientProvider>
            <Providers>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
              <CookieBanner />
              <AccessibilityToolbar />
            </Providers>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
