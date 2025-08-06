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