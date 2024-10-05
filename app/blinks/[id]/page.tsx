import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// This would typically come from an API or database
const getBlink = async (id: string) => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock data
  const blinks = {
    '1': { id: '1', name: 'Donation Blink', type: 'payment', amount: 5, description: 'Quick donation link', expirationDate: '2024-12-31', url: 'https://blink.bark.io/donate/1' },
    '2': { id: '2', name: 'Vote for Project', type: 'vote', description: 'Community vote for next project', expirationDate: '2024-06-30', url: 'https://blink.bark.io/vote/2' },
  }

  return blinks[id as keyof typeof blinks] || null
}

export default async function BlinkPage({ params }: { params: { id: string } }) {
  const blink = await getBlink(params.id)

  if (!blink) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/blinks">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to Blinks
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{blink.name}</CardTitle>
          <CardDescription>Blink ID: {blink.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{blink.type}</dd>
            </div>
            {blink.amount && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">{blink.amount} SOL</dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{blink.expirationDate}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{blink.description}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href={blink.url} target="_blank" rel="noopener noreferrer">
              Open Blink <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}