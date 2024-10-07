import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">404 - Page Not Found</CardTitle>
          </div>
          <CardDescription>
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            It seems you've stumbled upon a page that doesn't exist. This could be due to a mistyped URL or a page that has been moved or deleted.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/">
              Go back home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/donations">
              Make a donation
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}