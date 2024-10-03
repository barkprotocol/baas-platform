import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary dark:bg-primary/10 text-primary-foreground dark:text-foreground rounded-md">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="mx-auto max-w-[700px] text-lg md:text-xl text-primary-foreground/80 dark:text-foreground/80 mb-8">
          Join the blockchain revolution today and unlock new possibilities for your enterprise with BARK BaaS. Experience the power of Solana-based solutions tailored for your business needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto bg-background dark:bg-primary text-primary dark:text-primary-foreground hover:bg-background/90 dark:hover:bg-primary/90">
            <Link href="/signup">Get Started Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground dark:border-foreground hover:bg-primary-foreground/10 dark:hover:bg-foreground/10">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}