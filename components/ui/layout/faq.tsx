'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const faqItems = [
  {
    question: "What is BARK BaaS?",
    answer: "BARK BaaS (Blockchain as a Service) is a cutting-edge platform that leverages the power of Solana blockchain to provide fast, secure, and scalable solutions for businesses. Our mission is to simplify blockchain integration and empower companies to harness the full potential of decentralized technologies."
  },
  {
    question: "How secure is the BARK BaaS platform?",
    answer: "Our platform leverages the security features of the Solana blockchain and implements additional security measures to ensure the highest level of protection for your data and transactions. We use industry-standard encryption, regular security audits, and follow best practices in cybersecurity to safeguard your information."
  },
  {
    question: "Can I customize BARK BaaS solutions for my specific needs?",
    answer: "Yes, our platform offers a high degree of customization to meet your specific business needs and requirements. You can tailor various aspects of the service to align with your unique use case and industry requirements. Our team is also available to assist with custom integrations and features."
  },
  {
    question: "What kind of support does BARK BaaS offer?",
    answer: "We provide comprehensive support including detailed documentation, video tutorials, and direct assistance from our expert team to ensure your success with our platform. Our support channels include email, live chat, and scheduled consultations for more complex inquiries. We're committed to helping you every step of the way."
  },
  {
    question: "How does BARK BaaS handle scalability?",
    answer: "BARK BaaS is built on the Solana blockchain, known for its high throughput and low latency. Our platform is designed to scale seamlessly with your business needs, handling thousands of transactions per second. Whether you're a startup or an enterprise, BARK BaaS can accommodate your growth without compromising on performance."
  }
]

const FAQItem = ({ question, answer, isOpen, toggleOpen, index }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus()
    }
  }, [isOpen])

  return (
    <Card className="mb-4">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="flex justify-between items-center w-full py-4 px-6 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sand-100 rounded"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
        >
          <span className="text-lg font-semibold text-sand-800 dark:text-sand-200">{question}</span>
          <ChevronDown
            className={`h-5 w-5 text-sand-600 dark:text-sand-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              id={`faq-answer-${index}`}
              tabIndex={-1}
            >
              <p className="py-4 px-6 text-sand-600 dark:text-sand-300">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-sand-50 dark:bg-sand-900">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-sand-800 dark:text-sand-300">
          Frequently Asked Questions
        </h2>
        <p className="sr-only">The following is a list of frequently asked questions and their answers</p>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleOpen(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}