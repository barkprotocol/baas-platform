'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Zap, Shield, Coins, BarChart, Users, Code } from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const packages = [
  {
    name: "Starter",
    description: "Perfect for small projects and individual developers",
    price: "$99/month",
    features: [
      "1 Blinkboard",
      "Basic analytics",
      "5 team members",
      "24/7 support"
    ]
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses and startups",
    price: "$299/month",
    features: [
      "5 Blinkboards",
      "Advanced analytics",
      "Unlimited team members",
      "Priority support",
      "Custom integrations"
    ]
  },
  {
    name: "Enterprise",
    description: "Tailored solutions for large-scale operations",
    price: "Custom pricing",
    features: [
      "Unlimited Blinkboards",
      "Enterprise-grade analytics",
      "Dedicated account manager",
      "Custom feature development",
      "On-premise deployment options"
    ]
  }
]

const PackageCard = ({ name, description, price, features }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold mb-4">{price}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Zap className="mr-2 h-4 w-4 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Choose {name}</Button>
    </CardFooter>
  </Card>
)

export default function SolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4 text-sand-900 dark:text-sand-100">BARK Protocol Solutions</h1>
        <p className="text-xl text-sand-700 dark:text-sand-300 max-w-2xl mx-auto">
          Empower your blockchain projects with our cutting-edge Blinkboards and flexible packages.
        </p>
      </motion.div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="mb-20"
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-8 text-sand-800 dark:text-sand-200">
          Introducing Blinkboards
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <p className="text-lg mb-6 text-sand-700 dark:text-sand-300">
              Blinkboards are powerful, customizable dashboards that provide real-time insights into your blockchain operations. With intuitive visualizations and advanced analytics, Blinkboards help you make data-driven decisions quickly and efficiently.
            </p>
            <ul className="space-y-4 mb-6">
              {[
                { icon: BarChart, text: "Real-time analytics and visualizations" },
                { icon: Shield, text: "Secure and encrypted data handling" },
                { icon: Coins, text: "Track multiple cryptocurrencies and tokens" },
                { icon: Users, text: "Collaborative tools for team decision-making" },
                { icon: Code, text: "Customizable widgets and integrations" }
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <item.icon className="mr-2 h-5 w-5 text-primary" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/demo" passHref>
              <Button>
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/blinkboard-demo.png"
              alt="Blinkboard Demo"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-8 text-sand-800 dark:text-sand-200">
          Choose Your Package
        </motion.h2>
        <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-sand-800 dark:text-sand-200">Ready to Get Started?</h2>
        <p className="text-lg mb-8 text-sand-700 dark:text-sand-300">
          Contact our sales team to find the perfect solution for your blockchain needs.
        </p>
        <Link href="/contact" passHref>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contact Sales
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.section>
    </div>
  )
}