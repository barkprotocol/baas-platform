'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, BarChart2, PlusCircle, Settings, Menu, CreditCard, Gift, Image as ImageIcon, Star } from 'lucide-react'

const iconColor = "#BBA597"

const sidebarItems = [
  { name: 'Dashboard', href: '/blinks', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Create Blink', href: '/blinks/create', icon: PlusCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const blinkTypes = [
  { name: 'Payment Blinks', href: '/blinks?type=payment', icon: CreditCard },
  { name: 'Gift Blinks', href: '/blinks?type=gift', icon: Gift },
  { name: 'NFT Blinks', href: '/blinks?type=nft', icon: ImageIcon },
]

interface BlinkboardTier {
  name: string;
  href: string;
  icon: typeof Star;
  active?: boolean;
}

const blinkboardTiers: BlinkboardTier[] = [
  { name: 'Basic Blinkboard', href: '/blinkboard/basic', icon: Star, active: true },
  { name: 'Pro Blinkboard', href: '/blinkboard/pro', icon: Star },
  { name: 'Enterprise Blinkboard', href: '/blinkboard/enterprise', icon: Star },
  { name: 'Exclusive Blinkboard', href: '/blinkboard/exclusive', icon: Star },
]

function BlinkboardTierItem({ tier }: { tier: BlinkboardTier }) {
  return (
    <>
      <tier.icon className="mr-2 h-4 w-4" style={{ color: iconColor }} />
      {tier.name}
      {tier.active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sand-500" aria-hidden="true" />
      )}
    </>
  )
}

export function BlinkboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-5 w-5" style={{ color: iconColor }} />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileNav pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <nav className="hidden lg:block">
        <ScrollArea className="py-4 pr-4 lg:py-6">
          <div className="mb-6">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-sand-600">
              Main Menu
            </h2>
            <SidebarItems items={sidebarItems} pathname={pathname} />
          </div>
          <div className="mb-6">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-sand-600">
              Blink Types
            </h2>
            <SidebarItems items={blinkTypes} pathname={pathname} />
          </div>
          <div className="mb-6">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-sand-600">
              Blinkboard Tiers
            </h2>
            <SidebarItems items={blinkboardTiers} pathname={pathname} />
          </div>
        </ScrollArea>
      </nav>
    </>
  )
}

function MobileNav({ pathname, setOpen }: { pathname: string; setOpen: (open: boolean) => void }) {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-sand-600">
          Main Menu
        </h2>
        {sidebarItems.map((item) => (
          <MobileLink
            key={item.href}
            href={item.href}
            pathname={pathname}
            setOpen={setOpen}
          >
            <item.icon className="mr-2 h-4 w-4" style={{ color: iconColor }} />
            {item.name}
          </MobileLink>
        ))}
      </div>
      <div>
        <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-sand-600">
          Blink Types
        </h2>
        {blinkTypes.map((item) => (
          <MobileLink
            key={item.href}
            href={item.href}
            pathname={pathname}
            setOpen={setOpen}
          >
            <item.icon className="mr-2 h-4 w-4" style={{ color: iconColor }} />
            {item.name}
          </MobileLink>
        ))}
      </div>
      <div>
        <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-sand-600">
          Blinkboard Tiers
        </h2>
        {blinkboardTiers.map((item) => (
          <MobileLink
            key={item.href}
            href={item.href}
            pathname={pathname}
            setOpen={setOpen}
          >
            <BlinkboardTierItem tier={item} />
          </MobileLink>
        ))}
      </div>
    </div>
  )
}

function MobileLink({
  children,
  href,
  pathname,
  setOpen,
}: {
  children: React.ReactNode
  href: string
  pathname: string
  setOpen: (open: boolean) => void
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm text-sand-900 hover:bg-sand-100 dark:text-sand-100 dark:hover:bg-sand-800",
        pathname === href ? "bg-sand-100 dark:bg-sand-800" : ""
      )}
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  )
}

function SidebarItems({ items, pathname }: { items: typeof sidebarItems | typeof blinkboardTiers; pathname: string }) {
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm text-sand-900 hover:bg-sand-100 dark:text-sand-100 dark:hover:bg-sand-800",
            pathname === item.href ? "bg-sand-100 dark:bg-sand-800" : "",
            'active' in item && item.active ? "font-medium" : ""
          )}
        >
          {'icon' in item ? (
            <>
              <item.icon className="mr-2 h-4 w-4" style={{ color: iconColor }} />
              {item.name}
            </>
          ) : (
            <BlinkboardTierItem tier={item} />
          )}
        </Link>
      ))}
    </div>
  )
}