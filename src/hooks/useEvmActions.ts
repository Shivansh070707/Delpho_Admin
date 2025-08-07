import { useAccount, useWalletClient } from "wagmi";
import { EXECUTOR_ADDRESS } from "../config/constants";
import { EXECUTOR_ABI } from "../config/Abi.ts";
import { useCallback } from "react";
import { waitForTransactionReceipt } from "viem/actions";
export function useEvmActions() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const executeEvmFlow = useCallback(
    async (
      withdrawAmount: bigint,
      initialAmount: bigint,
      flashloanAmount: bigint,
      minAmountOut: bigint,
      minInitialAmountOut: bigint,
      borrowUsdtAmount: bigint
    ) => {
      if (!walletClient || !address) throw new Error("Wallet not connected");
      const tx = await walletClient.writeContract({
        address: EXECUTOR_ADDRESS,
        abi: EXECUTOR_ABI,
        functionName: "executeFullLoop",
        args: [
          withdrawAmount,
          initialAmount,
          flashloanAmount,
          minAmountOut,
          minInitialAmountOut,
          borrowUsdtAmount,
        ],
        account: address,
      });

      await waitForTransactionReceipt(walletClient, {
        hash: tx as `0x${string}`,
      });
      return tx;
    },
    [walletClient, address]
  );

  return {
    executeEvmFlow,
  };
}
