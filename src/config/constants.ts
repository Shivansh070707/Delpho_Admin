export const CORE_WRITER_ADDRESS =
  "0x3333333333333333333333333333333333333333" as const;
export const EXECUTOR_ADDRESS =
  "0x2f0Daf6529e5c2109E46942f0b9b09E827D2656B" as const;
export const DELPHO_VAULT_ADDRESS =
  "0x1a2ea38aE7A88d2666451Bd365Ed6Fc0Ba280985" as const;
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

export const MARKET_IDS = {
  USDT_USDC_SPOT: 11115,
  HYPE_PERP: 135,
} as const;

export const COIN_NAME_MAP: Record<string, string> = {
  "@1115": "USDT",
};
