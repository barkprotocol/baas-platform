import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Terms of Service | BARK BaaS Platform',
  description: 'Terms of Service for the BARK Blockchain as a Service Platform',
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Terms of Service</h1>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Acceptance of Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing or using the BARK Blockchain as a Service (BaaS) Platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Description of Service</h2>
          <p className="text-gray-700 dark:text-gray-300">
            BARK BaaS provides blockchain infrastructure and services based on the Solana blockchain. Our platform is designed to help businesses integrate blockchain technology into their operations.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. User Responsibilities</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.
          </p>
        </section>
        {/* Add more sections as needed */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">10. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about these Terms, please contact us at{' '}
            <Link href="mailto:legal@barkprotocol.com" className="text-primary hover:underline">
              legal@barkprotocol.com
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}