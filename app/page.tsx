import { Header } from "@/components/ui/layout/header"
import { Hero } from "@/components/ui/layout/hero"
import { Features } from "@/components/ui/layout/features"
import { About } from "@/components/ui/layout/about"
import { CTA } from "@/components/ui/layout/cta"
import { FAQ } from "@/components/ui/layout/faq"
import { Newsletter } from "@/components/ui/layout/newsletter"
import { Footer } from "@/components/ui/layout/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16">
          <Hero />
          <Features />
          <About />
          <CTA />
          <FAQ />
          <Newsletter />
        </div>
      </main>
      <Footer />
    </div>
  )
}