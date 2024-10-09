'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Zap, Shield, Coins, FileCode, BarChart2, Share2, CheckCircle, Clock, Circle, Mail } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// API call for form submission
const submitContactForm = async (data: any) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));

export default function AboutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const result = await submitContactForm(data)
      if (result.success) {
        toast({
          title: "Success",
          description: "Your message has been sent. We'll get back to you soon!",
        })
        e.currentTarget.reset()
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    { title: "Easy Integration", description: "Seamlessly integrate blockchain into your existing systems", icon: <Zap className="h-8 w-8 mb-4" /> },
    { title: "Secure Transactions", description: "Ensure the safety and integrity of all your transactions", icon: <Shield className="h-8 w-8 mb-4" /> },
    { title: "Multi-Currency Support", description: "Handle various cryptocurrencies with ease", icon: <Coins className="h-8 w-8 mb-4" /> },
    { title: "Smart Contract Management", description: "Create, deploy, and manage smart contracts effortlessly", icon: <FileCode className="h-8 w-8 mb-4" /> },
    { title: "Real-time Analytics", description: "Gain insights with our powerful analytics tools", icon: <BarChart2 className="h-8 w-8 mb-4" /> },
    { title: "Solana Blinks", description: "Perform transactions on social media platforms through Dialect", icon: <Share2 className="h-8 w-8 mb-4" /> }
  ]

  const faqs = [
    { 
      question: "What is Blockchain-as-a-Service?", 
      answer: "Blockchain-as-a-Service (BaaS) is a cloud-based service that allows customers to develop, host, and use their own blockchain apps, smart contracts, and functions on the blockchain while the cloud-based service provider manages all the necessary tasks and activities to keep the infrastructure agile and operational."
    },
    { 
      question: "How secure is the BARK BaaS Platform?", 
      answer: "We prioritize security at every level. Our platform uses state-of-the-art encryption, regular security audits, and follows best practices in blockchain security to ensure the safety and integrity of all transactions and data on our platform."
    },
    { 
      question: "Can I integrate BARK BaaS with my existing systems?", 
      answer: "Yes, BARK BaaS is designed for easy integration with existing systems. We provide comprehensive APIs and documentation to help you seamlessly incorporate our blockchain services into your current infrastructure."
    },
    { 
      question: "What cryptocurrencies does BARK BaaS support?", 
      answer: "BARK BaaS supports a wide range of cryptocurrencies, including but not limited to USDC, BARK, and SOL. We're constantly expanding our support for different tokens to meet our clients' needs."
    },
    {
      question: "How do Solana Blinks work with social media platforms?",
      answer: "Solana Blinks allow you to perform blockchain transactions directly through various social media platforms. By integrating with Dialect, we enable users to initiate and confirm transactions using simple commands within their social media interactions, all secured and processed on the Solana blockchain."
    },
    {
      question: "What is Blinkboard?",
      answer: "Blinkboard is our innovative dashboard that provides a comprehensive overview of your Solana Blinks activities. It offers real-time tracking of transactions, analytics on usage patterns, and insights to help optimize your blockchain interactions across social media platforms."
    }
  ]

  const partners = [
    { name: "Solana", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Dialect", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Meteora", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Circle", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Jupiter", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Helius", logo: "/placeholder.svg?height=100&width=100" },
  ]

  const roadmap = [
    {
      phase: "Phase 1: Foundation",
      timeline: "Q2 2024",
      milestones: [
        { title: "BARK Token Launch", status: "completed" },
        { title: "Solana Blink Prototype", status: "completed" },
        { title: "Initial Partnership Agreements", status: "completed" },
      ]
    },
    {
      phase: "Phase 2: Core Development",
      timeline: "Q2-Q3 2024",
      milestones: [
        { title: "BARK BaaS Platform Alpha Release", status: "in-progress" },
        { title: "Integration with Major Social Media Platforms", status: "in-progress" },
        { title: "Smart Contract Templates Library", status: "planned" },
        { title: "Blinkboard Beta Launch", status: "in-progress" },
      ]
    },
    {
      phase: "Phase 3: Expansion",
      timeline: "Q3-Q4 2024",
      milestones: [
        { title: "BARK BaaS Platform Beta Release", status: "planned" },
        { title: "Cross-chain Interoperability Features", status: "planned" },
        { title: "Advanced Analytics Dashboard", status: "planned" },
        { title: "Blinkboard Full Release", status: "planned" },
      ]
    },
    {
      phase: "Phase 4: Enterprise Solutions",
      timeline: "Q2-Q4 2025",
      milestones: [
        { title: "Enterprise-grade Security Enhancements", status: "planned" },
        { title: "Industry-specific BaaS Solutions", status: "planned" },
        { title: "Global Expansion and Localization", status: "planned" },
        { title: "Blinkboard Enterprise Features", status: "planned" },
      ]
    }
  ]

  return (
    <>
      <Head>
        <title>About Blockchain As A Service Platform</title>
        <meta name="description" content="Learn about the BARK BaaS Platform, our mission, key features, and how we're revolutionizing Solana blockchain technology for businesses." />
      </Head>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Button onClick={() => router.push('/')} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About BARK BaaS Platform</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering businesses with cutting-edge blockchain technology, simplified.
          </p>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Mission</h2>
          <Card className="bg-gradient-to-br from-card to-background">
            <CardContent className="p-8">
              <p className="text-lg mb-4">
                At BARK BaaS (Blockchain-as-a-Service) Platform, we're on a mission to democratize blockchain technology. 
                We believe in making the power of blockchain accessible to businesses of all sizes, enabling them to 
                innovate, grow, and thrive in the digital economy.
              </p>
              <p className="text-lg">
                Our platform provides a comprehensive suite of tools and services that simplify blockchain integration, 
                allowing our clients to focus on what they do best - running their businesses and serving their customers.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    {feature.icon}
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Solana Blinks & Blinkboard</h2>
          <Card className="bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Revolutionizing Blockchain Interactions</CardTitle>
              <CardDescription className="text-center text-lg">Seamless integration of blockchain with your favorite social platforms and powerful analytics</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="solana-blinks" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="solana-blinks">Solana Blinks</TabsTrigger>
                  <TabsTrigger value="blinkboard">Blinkboard</TabsTrigger>
                </TabsList>
                <TabsContent value="solana-blinks">
                  <h3 className="text-xl font-semibold mb-2">Solana Blinks: Social Media Transactions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Perform blockchain transactions directly through social media platforms</li>
                    <li>Seamless integration with existing social media workflows</li>
                    <li>Enhanced security through Solana blockchain technology</li>
                    <li>Support for multiple cryptocurrencies</li>
                    <li>Real-time transaction tracking and confirmation</li>
                  </ul>
                </TabsContent>
                <TabsContent value="blinkboard">
                  <h3 className="text-xl font-semibold mb-2">Blinkboard: Your Blinks Dashboard</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Comprehensive overview of your Solana Blinks activities</li>
                    <li>Real-time tracking of transactions across platforms</li>
                    <li>Advanced analytics on usage patterns and trends</li>
                    <li>Insights to optimize your blockchain interactions</li>
                    <li>Customizable accounts, alerts and notifications</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Roadmap</h2>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <div className="space-y-8">
              {roadmap.map((phase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{phase.phase}</CardTitle>
                    <CardDescription>{phase.timeline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul  className="space-y-2">
                      {phase.milestones.map((milestone, mIndex) => (
                        <li key={mIndex} className="flex items-center">
                          {milestone.status === 'completed' && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                          {milestone.status === 'in-progress' && <Clock className="mr-2 h-4 w-4 text-yellow-500" />}
                          {milestone.status === 'planned' && <Circle className="mr-2 h-4 w-4 text-muted-foreground" />}
                          <span className={milestone.status === 'completed' ? 'line-through' : ''}>{milestone.title}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity:  1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-medium py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="py-4 text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <Image src={partner.logo} alt={`${partner.name} logo`} width={100} height={100} className="object-contain mb-2" />
                <p className="text-center font-semibold">{partner.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Contact Us</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get in Touch</CardTitle>
              <CardDescription className="text-center">Have questions? We're here to help!</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiryType">Inquiry Type</Label>
                  <Select name="inquiryType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required className="min-h-[100px]" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">You can also reach us directly at:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="mailto:contact@barkprotocol.net" className="flex items-center text-primary hover:underline">
                <Mail className="mr-2 h-4 w-4" />
                contact@barkprotocol.net
              </a>
              <a href="mailto:partnership@barkprotocol.net" className="flex items-center text-primary hover:underline">
                <Mail className="mr-2 h-4 w-4" />
                partnership@barkprotocol.net
              </a>
            </div>
          </div>
        </motion.section>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="fixed bottom-4 right-4">
              Need Help?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chat with our AI Assistant</DialogTitle>
              <DialogDescription>
                Get instant answers to your questions about BARK Protocol.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>AI chat interface would go here.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}