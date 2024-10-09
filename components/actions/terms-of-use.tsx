import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { BookOpen } from 'lucide-react'
  
  interface TermsOfUseProps {
    isDarkMode: boolean
  }
  
  export default function TermsOfUse({ isDarkMode }: TermsOfUseProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Terms of Use
          </Button>
        </DialogTrigger>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
          <DialogHeader>
            <DialogTitle>Terms of Use</DialogTitle>
            <DialogDescription>
              Please read our terms of use carefully before using the BARK platform.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
            <p>By using the BARK platform, you agree to be bound by these Terms of Use.</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">2. Use of Services</h3>
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">3. Privacy Policy</h3>
            <p>Your use of the BARK platform is also governed by our Privacy Policy.</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">4. Modifications to Terms</h3>
            <p>We reserve the right to modify these Terms at any time. Please review them regularly.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }