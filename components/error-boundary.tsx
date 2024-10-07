'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">Oops, there was an error!</h2>
      <p className="mb-4 text-center max-w-md">
        We're sorry, but something went wrong. Our team has been notified and we're working to fix it.
      </p>
      <div className="flex space-x-4">
        <Button onClick={resetErrorBoundary}>
          Try again
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Go to Home
        </Button>
      </div>
    </div>
  )
}

export default function ErrorBoundaryWrapper({ children }: ErrorBoundaryProps) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error)
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
      }}
      onError={(error, info) => {
        // Log the error to an error reporting service
        console.error('ErrorBoundary caught an error:', error, info)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}