import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseUnits } from "viem";
import { useCoreActions } from "../hooks/useCoreActions";
import { createHyperliquidClient, type Position } from "../utils/hyperliquid";
import { useHyperliquid } from "../hooks/useHyperliquidData";
import { calculatePriceWithSlippage } from "../utils/helper";

interface StepData {
  isBuy?: boolean;
  isLong?: boolean;
  price: number;
  positionSize: number;
}

interface TransferData {
  amount: number;
  direction: "toPerp" | "toSpot";
}

interface FormData {
  isLong?: boolean;
  price?: number;
  positionSize?: number;
  positionPercentage?: number;
  availableToTrade?: number;
  currentPosition?: number;
  isBuy?: boolean;
  amount?: number;
  direction?: "toPerp" | "toSpot";
  slippage?: number;
  position?: Position;
  leverage?: number;
  collateral?: number;
}

interface AdminTradeExecutorProps {
  className?: string;
}

const AdminTradeExecutor: React.FC<AdminTradeExecutorProps> = ({
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stepData, setStepData] = useState<StepData>({
    isBuy: true,
    price: 0,
    positionSize: 0,
  });
  const [transferData, setTransferData] = useState<TransferData>({
    amount: 0,
    direction: "toPerp",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stepCompletionStatus, setStepCompletionStatus] = useState<
    Record<number, boolean>
  >({
    1: false,
    2: false,
    3: false,
  });

  const {
    getAssetPerpPosition,
    getSpotBalance,
    getPerpWithdrawableBalance
  } = useHyperliquid();

  const hyperliquid = createHyperliquidClient({ testnet: false });

  const {
    swapUSDCToUSDT,
    transferUSDCToSpot,
    transferUSDCToPerp,
    openHypePosition,
  } = useCoreActions();

  const steps = [
    {
      id: 1,
      title: "Swap USDC to USDT",
      description: "Configure swap parameters",
      completed: stepCompletionStatus[1],
    },
    {
      id: 2,
      title: "Transfer USDC to Perp Account",
      description: "Set transfer amount and destination",
      completed: stepCompletionStatus[2],
    },
    {
      id: 3,
      title: "Open Short Position",
      description: "Configure position parameters",
      completed: stepCompletionStatus[3],
    },
  ];

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    setIsModalOpen(true);
  };

  const calculateMinOrderValue = (price: number) => {
    return 10.1 / price;
  };

  const executeSwap = async (data: StepData) => {
    setIsLoading(true);
    try {
      const tokenDetails = await hyperliquid.getTokenDetailsByName("USDC");
      if (!tokenDetails) throw new Error("Could not fetch USDC token details");

      const decimals = tokenDetails.szDecimals;
      const parsedPrice = parseUnits(data.price.toString(), decimals);
      const parsedSize = parseUnits(data.positionSize.toString(), decimals);

      await swapUSDCToUSDT(data.isBuy as boolean, parsedPrice, parsedSize);

      setStepCompletionStatus((prev) => ({ ...prev, 1: true }));
      setStepData(data);
      setCurrentStep(2);
      alert("Swap completed successfully!");
    } catch (error) {
      console.error("Swap failed:", error);
      alert(
        `Swap failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const executeTransfer = async (data: TransferData) => {
    setIsLoading(true);
    try {
      const tokenDetails = await hyperliquid.getTokenDetailsByName("USDC");

      if (!tokenDetails) throw new Error("Could not fetch USDC token details");

      const decimals = 6;
      const parsedAmount = parseUnits(data.amount.toString(), decimals);

      if (data.direction === "toPerp") {
        await transferUSDCToPerp(parsedAmount);
      } else {
        await transferUSDCToSpot(parsedAmount);
      }

      return true;
    } catch (error) {
      console.error("Transfer failed:", error);
      alert(
        `Transfer failed: ${error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleModalSubmit = async (data: StepData | TransferData) => {
    try {
      if (currentStep === 1) {
        await executeSwap(data as StepData);
        setIsModalOpen(false);
      } else if (currentStep === 2) {
        await executeTransfer(data as TransferData);
        setTransferData(data as TransferData);
        setStepCompletionStatus((prev) => ({ ...prev, 2: true }));
        setIsModalOpen(false);
        if (currentStep < 3) {
          setCurrentStep(currentStep + 1);
        }
      } else if (currentStep === 3) {
        setIsLoading(true);
        const positionData = data as StepData;

        const tokenDetails = await hyperliquid.getTokenDetailsByName("USDC");

        if (!tokenDetails)
          throw new Error("Could not fetch HYPE token details");

        const decimals = tokenDetails.szDecimals;
        const parsedPrice = parseUnits(positionData.price.toString(), decimals);
        const parsedSize = parseUnits(
          positionData.positionSize.toString(),
          decimals
        );

        await openHypePosition(
          positionData.isLong ?? true,
          parsedPrice,
          parsedSize
        );

        setStepData(positionData);
        setStepCompletionStatus((prev) => ({ ...prev, 3: true }));
        setIsModalOpen(false);
        alert("Position opened successfully!");
      }
    } catch (error) {
      console.error("Error in handleModalSubmit:", error);
      alert(
        `Operation failed: ${error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${step.id === currentStep
                ? "bg-[#00FFB2] text-[#0B1212]"
                : step.completed
                  ? "bg-[#00FFB2] text-[#0B1212]"
                  : "bg-[#1A2323] text-[#A3B8B0]"
                }`}
              onClick={() => handleStepClick(step.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.completed ? "✓" : step.id}
            </motion.div>
            <div className="mt-2 text-center">
              <div
                className={`text-sm font-medium ${step.id === currentStep ? "text-[#E6FFF6]" : "text-[#A3B8B0]"
                  }`}
              >
                {step.title}
              </div>
              <div className="text-xs text-[#A3B8B0] mt-1">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${step.completed ? "bg-[#00FFB2]" : "bg-[#1A2323]"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const StepModal = () => {
    const [formData, setFormData] = useState<FormData>({
      isLong: false,
      isBuy: false,
      price: 0,
      positionPercentage: 0,
      availableToTrade: Number(getPerpWithdrawableBalance()),
      position: getAssetPerpPosition("HYPE"),
      currentPosition: 0,
      direction: "toPerp",
      slippage: 0.001,
      collateral: Number(getPerpWithdrawableBalance()),
      positionSize: Number(getSpotBalance("USDC")),
    });
    const [isPriceLoading, setIsPriceLoading] = useState(false);

    const fetchAndSetMidPrice = async () => {
      setIsPriceLoading(true);
      try {
        const asset = currentStep === 1 ? "USDT0" : "HYPE";
        const isPerp = currentStep !== 1;
        const price = await hyperliquid.getAssetPrice(asset, isPerp);

        if (price !== null) {
          setFormData(prev => ({
            ...prev,
            price: calculatePriceWithSlippage(
              price,
              prev.slippage || 0,
              currentStep === 1 ? (prev.isBuy ?? true) : (prev.isLong ?? true)
            )
          }));
        }
      } catch (error) {
        console.error("Error fetching mid price:", error);
      } finally {
        setIsPriceLoading(false);
      }
    };
     useEffect(() => {
      if (currentStep === 1 || currentStep === 3) {
        fetchAndSetMidPrice();
      }
    }, []);


    useEffect(() => {
      if (formData.price && formData.slippage !== undefined) {
        const directionMultiplier = currentStep === 1
          ? (formData.isBuy ? 1 : -1)
          : (formData.isLong ? 1 : -1);

        const newPrice = calculatePriceWithSlippage(
          formData.price / (1 + (formData.slippage * directionMultiplier)),
          formData.slippage,
          currentStep === 1 ? (formData.isBuy ?? true) : (formData.isLong ?? true)
        );

        setFormData(prev => ({ ...prev, price: newPrice }));
      }
    }, [formData.slippage, formData.isBuy, formData.isLong, formData.price]);

    const handleIsBuyChange = (isBuy: boolean) => {
      setFormData(prev => {
        // Calculate new price based on previous state
        const newPrice = prev.price && prev.slippage !== undefined
          ? calculatePriceWithSlippage(
            prev.price / (1 + (prev.slippage * (isBuy ? 1 : -1))),
            prev.slippage,
            isBuy
          )
          : prev.price;

        return {
          ...prev,
          isBuy,
          price: newPrice
        };
      });
    };
    const handleIsLongChange = (isLong: boolean) => {
      setFormData(prev => {
        const newPrice = prev.price && prev.slippage !== undefined
          ? calculatePriceWithSlippage(
            prev.price / (1 + (prev.slippage * (isLong ? 1 : -1))),
            prev.slippage,
            isLong
          )
          : prev.price;

        return {
          ...prev,
          isLong,
          price: newPrice
        };
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentStep === 1) {
        const price = formData.price as number;
        const positionSize = formData.positionSize as number;
        const minOrder = calculateMinOrderValue(price);

        if (positionSize < minOrder) {
          alert(
            `Order size too small. Minimum order is ${minOrder.toFixed(
              2
            )} tokens at this price.`
          );
          return;
        }

        const stepData: StepData = {
          isBuy: formData.isBuy as boolean,
          price: price,
          positionSize: positionSize,
        };
        handleModalSubmit(stepData);
      } else if (currentStep === 2) {
        const transferData: TransferData = {
          amount: formData.amount as number,
          direction: formData.direction as "toPerp" | "toSpot",
        };

        handleModalSubmit(transferData as TransferData);
      } else if (currentStep === 3) {
        const stepData: StepData = {
          isLong: formData.isLong as boolean,
          price: formData.price as number,
          positionSize: formData.positionSize as number,
        };
        handleModalSubmit(stepData);
      }
    };

    const getSubmitButtonText = () => {
      if (currentStep === 1) {
        return isLoading ? "Swapping..." : "Swap";
      }
      return "Continue";
    };
    const isAmountValid = () => {
      if (currentStep === 1) {
        const price = formData.price as number;
        const positionSize = formData.positionSize as number;
        return price && positionSize >= calculateMinOrderValue(price);
      }
      return true;
    };

    const renderStepForm = () => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Transaction Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleIsBuyChange(true)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${formData.isBuy === true
                      ? "bg-green-500 text-white"
                      : "bg-[#1A2323] text-[#A3B8B0] hover:bg-[#2A3333] hover:text-[#E6FFF6]"
                      }`}
                  >
                    Buy USDT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIsBuyChange(false)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${formData.isBuy === false
                      ? "bg-red-500 text-white"
                      : "bg-[#1A2323] text-[#A3B8B0] hover:bg-[#2A3333] hover:text-[#E6FFF6]"
                      }`}
                  >
                    Sell USDT
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A3B8B0]">
                <span>Slippage:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    value={
                      typeof formData.slippage === "number" &&
                        formData.slippage !== 0
                        ? formData.slippage
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData({
                          ...formData,
                          slippage: 0,
                        });
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          setFormData({
                            ...formData,
                            slippage: numValue,
                          });
                        }
                      }
                    }}
                    className="w-16 px-2 py-1 bg-[#1A2323] border border-[#2A3333] rounded text-[#E6FFF6] text-center focus:outline-none focus:border-[#00FFB2] transition-colors"
                  />
                  <span className="text-[#E6FFF6]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Price (USDT per USDC)
                  <button
                    type="button"
                    onClick={fetchAndSetMidPrice}
                    disabled={isPriceLoading}
                    className="ml-2 text-xs bg-[#1A2323] text-[#00FFB2] px-2 py-1 rounded hover:bg-[#2A3333] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPriceLoading ? "Loading..." : "Use Mid Price"}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={
                      typeof formData.price === "number" && formData.price !== 0
                        ? formData.price
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData({
                          ...formData,
                          price: 0,
                        });
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          setFormData({
                            ...formData,
                            price: numValue,
                          });
                        }
                      }
                    }}
                    min="0"
                    step="any"
                    className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                    placeholder={
                      isPriceLoading ? "Loading price..." : "Enter price"
                    }
                    disabled={isPriceLoading}
                  />
                  {isPriceLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00FFB2]"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  USDT Amount
                </label>


                <input
                  type="number"
                  value={
                    formData.isBuy ? (Number(getSpotBalance("USDC")) / formData.price!).toFixed(4) : getSpotBalance("USDT0").toFixed(4)
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setFormData({
                        ...formData,
                        positionSize: 0,
                      });
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        setFormData({
                          ...formData,
                          positionSize: numValue,
                        });
                      }
                    }
                  }}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder={`Enter USDT amount`}
                />
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs text-[#A3B8B0]">
                    <span>USDC Balance:</span>
                    <span className="text-[#E6FFF6] font-medium">
                      {getSpotBalance("USDC").toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#A3B8B0]">
                    <span>USDT Balance:</span>
                    <span className="text-[#E6FFF6] font-medium">
                      {getSpotBalance("USDT0").toFixed(2)} USDT
                    </span>
                  </div>
                </div>
                {typeof formData.price === "number" &&
                  !isNaN(formData.price) && (
                    <p className="text-xs mt-2">
                      Minimum order:{" "}
                      {calculateMinOrderValue(formData.price).toFixed(2)}{" "}
                      {formData.isBuy ? "USDT" : "USDC"}
                      {typeof formData.positionSize === "number" &&
                        !isNaN(formData.positionSize) &&
                        formData.positionSize <
                        calculateMinOrderValue(formData.price) && (
                          <span className="text-red-500 ml-2">
                            Amount too small!
                          </span>
                        )}
                    </p>
                  )}
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Amount (USDC)
                </label>
                <input
                  type="number"
                  value={
                    typeof formData.amount === "number" && formData.amount !== 0
                      ? formData.amount
                      : formData.direction === "toPerp"
                        ? Number(getSpotBalance("USDC"))
                        : Number(getPerpWithdrawableBalance())
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setFormData({
                        ...formData,
                        amount: 0,
                      });
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        setFormData({
                          ...formData,
                          amount: numValue,
                        });
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder="Enter USDC amount"
                />
                <div className="flex justify-between text-xs text-[#A3B8B0] mt-2">
                  <span>USDC Balance:</span>
                  <span className="text-[#E6FFF6] font-medium">
                    {formData.direction === "toPerp"
                      ? getSpotBalance("USDC").toFixed(2)
                      : Number(getPerpWithdrawableBalance()).toFixed(2)} USDC
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Transfer Direction
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, direction: "toPerp" })
                    }
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${formData.direction === "toPerp"
                      ? "bg-[#00FFB2] text-[#0B1212]"
                      : "bg-[#1A2323] text-[#A3B8B0] hover:bg-[#2A3333] hover:text-[#E6FFF6]"
                      }`}
                  >
                    Spot → Perp
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, direction: "toSpot" })
                    }
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${formData.direction === "toSpot"
                      ? "bg-[#00FFB2] text-[#0B1212]"
                      : "bg-[#1A2323] text-[#A3B8B0] hover:bg-[#2A3333] hover:text-[#E6FFF6]"
                      }`}
                  >
                    Perp → Spot
                  </button>
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Position Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleIsLongChange(true)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${formData.isLong === true
                      ? "bg-green-500 text-white"
                      : "bg-[#1A2323] text-[#A3B8B0] hover:bg-[#2A3333] hover:text-[#E6FFF6]"
                      }`}
                  >
                    Buy / Long
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIsLongChange(false)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${formData.isLong === false
                      ? "bg-red-500 text-white"
                      : "bg-[#1A2323] text-[#A3B8B0] hover:bg-[#2A3333] hover:text-[#E6FFF6]"
                      }`}
                  >
                    Sell / Short
                  </button>
                </div>
              </div>

              {/* Leverage slider */}
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Leverage (1-10x)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={formData.leverage || 1}
                      onChange={(e) => {
                        const leverage = parseFloat(e.target.value);
                        setFormData({
                          ...formData,
                          leverage: leverage,
                          positionSize: (formData.collateral || 0) * leverage,
                        });
                      }}
                      className="w-full h-3 bg-[#1A2323] rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #00FFB2 0%, #00FFB2 ${((formData.leverage || 1) - 1) * (100 / 9)
                          }%, #2A3333 ${((formData.leverage || 1) - 1) * (100 / 9)
                          }%, #2A3333 100%)`,
                        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                    {/* Slider thumb styles remain the same */}
                  </div>
                  <div className="flex items-center gap-2 bg-[#1A2323] border border-[#2A3333] rounded-lg px-3 py-2 focus-within:border-[#00FFB2] transition-colors">
                    <motion.input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={formData.leverage || 1}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setFormData({
                            ...formData,
                            leverage: 1,
                            positionSize: formData.collateral || 0,
                          });
                        } else {
                          const leverage = parseFloat(value);
                          if (!isNaN(leverage)) {
                            setFormData({
                              ...formData,
                              leverage: Math.min(Math.max(leverage, 1), 10),
                              positionSize: (formData.collateral || 0) * Math.min(Math.max(leverage, 1), 10),
                            });
                          }
                        }
                      }}
                      className="w-12 bg-transparent text-[#E6FFF6] text-center text-sm font-medium focus:outline-none"
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                    />
                    <span className="text-[#A3B8B0] text-sm font-medium">x</span>
                  </div>
                </div>
              </div>

              {/* Info display section */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3B8B0]">Available to Trade</span>
                  <span className="text-[#E6FFF6]">
                    {Number(formData.availableToTrade || 0).toFixed(2)} USDC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3B8B0]">Current Position</span>
                  <span className="text-blue-400">
                    {Math.abs(Number(formData.position?.szi)) || 0.0} HYPE
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3B8B0]">Position Size</span>
                  <span className="text-[#E6FFF6]">
                    {Number(formData.availableToTrade || 0).toFixed(2)} USDT
                  </span>
                </div>
              </div>


              <div className="flex items-center justify-between text-xs text-[#A3B8B0]">
                <span>Slippage:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    value={
                      typeof formData.slippage === "number" && formData.slippage !== 0
                        ? formData.slippage
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData({
                          ...formData,
                          slippage: 0,
                        });
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          setFormData({
                            ...formData,
                            slippage: numValue,
                          });
                        }
                      }
                    }}
                    className="w-16 px-2 py-1 bg-[#1A2323] border border-[#2A3333] rounded text-[#E6FFF6] text-center focus:outline-none focus:border-[#00FFB2] transition-colors"
                  />
                  <span className="text-[#E6FFF6]">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Price
                  <button
                    type="button"
                    onClick={fetchAndSetMidPrice}
                    disabled={isPriceLoading}
                    className="ml-2 text-xs bg-[#1A2323] text-[#00FFB2] px-2 py-1 rounded hover:bg-[#2A3333] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPriceLoading ? "Loading..." : "Use Mid Price"}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={
                      typeof formData.price === "number" && formData.price !== 0
                        ? formData.price
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData({
                          ...formData,
                          price: 0,
                        });
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          setFormData({
                            ...formData,
                            price: numValue,
                          });
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                    placeholder={isPriceLoading ? "Loading price..." : "Enter price"}
                    disabled={isPriceLoading}
                  />
                  {isPriceLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00FFB2]"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collateral input (USDT Amount) */}
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Enter USDT Amount
                </label>
                <input
                  type="number"
                  value={
                    formData.availableToTrade
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setFormData({
                        ...formData,
                        collateral: 0,
                        positionSize: 0,
                      });
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        setFormData({
                          ...formData,
                          collateral: numValue,
                          positionSize: numValue * (formData.leverage || 1),
                        });
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder="Enter USDT amount"
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0B1212]/95 backdrop-blur-md border border-[#1A2323]/50 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#E6FFF6]">
                  {steps[currentStep - 1].title}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#A3B8B0] hover:text-[#E6FFF6] cursor-pointer transition-colors p-1 rounded-full hover:bg-[#1A2323]"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderStepForm()}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-[#1A2323] text-[#E6FFF6] rounded-lg hover:bg-[#2A3333] transition-colors cursor-pointer font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isAmountValid()}
                    className="flex-1 px-4 py-3 bg-[#00FFB2] text-[#0B1212] rounded-lg font-semibold hover:bg-[#00E6A3] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {getSubmitButtonText()}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const CurrentStepDisplay = () => {
    const currentStepData = steps[currentStep - 1];

    return (
      <div className="bg-[#0B1212] rounded-xl p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#E6FFF6]">
            {currentStepData.title}
          </h3>
          <p className="text-[#A3B8B0] text-sm">
            {currentStepData.description}
          </p>
        </div>

        {currentStep === 1 ? (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[#A3B8B0]">Type:</span>
              <span className="ml-2 text-[#E6FFF6]">
                {stepData.isBuy ? "Buy" : "Sell"}
              </span>
            </div>
            <div>
              <span className="text-[#A3B8B0]">Price:</span>
              <span className="ml-2 text-[#E6FFF6]">
                ${stepData.price || "0"}
              </span>
            </div>
            <div>
              <span className="text-[#A3B8B0]">Size:</span>
              <span className="ml-2 text-[#E6FFF6]">
                {stepData.positionSize || "0"}
              </span>
            </div>
          </div>
        ) : currentStep === 2 ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#A3B8B0]">Amount:</span>
              <span className="ml-2 text-[#E6FFF6]">
                ${transferData.amount || "0"} USDC
              </span>
            </div>
            <div>
              <span className="text-[#A3B8B0]">Direction:</span>
              <span className="ml-2 text-[#E6FFF6]">
                {transferData.direction === "toPerp"
                  ? "Spot → Perp"
                  : "Perp → Spot"}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-[#A3B8B0]">Type:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {stepData.isLong ? "Long" : "Short"}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-[#0B1212] rounded-xl p-6 ${className}`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `,
        }}
      />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#E6FFF6]">
          Admin Trade Executor
        </h2>
        <div className="text-sm text-[#A3B8B0]">
          Step {currentStep} of {steps.length}
        </div>
      </div>

      <StepIndicator />

      <CurrentStepDisplay />

      <div className="flex gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="px-6 py-3 bg-[#1A2323] text-[#E6FFF6] rounded-lg hover:bg-[#2A3333] transition-colors disabled:opacity-50 cursor-pointer"
        >
          Configure Step {currentStep}
        </button>
      </div>

      <StepModal />
    </div>
  );
};

export default AdminTradeExecutor;
