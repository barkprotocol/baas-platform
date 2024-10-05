import './styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { Toaster } from '@/components/ui/toaster';
import { WalletProviders } from '@/components/providers/wallet-providers'
import { ThemeProvider } from "@/components/ui/theme-provider"

const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'BARK - Blockchain As A Service',
  description: 'Get started with Solana Actions',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="bg-#f0f0f0 text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProviders>
            <UserProvider userPromise={userPromise}>
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  {children}
                </main>
                <footer className="py-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} BARK Protocol. All rights reserved.
                </footer>
              </div>
              <Toaster />
            </UserProvider>
          </WalletProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}