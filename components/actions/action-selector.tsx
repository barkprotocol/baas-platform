import { Button } from "@/components/ui/button"
import { Action } from '@/app/types/blinkboard'

interface ActionSelectorProps {
  actions: Action[]
  selectedAction: Action
  setSelectedAction: (action: Action) => void
  isDarkMode: boolean
}

export default function ActionSelector({ actions, selectedAction, setSelectedAction, isDarkMode }: ActionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Button
          key={action.name}
          variant={selectedAction.name === action.name ? "default" : "outline"}
          className={`h-24 flex flex-col items-center justify-center text-center ${
            isDarkMode && selectedAction.name !== action.name ? 'hover:bg-gray-700' : ''
          }`}
          onClick={() => setSelectedAction(action)}
          aria-pressed={selectedAction.name === action.name}
          aria-label={`Select action: ${action.name}`}
        >
          <action.icon className={`h-6 w-6 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#D0BFB4]'}`} />
          <span className="text-sm">{action.name}</span>
        </Button>
      ))}
    </div>
  )
}
