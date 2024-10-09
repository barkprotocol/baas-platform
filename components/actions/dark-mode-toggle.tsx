import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react'

interface DarkModeToggleProps {
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
}

export default function DarkModeToggle({ isDarkMode, setIsDarkMode }: DarkModeToggleProps) {
  return (
    <Button variant="outline" onClick={() => setIsDarkMode(!isDarkMode)}>
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}