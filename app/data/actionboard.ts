import { Action, Currency } from '@/types/actionboard'

export const actions: Action[] = [
  {
    id: 'transfer',
    name: 'Transfer',
    description: 'Transfer BARK tokens to another wallet',
    icon: 'ArrowRight',
  },
  {
    id: 'stake',
    name: 'Stake',
    description: 'Stake your BARK tokens to earn rewards',
    icon: 'LockClosed',
  },
  {
    id: 'unstake',
    name: 'Unstake',
    description: 'Unstake your BARK tokens',
    icon: 'Unlock',
  },
  {
    id: 'claim-rewards',
    name: 'Claim Rewards',
    description: 'Claim your staking rewards',
    icon: 'Gift',
  },
  {
    id: 'governance',
    name: 'Governance',
    description: 'Participate in BARK Protocol governance',
    icon: 'Vote',
  },
  {
    id: 'swap',
    name: 'Swap',
    description: 'Swap BARK tokens for other cryptocurrencies',
    icon: 'Repeat',
  },
]

export const currencies: Currency[] = [
  {
    id: 'bark',
    name: 'BARK',
    symbol: 'BARK',
    icon: '/images/bark-icon.svg',
    decimals: 9,
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    icon: '/images/solana-icon.svg',
    decimals: 9,
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '/images/usdc-icon.svg',
    decimals: 6,
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    icon: '/images/usdt-icon.svg',
    decimals: 6,
  },
]

export const getActionById = (id: string): Action | undefined => {
  return actions.find(action => action.id === id)
}

export const getCurrencyById = (id: string): Currency | undefined => {
  return currencies.find(currency => currency.id === id)
}

export const getActionIcon = (actionId: string): string => {
  const action = getActionById(actionId)
  return action ? action.icon : 'QuestionMark'
}

export const getCurrencyIcon = (currencyId: string): string => {
  const currency = getCurrencyById(currencyId)
  return currency ? currency.icon : '/images/default-currency-icon.svg'
}