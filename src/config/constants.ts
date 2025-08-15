export const CORE_WRITER_ADDRESS =
  "0x3333333333333333333333333333333333333333" as const;
export const EXECUTOR_ADDRESS =
  "0xD997730828338eF3aeB7d74c4Aa495582D4BcE67" as const;
export const DELPHO_VAULT_ADDRESS =
  "0x9D8dc69f47C002dB49498390299cfA1001B82D79" as const;
export const DELPHO_STABLE_ADDRESS =
  "0xb9625769A20451c7797581f0a040DB7C3188199E" as const;
export const HYPERLEND_POOL_ADDRESS =
  "0x00A89d7a5A02160f20150EbEA7a2b5E4879A1A8b" as const;

export const ENCODING_VERSION = 1;
export const ACTION_IDS = {
  USDC_CLASS_TRANSFER: 7,
  LIMIT_ORDER: 1,
  SPOT_SEND: 6,
} as const;

export const TOKEN_IDS = {
  USDT: 1105n,
} as const;
export const PERP_IDS = {
  HYPE:159,
}
export const SPOT_IDS = {
  USDT:10_166,
}

export const MARKET_IDS = {
  USDT_USDC_SPOT: 11115,
  HYPE_PERP: 135,
} as const;

export const COIN_NAME_MAP: Record<string, string> = {
  "@1115": "USDT",
};
