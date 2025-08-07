
import { useSelector, useDispatch } from "react-redux";
import { type RootState,type AppDispatch } from "../store";
import {
  updateCompleteState,
  updateBalances,
  updatePositions,
  updateOpenOrders,
  updateTradeHistory,
  updateFundingHistory,
  updateOrderHistory,
  updateActiveTWAPs,
  setLoading,
  setError,
} from "../features/hyperliquidSlice";
import {
  createHyperliquidClient
} from "../utils/hyperliquid";
import { EXECUTOR_ADDRESS } from "../config/constants";

export const useHyperliquid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hyperliquidState = useSelector((state: RootState) => state.hyperliquid);

  const hyperliquidClient = createHyperliquidClient({ testnet: false });


  const getSpotBalance = (assetName:string): number => {
    const usdcBalance = hyperliquidState.balances.balances.find(
      (balance) => balance.coin === assetName
    );
    return usdcBalance ? parseFloat(usdcBalance.total) : 0;
  };

  const fetchCompleteState = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const completeState = await hyperliquidClient.getCompleteUserState(
        EXECUTOR_ADDRESS
      );
      dispatch(updateCompleteState(completeState));
    } catch (err) {
      console.error("Error fetching Hyperliquid data:", err);
      dispatch(
        setError("Failed to load data. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchBalances = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const balances = await hyperliquidClient.getSpotClearinghouseState(
        EXECUTOR_ADDRESS
      );
      dispatch(updateBalances(balances));
    } catch (err) {
      console.error("Error fetching balances:", err);
      dispatch(
        setError("Failed to load balances. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchPositions = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const positions = await hyperliquidClient.getPerpPositions(
        EXECUTOR_ADDRESS
      );
      dispatch(updatePositions(positions));
    } catch (err) {
      console.error("Error fetching positions:", err);
      dispatch(
        setError("Failed to load positions. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchOpenOrders = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const openOrders = await hyperliquidClient.getUserOpenOrders(
        EXECUTOR_ADDRESS
      );
      dispatch(updateOpenOrders(openOrders));
    } catch (err) {
      console.error("Error fetching open orders:", err);
      dispatch(
        setError("Failed to load open orders. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchTradeHistory = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const tradeHistory = await hyperliquidClient.getTradeHistory(
        EXECUTOR_ADDRESS
      );
      dispatch(updateTradeHistory(tradeHistory));
    } catch (err) {
      console.error("Error fetching trade history:", err);
      dispatch(
        setError("Failed to load trade history. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchFundingHistory = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const fundingHistory = await hyperliquidClient.getFundingHistory(
        EXECUTOR_ADDRESS
      );
      dispatch(updateFundingHistory(fundingHistory));
    } catch (err) {
      console.error("Error fetching funding history:", err);
      dispatch(
        setError("Failed to load funding history. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchOrderHistory = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const orderHistory = await hyperliquidClient.getOrderHistory(
        EXECUTOR_ADDRESS
      );
      dispatch(updateOrderHistory(orderHistory));
    } catch (err) {
      console.error("Error fetching order history:", err);
      dispatch(
        setError("Failed to load order history. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchActiveTWAPs = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const activeTWAPs = await hyperliquidClient.getActiveTWAPOrders(
        EXECUTOR_ADDRESS
      );
      dispatch(updateActiveTWAPs(activeTWAPs));
    } catch (err) {
      console.error("Error fetching active TWAPs:", err);
      dispatch(
        setError("Failed to load active TWAPs. Please try again later.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    ...hyperliquidState,
    getSpotBalance,
    fetchCompleteState,
    fetchBalances,
    fetchPositions,
    fetchOpenOrders,
    fetchTradeHistory,
    fetchFundingHistory,
    fetchOrderHistory,
    fetchActiveTWAPs,
  };
};