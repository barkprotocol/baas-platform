import { Action, Currency } from '@/types/actionboard';

// Sample actions for Blinkboard
export const actions: Action[] = [
  {
    id: 'send',
    name: 'Send',
    description: 'Send funds to another user',
    icon: 'ArrowRight',
  },
  {
    id: 'receive',
    name: 'Receive',
    description: 'Receive funds from another user',
    icon: 'ArrowLeft',
  },
  {
    id: 'view-history',
    name: 'View History',
    description: 'View your transaction history',
    icon: 'Clock',
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Manage your account settings',
    icon: 'Cog',
  },
];

// Sample currencies supported on the Blinkboard
export const currencies: Currency[] = [
  {
    id: 'blink',
    name: 'BARK',
    symbol: 'BLINK',
    icon: '/images/icons/bark.png',
    decimals: 9,
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '/images/icons/usdc.png',
    decimals: 6,
  },
];

// Helper functions to retrieve actions and currencies
export const getActionById = (id: string): Action | undefined => {
  return actions.find(action => action.id === id);
};

export const getCurrencyById = (id: string): Currency | undefined => {
  return currencies.find(currency => currency.id === id);
};

export const getActionIcon = (actionId: string): string => {
  const action = getActionById(actionId);
  return action ? action.icon : '/images/default-action-icon.svg'; // Fallback to a default action icon
};

export const getCurrencyIcon = (currencyId: string): string => {
  const currency = getCurrencyById(currencyId);
  return currency ? currency.icon : '/images/default-currency-icon.svg'; // Fallback to a default currency icon
};
