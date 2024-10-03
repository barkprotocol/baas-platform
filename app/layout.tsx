import './styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { Toaster } from '@/components/ui/toaster';
import { WalletProviders } from '@/components/providers/wallet-providers'
import { ThemeProvider } from "@/components/ui/theme-provider"

// Metadata configuration for the application
export const metadata: Metadata = {
  title: 'BARK - Blockchain As A Service',
  description: 'Get started with Solana Actions',
  icons: {
    icon: '/favicon.ico',
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Configure the Manrope font
const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data
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