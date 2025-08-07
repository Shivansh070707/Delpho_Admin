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
  '@1115': 'USDT', 
};

export const CORE_WRITER_ABI = [
  {
    inputs: [{ name: "action", type: "bytes" }],
    name: "sendRawAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const EXECUTOR_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "CORE_WRITER_ADDRESS",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEBT_VARIABLE_ASSET",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "EXECUTOR_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "H_YIELD_ASSET",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_BPS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "USDT",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "USDT_SYSTEM_ADDRESS",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "WHYPE",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approvedLenders",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "borrowUSDT",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "clawBack",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "coreWriter",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract ICoreWriter" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "delphoOracle",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IDelphoOracle" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "delphoVault",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IDelphoVault" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "executeFullLoop",
    inputs: [
      { name: "withdrawAmount", type: "uint256", internalType: "uint256" },
      { name: "initialAmount", type: "uint256", internalType: "uint256" },
      { name: "flashloanAmount", type: "uint256", internalType: "uint256" },
      { name: "minAmountOut", type: "uint256", internalType: "uint256" },
      {
        name: "minInitialAmountOut",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "borrowUsdtAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getRoleAdmin",
    inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hyperLoop",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IHyperLoop" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hyperlendPool",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_hyperlendPool", type: "address", internalType: "address" },
      { name: "_swapper", type: "address", internalType: "address" },
      { name: "_delphoVault", type: "address", internalType: "address" },
      { name: "_hyperLoop", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mockDebtVariableToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IMockDebtVariableToken",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "openHypeShort",
    inputs: [
      { name: "isBuy", type: "bool", internalType: "bool" },
      { name: "limitPx", type: "uint64", internalType: "uint64" },
      { name: "sz", type: "uint64", internalType: "uint64" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "openLoopPosition",
    inputs: [
      { name: "_initialAmount", type: "uint256", internalType: "uint256" },
      { name: "_flashloanAmount", type: "uint256", internalType: "uint256" },
      { name: "_minAmountOut", type: "uint256", internalType: "uint256" },
      {
        name: "_minInitialAmountOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      {
        name: "callerConfirmation",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setHyperLoop",
    inputs: [{ name: "_hyperLoop", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setHyperlendPool",
    inputs: [
      { name: "_hyperlendPool", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setSwapper",
    inputs: [{ name: "_swapper", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "swapUSDT2USDC",
    inputs: [
      { name: "isBuy", type: "bool", internalType: "bool" },
      { name: "limitPx", type: "uint64", internalType: "uint64" },
      { name: "sz", type: "uint64", internalType: "uint64" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapper",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferUSDCFromSpotToPerp",
    inputs: [
      { name: "ntl", type: "uint64", internalType: "uint64" },
      { name: "toPerp", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferUSDT2Core",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferWhypeFromVault",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      { name: "newImplementation", type: "address", internalType: "address" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LenderApproved",
    inputs: [
      {
        name: "lender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "approved", type: "bool", indexed: true, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAdminChanged",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "previousAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "newAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleGranted",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleRevoked",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AccessControlBadConfirmation", inputs: [] },
  {
    type: "error",
    name: "AccessControlUnauthorizedAccount",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "neededRole", type: "bytes32", internalType: "bytes32" },
    ],
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  { type: "error", name: "Delpho__AddressZero", inputs: [] },
  { type: "error", name: "Delpho__InvalidBPS", inputs: [] },
  {
    type: "error",
    name: "ERC1967InvalidImplementation",
    inputs: [
      { name: "implementation", type: "address", internalType: "address" },
    ],
  },
  { type: "error", name: "ERC1967NonPayable", inputs: [] },
  { type: "error", name: "FailedCall", inputs: [] },
  { type: "error", name: "InvalidInitialization", inputs: [] },
  { type: "error", name: "NotInitializing", inputs: [] },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  { type: "error", name: "UUPSUnauthorizedCallContext", inputs: [] },
  {
    type: "error",
    name: "UUPSUnsupportedProxiableUUID",
    inputs: [{ name: "slot", type: "bytes32", internalType: "bytes32" }],
  },
];
