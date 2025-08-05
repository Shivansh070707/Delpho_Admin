
export const CORE_WRITER_ADDRESS = '0x3333333333333333333333333333333333333333' as const;

export const ENCODING_VERSION = 1;
export const ACTION_IDS = {
    USDC_CLASS_TRANSFER: 7,
    LIMIT_ORDER: 1,
    SPOT_SEND: 6,
} as const;

export const TOKEN_IDS = {
    USDT: 1105n,
} as const;

export const MARKET_IDS = {
    USDT_USDC_SPOT: 11115,
    HYPE_PERP: 135,
} as const;

export const CORE_WRITER_ABI = [
    {
        inputs: [{ name: "action", type: "bytes" }],
        name: "sendRawAction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;