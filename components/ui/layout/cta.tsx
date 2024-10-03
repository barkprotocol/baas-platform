import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Ready to Transform Your Business?</h2>
        <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl mb-8">
          Join the blockchain revolution today and unlock new possibilities for your enterprise.
        </p>
        <Button size="lg" variant="secondary">
          Get Started Now
        </Button>
      </div>
    </section>
  )
}