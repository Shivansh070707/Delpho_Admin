import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { DELPHO_STABLE_ABI } from '../config/Abi';
import { hyperliquidMainnet } from '../config/chains';
import { DELPHO_STABLE_ADDRESS } from '../config/constants';

const client = createPublicClient({
    chain: hyperliquidMainnet,
    transport: http()
});

interface VaultMetrics {
    dusdMinted: number;
}

export function useVaultData() {
    return useQuery<VaultMetrics>({
        queryKey: ['vaultData'],
        queryFn: async () => {
            try {

                const dusdTotalSupply = await client.readContract({
                    address: DELPHO_STABLE_ADDRESS as `0x${string}`,
                    abi: DELPHO_STABLE_ABI,
                    functionName: 'totalSupply'
                });
                return {
                    dusdMinted: Number(dusdTotalSupply) / 1e6
                };
            } catch (error) {
                console.error('Error fetching vault data:', error);
                throw error;
            }
        },
        staleTime: 60_000, // 1 minute
        refetchInterval: 300_000, // 5 minutes
    });
}