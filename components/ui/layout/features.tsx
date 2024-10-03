import { CheckCircle, Code, Zap } from 'lucide-react'

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="text-primary-foreground h-6 w-6" />}
            title="Lightning Fast"
            description="Experience blazing fast performance with our optimized platform."
          />
          <FeatureCard
            icon={<Code className="text-primary-foreground h-6 w-6" />}
            title="User Friendly"
            description="Tailor our solution to fit your unique business needs with ease."
          />
          <FeatureCard
            icon={<CheckCircle className="text-primary-foreground h-6 w-6" />}
            title="Reliable"
            description="Count on our robust infrastructure for uninterrupted service."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-lg">
      <div className="p-2 bg-primary rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </div>
  )
}