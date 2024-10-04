import React from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading = false,
  loadingText = "Submitting...",
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={`relative ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
      <span className={isLoading ? "pl-6" : ""}>
        {isLoading ? loadingText : children}
      </span>
    </Button>
  )
}

export default SubmitButton