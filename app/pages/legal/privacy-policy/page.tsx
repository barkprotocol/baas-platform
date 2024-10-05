import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Privacy Policy | BARK BaaS Platform',
  description: 'Privacy Policy for the BARK Blockchain as a Service Platform',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Privacy Policy</h1>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300">
            BARK BaaS Platform ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Blockchain as a Service platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We collect information that you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and blockchain wallet addresses.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to comply with legal obligations.
          </p>
        </section>
        {/* Add more sections as needed */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">10. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at{' '}
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