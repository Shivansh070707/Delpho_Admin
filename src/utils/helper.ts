import { COIN_NAME_MAP } from "../config/constants";
import type { ClearinghouseState, SpotClearinghouseState } from "./hyperliquid";

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

  const truncatedPrice = Math.floor(calculatedPrice * 10000) / 10000;
  return truncatedPrice;

};
/**
 * Get spot balance for a specific asset
 * @param balances - The balances object from Hyperliquid API
 * @param assetName - The asset name to get balance for (e.g., "USDC")
 * @returns The balance as a number (0 if asset not found)
 */
export const getUserSpotBalance = (
    balances: SpotClearinghouseState,
    assetName: string
): number => {
    const assetBalance = balances.balances.find(
        (balance) => balance.coin === assetName
    );
    return assetBalance ? parseFloat(assetBalance.total) : 0;
};

/**
 * Get withdrawable balance from perpetual positions
 * @param positions - The positions object from Hyperliquid API
 * @returns The withdrawable balance as a number
 */
export const getUserPerpWithdrawableBalance = (
    positions: ClearinghouseState
): string => {
    return positions.withdrawable;
};
