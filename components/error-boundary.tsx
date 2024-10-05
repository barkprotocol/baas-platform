'use client'

import React from 'react'
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
          <h2 className="text-2xl font-bold mb-4">Oops, there was an error!</h2>
          <p className="mb-4 text-center max-w-md">
            We're sorry, but something went wrong. Our team has been notified and we're working to fix it.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function ErrorBoundaryWrapper({ children }: ErrorBoundaryProps) {
  useEffect(() => {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global error caught:', error)
    }

    return () => {
      window.onerror = null
    }
  }, [])

  return <ErrorBoundary>{children}</ErrorBoundary>
}