import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full py-6 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <FooterSection title="About" links={[
            { href: "#", text: "Company" },
            { href: "#", text: "Team" },
            { href: "#", text: "Careers" },
          ]} />
          <FooterSection title="Product" links={[
            { href: "#", text: "Features" },
            { href: "#", text: "Pricing" },
            { href: "#", text: "FAQ" },
          ]} />
          <FooterSection title="Resources" links={[
            { href: "#", text: "Documentation" },
            { href: "#", text: "Tutorials" },
            { href: "#", text: "Blog" },
          ]} />
          <FooterSection title="Legal" links={[
            { href: "#", text: "Privacy" },
            { href: "#", text: "Terms" },
            { href: "#", text: "Cookie Policy" },
          ]} />
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2024 BARK Protocol. All rights reserved.</p>
          <div className="flex gap-4">
            <SocialLink href="#" ariaLabel="Facebook" icon={
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            } />
            <SocialLink href="#" ariaLabel="Twitter" icon={
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            } />
            <SocialLink href="#" ariaLabel="GitHub" icon={
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            } />
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSection({ title, links }: { title: string; links: { href: string; text: string }[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">{title}</h4>
      <ul className="space-y-1">
        {links.map((link, index) => (
          <li key={index}>
            <Link className="text-sm text-muted-foreground hover:text-primary" href={link.href}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ href, ariaLabel, icon }: { href: string; ariaLabel: string; icon: React.ReactNode }) {
  return (
    <Link className="text-muted-foreground hover:text-primary" href={href} aria-label={ariaLabel}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        {icon}
      </svg>
    </Link>
  )
}