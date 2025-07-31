import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { type Chain} from 'wagmi/chains';
import { http } from 'viem';
import { hyperliquidMainnet, hyperliquidTestnet } from './chains';


export const appChains: readonly [Chain, ...Chain[]] = [
  hyperliquidMainnet,
  hyperliquidTestnet,
] as const;


export const config = getDefaultConfig({
  appName: 'Delpho Admin',
  projectId: 'Delpho Admin',
  chains: appChains,
  transports: {
    [hyperliquidMainnet.id]: http(),
    [hyperliquidTestnet.id]: http(),
  },
  ssr: false,
});

import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient();