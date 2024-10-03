import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { BarChart, Users, Zap } from 'lucide-react'

export function About() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Empowering the Future of <span className="text-primary">Blockchain</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            BARK BaaS revolutionizes blockchain integration, making it accessible and efficient for businesses of all sizes.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">About BaaS Platform</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              BARK BaaS (Blockchain as a Service) is a cutting-edge platform that leverages the power of Solana blockchain to provide fast, secure, and scalable solutions for businesses. Our mission is to simplify blockchain integration and empower companies to harness the full potential of decentralized technologies.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
              Explore Our Solutions
            </Button>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="BARK BaaS Platform"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-10">Dashboard Features</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              icon={BarChart}
              title="Real-time Analytics"
              description="Gain insights with comprehensive blockchain analytics"
            />
            <DashboardCard
              icon={Users}
              title="User Management"
              description="Effortless user and wallet management tools"
            />
            <DashboardCard
              icon={Zap}
              title="Programs"
              description="Deploy and manage smart contracts with ease"
            />
          </div>
        </div>
      </div>
    </section>
  )
}