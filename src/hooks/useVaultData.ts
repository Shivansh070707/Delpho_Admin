import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { DELPHO_STABLE_ABI, DELPHO_VAULT_ABI } from '../config/Abi';
import { hyperliquidMainnet } from '../config/chains';
import { DELPHO_STABLE_ADDRESS, DELPHO_VAULT_ADDRESS } from '../config/constants';

const client = createPublicClient({
    chain: hyperliquidMainnet,
    transport: http()
});

interface VaultMetrics {
    dusdMinted: number;
    totalBorrowed: number;
    totalCollateral: number;
}

export function useVaultData() {
    return useQuery<VaultMetrics>({
        queryKey: ['vaultData'],
        queryFn: async () => {
            try {
                const [dusdTotalSupply, totalBorrowed, totalCollateral] = await Promise.all([
                    client.readContract({
                        address: DELPHO_STABLE_ADDRESS as `0x${string}`,
                        abi: DELPHO_STABLE_ABI,
                        functionName: 'totalSupply'
                    }),
                    client.readContract({
                        address: DELPHO_VAULT_ADDRESS as `0x${string}`,
                        abi: DELPHO_VAULT_ABI,
                        functionName: 'totalBorrowed'
                    }),
                    client.readContract({
                        address: DELPHO_VAULT_ADDRESS as `0x${string}`,
                        abi: DELPHO_VAULT_ABI,
                        functionName: 'totalCollateral'
                    })
                ]);

                return {
                    dusdMinted: Number(dusdTotalSupply) / 1e6,
                    totalBorrowed: Number(totalBorrowed) / 1e6,
                    totalCollateral: Number(totalCollateral) / 1e18
                };
            } catch (error) {
                console.error('Error fetching vault data:', error);
                throw error;
            }
        } 
    });
}