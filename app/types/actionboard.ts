import { PublicKey } from '@solana/web3.js'

// Existing types
export type ActionType = 'transfer' | 'swap' | 'stake' | 'unstake' | 'claim' | 'mint' | 'burn' | 'vote' | 'propose' | 'liquidity' | 'governance'

export interface BaseAction {
  id: string
  name: string
  description: string
  type: ActionType
  requiredFields: string[]
  fee?: number
  minAmount?: number
  maxAmount?: number
  supportedCurrencies: string[]
  cooldownPeriod?: number
  icon?: string
  disabled?: boolean
  requiredPermissions?: string[]
}

export interface TransferAction extends BaseAction {
  type: 'transfer'
  recipientType: 'wallet' | 'contract'
}

export interface SwapAction extends BaseAction {
  type: 'swap'
  exchangeRate?: number
  slippageTolerance?: number
}

export interface StakeAction extends BaseAction {
  type: 'stake'
  lockupPeriod: number
  apr: number
}

export interface UnstakeAction extends BaseAction {
  type: 'unstake'
  penaltyRate?: number
}

export interface ClaimAction extends BaseAction {
  type: 'claim'
  rewardType: 'token' | 'nft'
}

export type Action = TransferAction | SwapAction | StakeAction | UnstakeAction | ClaimAction

export interface Currency {
  symbol: string
  name: string
  decimals: number
  mintAddress: PublicKey
  icon?: string
  currentPrice?: number
  change24h?: number
  totalSupply?: number
  marketCap?: number
  volume24h?: number
}

// New types for adding actions and currencies
export interface NewActionInput {
  name: string
  description: string
  type: ActionType
  requiredFields: string[]
  fee?: number
  minAmount?: number
  maxAmount?: number
  supportedCurrencies: string[]
  cooldownPeriod?: number
  icon?: string
  disabled?: boolean
  requiredPermissions?: string[]
  // Additional fields based on action type
  recipientType?: 'wallet' | 'contract'
  exchangeRate?: number
  slippageTolerance?: number
  lockupPeriod?: number
  apr?: number
  penaltyRate?: number
  rewardType?: 'token' | 'nft'
}

export interface NewCurrencyInput {
  symbol: string
  name: string
  decimals: number
  mintAddress: string
  icon?: string
  currentPrice?: number
  change24h?: number
  totalSupply?: number
  marketCap?: number
  volume24h?: number
}

export interface AddActionResult {
  success: boolean
  message: string
  action?: Action
  error?: string
}

export interface AddCurrencyResult {
  success: boolean
  message: string
  currency?: Currency
  error?: string
}

// Updated ActionBoardState to include add functions
export interface ActionBoardState {
  actions: Action[]
  currencies: Currency[]
  selectedAction: Action | null
  selectedCurrency: Currency | null
  userBalance: UserBalance
  recentActions: ActionResult[]
  pendingActions: ActionResult[]
  addAction: (newAction: NewActionInput) => Promise<AddActionResult>
  addCurrency: (newCurrency: NewCurrencyInput) => Promise<AddCurrencyResult>
}

// Existing interfaces (unchanged)
export interface UserBalance {
  [symbol: string]: {
    amount: number
    lockedAmount?: number
    stakingAmount?: number
  }
}

export interface ActionResult {
  id: string
  success: boolean
  message: string
  txHash?: string
  actionId: string
  actionType: ActionType
  amount: number
  currency: string
  timestamp: number
  fee?: number
  status: 'completed' | 'pending' | 'failed'
  details?: Record<string, any>
}

export interface ActionFilter {
  types?: ActionType[]
  minAmount?: number
  maxAmount?: number
  currencies?: string[]
  onlyEnabled?: boolean
}

export interface CurrencyFilter {
  minBalance?: number
  maxBalance?: number
  hasStaked?: boolean
  hasLocked?: boolean
}

export type ThemeType = 'light' | 'dark' | 'system'
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh'

export interface ActionBoardSettings {
  theme: ThemeType
  language: LanguageCode
  notifications: {
    enabled: boolean
    types: ('success' | 'error' | 'info')[]
  }
  autoLockPeriod: number
  gasPreference: 'low' | 'medium' | 'high'
  slippageTolerance: number
}

export interface ActionStats {
  totalActions: number
  totalVolume: number
  mostPopularAction: {
    id: string
    name: string
    count: number
  }
  mostUsedCurrency: {
    symbol: string
    volume: number
  }
  dailyActiveUsers: number
  averageActionSize: number
}

export type ActionHandler = (
  action: Action,
  currency: Currency,
  amount: number,
  additionalParams: Record<string, any>
) => Promise<ActionResult>

// Updated ActionBoardProps to include add functions
export interface ActionBoardProps {
  initialState: ActionBoardState
  onActionComplete: (result: ActionResult) => void
  onStateChange: (newState: ActionBoardState) => void
  settings: ActionBoardSettings
  customActions?: Action[]
  customCurrencies?: Currency[]
  actionHandler: ActionHandler
  getActionStats: () => Promise<ActionStats>
  onError: (error: Error) => void
  refreshInterval?: number
  maxRecentActions?: number
  supportedLanguages: LanguageCode[]
  permissionChecker?: (requiredPermissions: string[]) => boolean
  onAddAction: (newAction: NewActionInput) => Promise<AddActionResult>
  onAddCurrency: (newCurrency: NewCurrencyInput) => Promise<AddCurrencyResult>
}

export interface ActionValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export type ActionValidator = (
  action: Action,
  currency: Currency,
  amount: number,
  userBalance: UserBalance
) => ActionValidationResult