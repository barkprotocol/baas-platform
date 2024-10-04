'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Zap, Shield, Coins, FileCode, BarChart2, Share2, ExternalLink } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock API call for form submission
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

  return (
    <>
      <Head>
        <title>About BARK BaaS Platform</title>
        <meta name="description" content="Learn about the BARK BaaS Platform, our mission, key features, and how we're revolutionizing blockchain technology for businesses." />
      </Head>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Button onClick={() => router.push('/')} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} /> Back to Main
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About BARK BaaS Platform</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering businesses with cutting-edge blockchain technology, simplified.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Mission</h2>
          <Card className="bg-gradient-to-br from-[#F5E6D3] to-[#E6D2B5]">
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
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Easy Integration", description: "Seamlessly integrate blockchain into your existing systems", icon: <Zap className="h-8 w-8 mb-4" style={{color: '#D0BFB4'}} /> },
              { title: "Secure Transactions", description: "Ensure the safety and integrity of all your transactions", icon: <Shield className="h-8 w-8 mb-4" style={{color: '#D0BFB4'}} /> },
              { title: "Multi-Currency Support", description: "Handle various cryptocurrencies with ease", icon: <Coins className="h-8 w-8 mb-4" style={{color: '#D0BFB4'}} /> },
              { title: "Smart Contract Management", description: "Create, deploy, and manage smart contracts effortlessly", icon: <FileCode className="h-8 w-8 mb-4" style={{color: '#D0BFB4'}} /> },
              { title: "Real-time Analytics", description: "Gain insights with our powerful analytics tools", icon: <BarChart2 className="h-8 w-8 mb-4" style={{color: '#D0BFB4'}} /> },
              { title: "Solana Blinks", description: "Perform transactions on social media platforms through Dialect", icon: <Share2 className="h-8 w-8 mb-4" style={{color: '#D0BFB4'}} /> }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Solana Blinks: Social Media Transactions</h2>
          <Card className="bg-gradient-to-br from-[#F5E6D3] to-[#E6D2B5]">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Revolutionizing Social Media Transactions</CardTitle>
              <CardDescription className="text-center text-lg">Seamless integration of blockchain with your favorite social platforms</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="how-it-works" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>
                <TabsContent value="how-it-works">
                  <h3 className="text-xl font-semibold mb-2">How It Works</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Connect your social media account to the BARK BaaS Platform</li>
                    <li>Initiate a transaction by mentioning the recipient and including a special command</li>
                    <li>Confirm the transaction through our secure interface</li>
                    <li>The transaction is processed on the Solana blockchain</li>
                    <li>Both parties receive confirmation of the completed transaction</li>
                  </ol>
                </TabsContent>
                <TabsContent value="benefits">
                  <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Instant peer-to-peer transactions within your social network</li>
                    <li>Enhanced security through blockchain technology</li>
                    <li>Seamless integration with existing social media workflows</li>
                    <li>Support for multiple cryptocurrencies</li>
                    <li>Real-time transaction tracking and confirmation</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
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
              }
            ].map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b border-gray-200">
                <AccordionTrigger className="text-lg font-medium py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="py-4 text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Solana", logo: "/placeholder.svg?height=100&width=100" },
              { name: "Dialect", logo: "/placeholder.svg?height=100&width=100" },
              { name: "USDC", logo: "/placeholder.svg?height=100&width=100" },
              { name: "Phantom", logo: "/placeholder.svg?height=100&width=100" },
            ].map((partner, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={partner.logo} alt={`${partner.name} logo`} className="w-24 h-24 object-contain mb-2" />
                <p className="text-center font-semibold">{partner.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
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
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required className="min-h-[100px]" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-16 text-center text-gray-600">
          <p>&copy; 2023 BARK BaaS Platform. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 flex items-center">
              Documentation <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}