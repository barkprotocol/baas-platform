import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertCircle, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ActionResult } from '@/types/actionboard'

interface RecentActionsProps {
  isLoading: boolean
  recentActions: ActionResult[]
  isDarkMode: boolean
}

export default function RecentActions({ isLoading, recentActions, isDarkMode }: RecentActionsProps) {
  return (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Recent Actions</h2>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className={`h-12 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
          <Skeleton className={`h-12 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
          <Skeleton className={`h-12 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
        </div>
      ) : recentActions.length > 0 ? (
        <AnimatePresence>
          {recentActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`mb-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>{action.action}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      {new Date(action.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      action.status === 'Completed' ? 'default' : 
                      action.status === 'Simulated' ? 'secondary' : 
                      'outline'
                    }
                    className={isDarkMode ? 'border-gray-600' : ''}
                  >
                    {action.status}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <Alert className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className={isDarkMode ? 'text-white' : ''}>No recent actions</AlertTitle>
          <AlertDescription className={isDarkMode ? 'text-gray-400' : ''}>
            Your executed actions will appear here once you perform them.
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  )
}