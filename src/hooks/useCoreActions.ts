import { useAccount, useWalletClient } from 'wagmi';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { useCallback } from 'react';
import {
  CORE_WRITER_ADDRESS,
  ENCODING_VERSION,
  ACTION_IDS,
  TOKEN_IDS,
  MARKET_IDS,
  CORE_WRITER_ABI,
} from '../config/constants';
import { waitForTransactionReceipt } from 'viem/actions';

export function useCoreActions() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const buildAction = useCallback((
    actionId: number,
    abiParams: string,
    values: unknown[]
  ): `0x${string}` => {
    const versionByte = ENCODING_VERSION.toString(16).padStart(2, '0');
    const actionIdBytes = actionId.toString(16).padStart(6, '0');
    const actionData = encodeAbiParameters(
      parseAbiParameters(abiParams),
      values
    );

    return `0x${versionByte}${actionIdBytes}${actionData.slice(2)}`;
  }, []);

  const transferUSDC = useCallback(async (amount: bigint, toPerp: boolean) => {
    if (!walletClient || !address) throw new Error('Wallet not connected');

    const rawAction = buildAction(
      ACTION_IDS.USDC_CLASS_TRANSFER,
      'uint64 ntl, bool toPerp',
      [amount, toPerp]
    );


    const tx = await walletClient.writeContract({
      address: CORE_WRITER_ADDRESS,
      abi: CORE_WRITER_ABI,
      functionName: 'sendRawAction',
      args: [rawAction],
      account: address,
    });
    await waitForTransactionReceipt(walletClient, { hash: tx as `0x${string}` });
    return tx;
  }, [walletClient, address, buildAction]);

  const createOrder = useCallback(async (
    marketId: number,
    isBuy: boolean,
    limitPrice: bigint,
    size: bigint,
    options: {
      reduceOnly?: boolean;
      timeInForce?: number;
      orderId?: bigint;
    } = {}
  ) => {
    if (!walletClient || !address) throw new Error('Wallet not connected');

    const rawAction = buildAction(
      ACTION_IDS.LIMIT_ORDER,
      'uint32 assetId, bool isBuy, uint64 limitPx, uint64 sz, bool reduceOnly, uint8 tif, uint64 cloid',
      [
        marketId,
        isBuy,
        limitPrice,
        size,
        options.reduceOnly ?? false,
        options.timeInForce ?? 2,
        options.orderId ?? 0n
      ]
    );
    const tx = await walletClient.writeContract({
      address: CORE_WRITER_ADDRESS,
      abi: CORE_WRITER_ABI,
      functionName: 'sendRawAction',
      args: [rawAction],
      account: address,
    });
    await waitForTransactionReceipt(walletClient, { hash: tx as `0x${string}` });

    return tx;

  }, [walletClient, address, buildAction]);

  const transferToEVM = useCallback(async (
    recipient: `0x${string}`,
    tokenId: bigint,
    amount: bigint
  ) => {
    if (!walletClient || !address) throw new Error('Wallet not connected');

    const rawAction = buildAction(
      ACTION_IDS.SPOT_SEND,
      'address recipient, uint64 tokenId, uint64 weiAmount',
      [recipient, tokenId, amount]
    );

    const tx = await walletClient.writeContract({
      address: CORE_WRITER_ADDRESS,
      abi: CORE_WRITER_ABI,
      functionName: 'sendRawAction',
      args: [rawAction],
      account: address,
    });
    await waitForTransactionReceipt(walletClient, { hash: tx as `0x${string}` });
    return tx;
  }, [walletClient, address, buildAction]);

  const transferUSDCToSpot = useCallback(async (amount: bigint) => {
    return transferUSDC(amount, false);
  }, [transferUSDC]);
  const transferUSDCToPerp = useCallback(async (amount: bigint) => {
    return transferUSDC(amount, true);
  }, [transferUSDC]);

  const swapUSDCToUSDT = useCallback(async (isBuy: boolean, limitPrice: bigint, size: bigint) => {
    return createOrder(
      MARKET_IDS.USDT_USDC_SPOT,
      isBuy,
      limitPrice,
      size
    );
  }, [createOrder]);

  const openHypeShort = useCallback(async (limitPrice: bigint, size: bigint) => {
    return createOrder(
      MARKET_IDS.HYPE_PERP,
      false,
      limitPrice,
      size
    );
  }, [createOrder]);

  const transferUSDTToEVM = useCallback(async (amount: bigint) => {
    return transferToEVM(
      address!,
      TOKEN_IDS.USDT,
      amount
    );
  }, [transferToEVM, address]);

  const openHypePosition = useCallback(async (isLong: boolean, limitPrice: bigint, size: bigint) => {


    return createOrder(
      MARKET_IDS.HYPE_PERP,
      isLong,
      limitPrice,
      size
    );
  }, [createOrder]);

  return {
    transferUSDC,
    createOrder,
    transferToEVM,
    transferUSDCToSpot,
    openHypePosition,
    transferUSDCToPerp,
    swapUSDCToUSDT,
    openHypeShort,
    transferUSDTToEVM,
    constants: {
      TOKEN_IDS,
      MARKET_IDS,
    },
  };
}