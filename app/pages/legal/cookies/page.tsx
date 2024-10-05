import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Cookie Policy | BARK BaaS Platform',
  description: 'Cookie Policy for the BARK Blockchain as a Service Platform',
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Cookie Policy</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">{new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. What Are Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Cookies are small pieces of data stored on your device (computer or mobile device) when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. How We Use Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use cookies to understand how you use our website and to improve our services. This includes personalizing content, providing social media features, and analyzing our traffic.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Types of Cookies We Use</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use both session cookies and persistent cookies. Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device until they expire or you delete them.
          </p>
        </section>
        {/* Add more sections as needed */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">10. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about our Cookie Policy, please contact us at{' '}
            <Link href="mailto:privacy@barkprotocol.com" className="text-primary hover:underline">
              privacy@barkprotocol.com
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}