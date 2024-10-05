import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | BARK BaaS Platform',
  description: 'Cookie Policy for the BARK Blockchain as a Service Platform',
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p className="mb-4">
        This Cookie Policy explains how BARK BaaS Platform uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
      </p>
      {/* Add more content here */}
    </div>
  )
}