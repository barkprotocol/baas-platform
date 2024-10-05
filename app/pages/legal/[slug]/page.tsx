import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Legal Information | BARK BaaS Platform',
  description: 'Legal documents and policies for the BARK Blockchain as a Service Platform',
}

const legalDocuments = [
  {
    title: 'Terms of Service',
    description: 'Our terms of service outline the rules and guidelines for using the BARK BaaS Platform.',
    href: '/terms-of-service',
  },
  {
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information on our platform.',
    href: '/privacy-policy',
  },
  {
    title: 'Cookie Policy',
    description: 'Understand how we use cookies and similar technologies on our website.',
    href: '/cookies',
  },
]

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Legal Information</h1>
      <p className="text-lg mb-8 text-center text-gray-700 dark:text-gray-300">
        At BARK BaaS Platform, we are committed to transparency and compliance. Below you'll find our key legal documents and policies.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {legalDocuments.map((doc) => (
          <Card key={doc.title} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={doc.href} passHref>
                <Button variant="outline" className="w-full">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          If you have any questions about our legal documents or policies, please contact us at{' '}
          <Link href="mailto:legal@barkprotocol.com" className="text-primary hover:underline">
            legal@barkprotocol.com
          </Link>
          .
        </p>
      </div>
    </div>
  )
}