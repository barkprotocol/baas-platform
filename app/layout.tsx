import './styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { Toaster } from '@/components/ui/toaster';
import { WalletProviders } from '@/components/providers/wallet-providers'
import { ThemeProvider } from "@/components/ui/theme-provider"

export const metadata: Metadata = {
  title: 'BARK - Blockchain As A Service',
  description: 'Get started with Solana Actions and Blinks',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background text-foreground ${manrope.className}`}>
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
              </div>
              <Toaster />
            </UserProvider>
          </WalletProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}