import { Star } from 'lucide-react'

export interface BlinkboardTier {
  name: string;
  href: string;
  icon: typeof Star;
  active?: boolean;
}

export const blinkboardTiers: BlinkboardTier[] = [
  { name: 'Basic Blinkboard', href: '/blinkboard/', icon: Star, active: true },
  { name: 'Pro Blinkboard', href: '/blinkboard/pro', icon: Star },
  { name: 'Enterprise Blinkboard', href: '/blinkboard/enterprise', icon: Star },
  { name: 'Exclusive Blinkboard', href: '/blinkboard/exclusive', icon: Star },
]

export function BlinkboardTierItem({ tier }: { tier: BlinkboardTier }) {
  return (
    <>
      <tier.icon className="mr-2 h-4 w-4" style={{ color: "#BBA597" }} />
      {tier.name}
      {tier.active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sand-500" />
      )}
    </>
  )
}