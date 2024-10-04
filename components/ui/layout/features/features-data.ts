import { Hourglass, Code, ShieldCheck, Zap, Sparkles, Layers } from 'lucide-react'
import { ReactNode } from 'react'

interface Feature {
  icon: ReactNode
  title: string
  description: string
  link: string
}

export const featuresData: Feature[] = [
  {
    icon: <Hourglass className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Experience blazing fast performance with our optimized platform, powered by Solana's high-speed blockchain. Process thousands of transactions per second with minimal latency.",
    link: "/features/performance"
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "User Friendly",
    description: "Tailor our solution to fit your unique business needs with ease, thanks to our intuitive API and comprehensive documentation. Get started quickly with our developer-friendly tools.",
    link: "/features/api"
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Reliable & Secure",
    description: "Count on our robust infrastructure for uninterrupted service, backed by enterprise-grade security and 24/7 support. Benefit from Solana's proven track record of stability and security.",
    link: "/features/security"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Solana Actions",
    description: "Leverage the power of Solana's fast and efficient blockchain with our streamlined action system. Execute complex operations with ease and minimal gas fees.",
    link: "/features/solana-actions"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Blinks",
    description: "Utilize our innovative Blinks feature for instant, atomic swaps and cross-chain transactions. Seamlessly interact with multiple blockchains in a single, cohesive ecosystem.",
    link: "/features/blinks"
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Scalable Architecture",
    description: "Build with confidence on our highly scalable infrastructure. Our multi-layered architecture ensures your applications can grow seamlessly, handling increased load and complexity with ease.",
    link: "/features/scalability"
  }
]