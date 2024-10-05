import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Code, FileText, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BlinksDocumentation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blinks Documentation</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Learn how to use Blinks to create, manage, and interact with smart contracts on the Solana blockchain.
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="creation">Creation</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="interaction">Interaction</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>What are Blinks?</CardTitle>
              <CardDescription>Quick overview of Blinks in the BARK BaaS Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Blinks are smart contract templates that allow you to quickly deploy and interact with blockchain functionality on the Solana network. They provide a simplified interface for common blockchain operations, making it easier for developers to integrate blockchain features into their applications.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Pre-built smart contract templates</li>
                <li>Easy customization and deployment</li>
                <li>Simplified interaction through API endpoints</li>
                <li>Automatic security audits and optimizations</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/docs/blinks/getting-started">
                  Get Started with Blinks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="creation">
          <Card>
            <CardHeader>
              <CardTitle>Creating Blinks</CardTitle>
              <CardDescription>Learn how to create and deploy Blinks</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-4">
                <li>
                  <strong>Choose a template:</strong> Select from our library of pre-built Blink templates or start from scratch.
                </li>
                <li>
                  <strong>Customize your Blink:</strong> Modify the template to fit your specific needs using our visual editor or code interface.
                </li>
                <li>
                  <strong>Set parameters:</strong> Configure important parameters such as token supply, minting rules, or access controls.
                </li>
                <li>
                  <strong>Review and test:</strong> Use our built-in testing suite to ensure your Blink functions as expected.
                </li>
                <li>
                  <strong>Deploy:</strong> With a single click, deploy your Blink to the Solana blockchain.
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/docs/blinks/creation-guide">
                  Detailed Creation Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="management">
          <Card>
            <CardHeader>
              <CardTitle>Managing Blinks</CardTitle>
              <CardDescription>Tools and techniques for managing your deployed Blinks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Monitoring</h3>
                  <p>Use our dashboard to monitor the performance and usage of your Blinks in real-time.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upgrading</h3>
                  <p>Learn how to safely upgrade your Blinks to add new features or fix issues.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Access Control</h3>
                  <p>Manage who can interact with your Blinks and what actions they can perform.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/docs/blinks/management-tools">
                  Explore Management Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="interaction">
          <Card>
            <CardHeader>
              <CardTitle>Interacting with Blinks</CardTitle>
              <CardDescription>How to integrate Blinks into your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Use our RESTful API to interact with your Blinks from any application.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/docs/api">
                        API Documentation <Code className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SDK Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Integrate Blinks easily with our SDK available for multiple programming languages.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/docs/sdk">
                        SDK Guide <FileText className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/docs/blinks/integration-examples">
                  View Integration Examples <Send className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Getting Help</h2>
        <p className="mb-4">
          If you need assistance with Blinks or have any questions, our support team is here to help.
        </p>
        <Button asChild>
          <Link href="/support">
            Contact Support <Zap className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}