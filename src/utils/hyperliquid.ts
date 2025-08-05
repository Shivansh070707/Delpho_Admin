import axios from 'axios';

export interface UserOpenOrder {
    coin: string;
    limitPx: string;
    oid: number;
    side: string;
    sz: string;
    timestamp: number;
}
export interface AllMids {
    [coin: string]: string;
}

export type UserOpenOrders = UserOpenOrder[];

export interface SpotClearinghouseState {
    balances: Array<{
        token: string;
        amount: string;
    }>;
}

export interface TokenDetails {
    name: string;
    maxSupply: string;
    totalSupply: string;
    circulatingSupply: string;
    szDecimals: number;
    weiDecimals: number;
    midPx: string;
    markPx: string;
    prevDayPx: string;
    genesis: {
        userBalances: [string, string][];
        existingTokenBalances: [number, string][];
    };
    deployer: string;
    deployGas: string;
    deployTime: string;
    seededUsdc: string;
    nonCirculatingUserBalances: string[];
    futureEmissions: string;
}

export interface SpotToken {
    name: string;
    szDecimals: number;
    weiDecimals: number;
    index: number;
    tokenId: string;
    isCanonical: boolean;
}

export interface SpotMarket {
    name: string;
    tokens: [number, number];
    index: number;
    isCanonical: boolean;
}

export interface SpotMeta {
    tokens: SpotToken[];
    universe: SpotMarket[];
}

export function createHyperliquidClient(options: { testnet?: boolean } = {}) {
    const baseUrl = options.testnet
        ? 'https://api.hyperliquid-testnet.xyz'
        : 'https://api.hyperliquid.xyz';

    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return {
        /**
         * Get user open orders (perpetual positions)
         * @param userAddress - User's wallet address
         */
        async getUserOpenOrders(userAddress: string): Promise<UserOpenOrders> {
            try {
                const response = await api.post('/info', {
                    type: 'userOpenOrders',
                    user: userAddress,
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching user open orders:', error);
                return [];
            }
        },

        /**
         * Get spot clearinghouse state (spot balances)
         * @param userAddress - User's wallet address
         */
        async getSpotClearinghouseState(userAddress: string): Promise<SpotClearinghouseState> {
            try {
                const response = await axios.post(`${baseUrl}/spotClearinghouseState`, {
                    user: userAddress,
                });
                return response.data || { balances: [] };
            } catch (error) {
                console.error('Error fetching spot clearinghouse state:', error);
                return { balances: [] };
            }
        },

        /**
         * Get all perpetual mid prices
         */
        async getAllMids(): Promise<AllMids> {
            try {
                const response = await api.post('/info', {
                    type: 'allMids',
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching perpetual mid prices:', error);
                return {};
            }
        },

        /**
         * Get spot metadata
         */
        async getSpotMeta(): Promise<SpotMeta> {
            try {
                const response = await api.post('/info', {
                    type: 'spotMeta',
                });
                return response.data || { tokens: [], universe: [] };
            } catch (error) {
                console.error('Error fetching spot meta:', error);
                return { tokens: [], universe: [] };
            }
        },

        /**
         * Get token details
         * @param tokenId - Token ID (as string to match API)
         */
        async getTokenDetails(tokenId: string): Promise<TokenDetails | null> {
            try {
                const response = await api.post('/info', {
                    tokenId: tokenId,
                    type: 'tokenDetails',
                });
                return response.data || null;
            } catch (error) {
                console.error('Error fetching token details:', error);
                return null;
            }
        },

        /**
         * Get token details by asset name
         * @param asset - Asset name
         */
        async getTokenDetailsByName(asset: string): Promise<TokenDetails | null> {
            try {
                const spotState = await this.getSpotMeta();
                const spotToken = spotState.tokens.find(
                    (token) => token.name.toUpperCase() === asset.toUpperCase()
                );

                if (spotToken) {
                    const tokenDetails = await this.getTokenDetails(spotToken.tokenId);
                    return tokenDetails;
                }
                return null;
            } catch (error) {
                console.error('Error fetching token details:', error);
                return null;
            }
        },

        /**
         * Get all perpetual positions for a user
         */
        async getPerpPositions(userAddress: string): Promise<UserOpenOrders> {
            return this.getUserOpenOrders(userAddress);
        },

        /**
         * Get all spot balances for a user
         */
        async getSpotBalances(userAddress: string): Promise<SpotClearinghouseState> {
            return this.getSpotClearinghouseState(userAddress);
        },

        /**
         * Get all user positions and balances
         */
        async getUserState(userAddress: string): Promise<{ positions: UserOpenOrders; balances: SpotClearinghouseState }> {
            try {
                const [positions, balances] = await Promise.all([
                    this.getPerpPositions(userAddress),
                    this.getSpotBalances(userAddress),
                ]);
                return { positions, balances };
            } catch (error) {
                console.error('Error fetching user state:', error);
                return { positions: [], balances: { balances: [] } };
            }
        },

        /**
         * Get price for a single asset
         */
        async getAssetPrice(asset: string, isPerp: boolean = false): Promise<number | null> {
            const assetKey = `${asset.toUpperCase()}`;

            try {
                if (isPerp) {
                    const allMids = await this.getAllMids();
                    if (allMids[assetKey]) {
                        return parseFloat(allMids[assetKey]);
                    }
                } else {
                    const spotState = await this.getSpotMeta();
                    const spotToken = spotState.tokens.find(
                        (token) => token.name.toUpperCase() === assetKey
                    );

                    if (spotToken) {
                        const tokenDetails = await this.getTokenDetails(spotToken.tokenId);
                                   
                        if (tokenDetails?.midPx) {
                            return parseFloat(tokenDetails.midPx);
                        }
                    }
                }

                console.warn(`Price not found for asset: ${asset}`);
                return null;
            } catch (error) {
                console.error(`Error fetching ${asset} price:`, error);
                return null;
            }
        }
    };
}

export type HyperliquidClient = ReturnType<typeof createHyperliquidClient>;