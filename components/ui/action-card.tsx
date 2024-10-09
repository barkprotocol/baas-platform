import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Action } from "@/app/types/actionboard"
import { Search } from 'lucide-react'

interface ActionCardProps {
  actions: Action[]
  selectedAction: Action
  setSelectedAction: (action: Action) => void
  isDarkMode: boolean
}

export function ActionCard({ actions, selectedAction, setSelectedAction, isDarkMode }: ActionCardProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredActions = actions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <Card className={`${isDarkMode ? "bg-gray-800 text-white" : ""} w-full max-w-md`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Select an Action</CardTitle>
        <CardDescription>Choose the action you want to perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Label htmlFor="search-actions" className="sr-only">Search actions</Label>
            <Input
              id="search-actions"
              type="text"
              placeholder="Search actions..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-2 gap-2">
              {filteredActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={() => setSelectedAction(action)}
                  variant={selectedAction.id === action.id ? "default" : "outline"}
                  className={`w-full justify-start text-left ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  aria-pressed={selectedAction.id === action.id}
                >
                  <span className="truncate">{action.name}</span>
                </Button>
              ))}
            </div>
            {filteredActions.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No actions found</p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}