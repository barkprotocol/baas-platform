import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small projects and startups",
    priceSOL: 10,
    priceUSDC: 500,
    features: [
      "Up to 1,000 transactions per month",
      "Basic analytics",
      "Email support",
      "1 project",
    ],
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses",
    priceSOL: 50,
    priceUSDC: 2500,
    features: [
      "Up to 10,000 transactions per month",
      "Advanced analytics",
      "Priority email support",
      "5 projects",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    priceSOL: 200,
    priceUSDC: 10000,
    features: [
      "Unlimited transactions",
      "Real-time analytics",
      "24/7 phone and email support",
      "Unlimited projects",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
]

export function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4">
          Our Services
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-8 md:mb-12 lg:mb-16">
          Choose the plan that's right for your business
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold mb-2">
                  {plan.priceSOL} SOL
                </div>
                <div className="text-sm text-muted-foreground mb-6">
                  or {plan.priceUSDC} USDC per month
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}