'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Zap, Coins, FileText, Send, Repeat, PlusCircle, AlertCircle, ArrowLeft, Info, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import Image from 'next/image'

interface Action {
  name: string;
  icon: React.ElementType;
  description: string;
}

interface RecentAction {
  id: number;
  action: string;
  status: string;
  timestamp: string;
}

interface Currency {
  name: string;
  symbol: string;
  icon: string;
}

const actions: Action[] = [
  { name: 'Transfer', icon: Send, description: 'Send tokens to another wallet' },
  { name: 'Create Token', icon: Coins, description: 'Create a new SPL token' },
  { name: 'Deploy Program', icon: FileText, description: 'Deploy a Solana program' },
  { name: 'Swap Tokens', icon: Repeat, description: 'Swap between different tokens' },
  { name: 'Stake', icon: Zap, description: 'Stake your BARK tokens for rewards' },
  { name: 'Create NFT', icon: PlusCircle, description: 'Mint a new NFT' },
]

const currencies: Currency[] = [
  { name: 'Solana', symbol: 'SOL', icon: 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png' },
  { name: 'USD Coin', symbol: 'USDC', icon: 'https://ucarecdn.com/67e17a97-f3bd-46c0-8627-e13b8b939d26/usdc.png' },
  { name: 'BARK', symbol: 'BARK', icon: 'https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png' },
]

export default function ActionsPage() {
  const [selectedAction, setSelectedAction] = useState<string>(actions[0].name)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const [isSimulation, setIsSimulation] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    // Loading recent actions
    const timer = setTimeout(() => {
      setIsLoading(false)
      setRecentActions([
        { id: 1, action: 'Transfer Token', status: 'Completed', timestamp: new Date().toISOString() },
        { id: 2, action: 'Create SPL Token', status: 'Pending', timestamp: new Date().toISOString() },
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const actionMessage = isSimulation ? "simulated" : "submitted"
    toast({
      title: `Action ${actionMessage}`,
      description: `Your ${selectedAction} ${selectedCurrency.symbol} action has been ${actionMessage} successfully.`,
      duration: 5000,
    })
    // Add the new action to recent actions
    setRecentActions(prev => [{
      id: prev.length + 1,
      action: `${selectedAction} ${selectedCurrency.symbol}`,
      status: isSimulation ? 'Simulated' : 'Pending',
      timestamp: new Date().toISOString()
    }, ...prev])
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#fafafa]'}`}>
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Actionboard</h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link href="/" passHref>
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main
            </Button>
          </Link>
        </div>
      </div>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'} mb-8`}>
        Perform various actions on the Solana blockchain using our BARK Protocol interface.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : ''}>Available Actions</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>Select an action to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {actions.map((action) => (
                <Button
                  key={action.name}
                  variant={selectedAction === action.name ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center text-center ${
                    isDarkMode && selectedAction !== action.name ? 'hover:bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedAction(action.name)}
                >
                  <action.icon className={`h-6 w-6 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#D0BFB4]'}`} />
                  <span className="text-sm">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : ''}>{selectedAction} {selectedCurrency.symbol}</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
              {actions.find(a => a.name === selectedAction)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleActionSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency" className={isDarkMode ? 'text-gray-300' : ''}>Select Currency</Label>
                  <Select
                    value={selectedCurrency.symbol}
                    onValueChange={(value) => setSelectedCurrency(currencies.find(c => c.symbol === value) || currencies[0])}
                  >
                    <SelectTrigger id="currency" className={`w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol} className={isDarkMode ? 'text-white' : ''}>
                          <div className="flex items-center">
                            <Image
                              src={currency.icon}
                              alt={currency.name}
                              width={24}
                              height={24}
                              className="mr-2"
                            />
                            {currency.name} ({currency.symbol})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recipient" className={isDarkMode ? 'text-gray-300' : ''}>Recipient Address</Label>
                  <Input 
                    id="recipient" 
                    placeholder={`Enter recipient's ${selectedCurrency.name} address`} 
                    className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="amount" className={isDarkMode ? 'text-gray-300' : ''}>Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder={`Enter amount in ${selectedCurrency.symbol}`} 
                    className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                  />
                </div>
              </div>
              <Tabs defaultValue="basic" className="w-full mt-4">
                <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                  <TabsTrigger value="basic" className={isDarkMode ? 'data-[state=active]:bg-gray-600' : ''}>Basic</TabsTrigger>
                  <TabsTrigger value="advanced" className={isDarkMode ? 'data-[state=active]:bg-gray-600' : ''}>Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="memo" className={isDarkMode ? 'text-gray-300' : ''}>Memo (Optional)</Label>
                      <Input 
                        id="memo" 
                        placeholder="Enter a memo for this transaction" 
                        className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="data" className={isDarkMode ? 'text-gray-300' : ''}>Additional Data (Optional)</Label>
                      <Input 
                        id="data" 
                        placeholder="Enter any additional data" 
                        className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fee" className={isDarkMode ? 'text-gray-300' : ''}>Custom Fee (Optional)</Label>
                      <Input 
                        id="fee" 
                        type="number" 
                        placeholder="Enter custom fee" 
                        className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="simulation-mode"
                  checked={isSimulation}
                  onCheckedChange={setIsSimulation}
                />
                <Label htmlFor="simulation-mode" className={isDarkMode ? 'text-gray-300' : ''}>Simulation Mode</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
                    </TooltipTrigger>
                    <TooltipContent className={isDarkMode ? 'bg-gray-700 text-white' : ''}>
                      <p>Simulation mode allows you to test actions without executing them on the Solana blockchain.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleActionSubmit} className="w-full">
              {isSimulation ? 'Simulate' : 'Execute'} {selectedAction} <ArrowRight className="ml-2 h-4 w-4 text-[#010101]" />
            </Button>
          </CardFooter>
        </Card>
      </div>

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
    </div>
  )
}