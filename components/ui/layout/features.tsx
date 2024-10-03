import { Hourglass, Code, ShieldCheck, Zap, Sparkles, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Features() {
  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-semibold">
            Powerful Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
            Key Features
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-3xl mx-auto">
            Discover how our platform can revolutionize your blockchain experience with these powerful features.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Hourglass className="h-6 w-6" />}
            title="Lightning Fast"
            description="Experience blazing fast performance with our optimized platform, powered by Solana's high-speed blockchain. Process thousands of transactions per second with minimal latency."
          />
          <FeatureCard
            icon={<Code className="h-6 w-6" />}
            title="User Friendly"
            description="Tailor our solution to fit your unique business needs with ease, thanks to our intuitive API and comprehensive documentation. Get started quickly with our developer-friendly tools."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Reliable & Secure"
            description="Count on our robust infrastructure for uninterrupted service, backed by enterprise-grade security and 24/7 support. Benefit from Solana's proven track record of stability and security."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Solana Actions"
            description="Leverage the power of Solana's fast and efficient blockchain with our streamlined action system. Execute complex operations with ease and minimal gas fees."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Blinks"
            description="Utilize our innovative Blinks feature for instant, atomic swaps and cross-chain transactions. Seamlessly interact with multiple blockchains in a single, cohesive ecosystem."
          />
          <FeatureCard
            icon={<Layers className="h-6 w-6" />}
            title="Scalable Architecture"
            description="Build with confidence on our highly scalable infrastructure. Our multi-layered architecture ensures your applications can grow seamlessly, handling increased load and complexity with ease."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-primary/10">
      <CardHeader className="pb-2 flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center mb-4 bg-primary/10 rounded-full">
          <div className="text-[#D0BFB4]">{icon}</div>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}