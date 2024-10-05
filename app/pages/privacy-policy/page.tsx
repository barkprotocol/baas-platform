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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, company information, and blockchain wallet addresses.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, and events.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We may also release information when its release is appropriate to comply with the law or protect our rights.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic storage system is completely secure.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You may update, correct, or delete your account information at any time by logging into your account or contacting us. You may also request to have your personal information deleted from our systems.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">7. Contact Us</h2>
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