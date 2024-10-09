import { PublicKey } from '@solana/web3.js'

// Action Types
export enum ActionType {
  Transfer = 'transfer',
  Swap = 'swap',
  Stake = 'stake',
  Unstake = 'unstake',
  Claim = 'claim',
  Mint = 'mint',
  Burn = 'burn',
  Vote = 'vote',
  Propose = 'propose',
  Liquidity = 'liquidity',
  Governance = 'governance',
}

// Base Action Interface
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

// Specific Action Interfaces
export interface TransferAction extends BaseAction {
  type: ActionType.Transfer
  recipientType: 'wallet' | 'contract'
}

export interface SwapAction extends BaseAction {
  type: ActionType.Swap
  exchangeRate?: number
  slippageTolerance?: number
}

export interface StakeAction extends BaseAction {
  type: ActionType.Stake
  lockupPeriod: number
  apr: number
}

export interface UnstakeAction extends BaseAction {
  type: ActionType.Unstake
  penaltyRate?: number
}

export interface ClaimAction extends BaseAction {
  type: ActionType.Claim
  rewardType: 'token' | 'nft'
}

// Action Union Type
export type Action = TransferAction | SwapAction | StakeAction | UnstakeAction | ClaimAction;

// Currency Interface
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

// New Action Input
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
  recipientType?: 'wallet' | 'contract'
  exchangeRate?: number
  slippageTolerance?: number
  lockupPeriod?: number
  apr?: number
  penaltyRate?: number
  rewardType?: 'token' | 'nft'
}

// New Currency Input
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

// Add Action and Currency Result Interfaces
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

// ActionBoard State
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

// User Balance Interface
export interface UserBalance {
  [symbol: string]: {
    amount: number
    lockedAmount?: number
    stakingAmount?: number
  }
}

// Action Result Interface
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

// Filters
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

// Settings
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

// Action Stats
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

// Action Handler Type
export type ActionHandler = (
  action: Action,
  currency: Currency,
  amount: number,
  additionalParams: Record<string, any>
) => Promise<ActionResult>

// Props for Action Board
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
