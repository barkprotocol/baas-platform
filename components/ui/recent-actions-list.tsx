import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RecentAction {
  id: string
  action: string
  status: 'Completed' | 'Pending' | 'Failed'
  timestamp: string
}

interface RecentActionsListProps {
  isLoading: boolean
  recentActions: RecentAction[]
  isDarkMode: boolean
}

export function RecentActionsList({ isLoading, recentActions, isDarkMode }: RecentActionsListProps) {
  return (
    <Card className={`mt-6 ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>
      <CardHeader>
        <CardTitle>Recent Actions</CardTitle>
        <CardDescription>Your most recent BARK Protocol actions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-4">
              {recentActions.map((action) => (
                <li key={action.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{action.action}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{action.timestamp}</span>
                  </div>
                  <Badge 
                    variant={action.status === 'Completed' ? 'success' : (action.status === 'Pending' ? 'warning' : 'destructive')}
                    className="mt-2 sm:mt-0"
                  >
                    {action.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}