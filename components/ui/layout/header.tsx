import Link from 'next/link'
import Image from 'next/image'
import { WalletButton } from "@/components/ui/wallet-button"

const logoUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center justify-center space-x-2" href="/">
            <Image src={logoUrl} alt="BARK Logo" width={32} height={32} />
            <span className="text-xl font-bold">BARK | BaaS</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:text-primary" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#about">
              About
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#faq">
              FAQ
            </Link>
            <WalletButton />
          </nav>
        </div>
      </div>
    </header>
  )
}