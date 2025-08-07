import { COIN_NAME_MAP } from "../config/constants";

export function resolveCoinName(apiCoinName: string): string {
 
  if (COIN_NAME_MAP[apiCoinName]) {
    return COIN_NAME_MAP[apiCoinName];
  }
  return apiCoinName;
}

export function sortDirection(direction: string): string {
  if (direction === 'A') return 'Buy';
  if (direction === 'B') return 'Sell';
  return direction; 
}
export const calculatePriceWithSlippage = (price: number, slippage: number, isBuy: boolean) => {

  const slippageMultiplier = isBuy ? (1 + slippage) : (1 - slippage);
  const calculatedPrice = price * slippageMultiplier;
  

  return parseFloat(calculatedPrice.toFixed(4));
};