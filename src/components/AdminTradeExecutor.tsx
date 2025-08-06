import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseUnits } from 'viem';
import { useCoreActions } from "../hooks/useCoreActions";
import { createHyperliquidClient } from "../utils/hyperliquid";

interface StepData {
  isBuy?: boolean;
  isLong?: boolean;
  price: number;
  positionSize: number;
}

interface TransferData {
  amount: number;
  direction: 'toPerp' | 'toSpot';
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
    direction: 'toPerp',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stepCompletionStatus, setStepCompletionStatus] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const hyperliquid = createHyperliquidClient({ testnet: false })

  const { swapUSDCToUSDT, transferUSDCToSpot, transferUSDCToPerp, openHypePosition } = useCoreActions();

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

      setStepCompletionStatus(prev => ({ ...prev, 1: true }));
      setStepData(data);
      setCurrentStep(2);
      alert("Swap completed successfully!");
    } catch (error) {
      console.error("Swap failed:", error);
      alert(`Swap failed: ${error instanceof Error ? error.message : String(error)}`);
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



      if (data.direction === 'toPerp') {

        await transferUSDCToPerp(parsedAmount);

      } else {
        await transferUSDCToSpot(parsedAmount);
      }

      return true;
    } catch (error) {
      console.error("Transfer failed:", error);
      alert(`Transfer failed: ${error instanceof Error ? error.message : String(error)}`);
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
        setStepCompletionStatus(prev => ({ ...prev, 2: true }));
        setIsModalOpen(false);
        if (currentStep < 3) {
          setCurrentStep(currentStep + 1);
        }
      } else if (currentStep === 3) {
        setIsLoading(true);
        const positionData = data as StepData;


        const tokenDetails = await hyperliquid.getTokenDetailsByName("USDC");


        if (!tokenDetails) throw new Error("Could not fetch HYPE token details");

        const decimals = tokenDetails.szDecimals;
        const parsedPrice = parseUnits(positionData.price.toString(), decimals);
        const parsedSize = parseUnits(positionData.positionSize.toString(), decimals);



        await openHypePosition(positionData.isLong ?? true, parsedPrice, parsedSize);

        setStepData(positionData);
        setStepCompletionStatus(prev => ({ ...prev, 3: true }));
        setIsModalOpen(false);
        alert("Position opened successfully!");
      }
    } catch (error) {
      console.error("Error in handleModalSubmit:", error);
      alert(`Operation failed: ${error instanceof Error ? error.message : String(error)}`);
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
    const [formData, setFormData] = useState<Record<string, unknown>>({});

    const fetchAndSetMidPrice = async () => {
      try {
        let price;
        if (currentStep === 1) {
          price = await hyperliquid.getAssetPrice('TZERO', false);
        }
        else {
          price = await hyperliquid.getAssetPrice('HYPE', true);
        }

        if (price !== null) {
          setFormData({
            ...formData,
            price: price,
          });
        }
      } catch (error) {
        console.error("Error fetching mid price:", error);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentStep === 1) {
        const price = formData.price as number;
        const positionSize = formData.positionSize as number;
        const minOrder = calculateMinOrderValue(price);

        if (positionSize < minOrder) {
          alert(`Order size too small. Minimum order is ${minOrder.toFixed(2)} tokens at this price.`);
          return;
        }

        const stepData: StepData = {
          isBuy: formData.isBuy as boolean,
          price: price,
          positionSize: positionSize,
        };
        handleModalSubmit(stepData);
      }
      else if (currentStep === 2) {


        const transferData: TransferData = {
          amount: formData.amount as number,
          direction: formData.direction as 'toPerp' | 'toSpot',
        };

        handleModalSubmit(transferData as TransferData);
      }
      else if (currentStep === 3) {


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
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isBuy"
                      value="true"
                      checked={formData.isBuy === true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isBuy: e.target.value === "true",
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Buy USDT </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isBuy"
                      value="false"
                      checked={formData.isBuy === false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isBuy: e.target.value === "true",
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Sell USDT </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Price (USDT per USDC)
                  <button
                    type="button"
                    onClick={fetchAndSetMidPrice}
                    className="ml-2 text-xs bg-[#1A2323] text-[#00FFB2] px-2 py-1 rounded hover:bg-[#2A3333] transition-colors"
                  >
                    Use Mid Price
                  </button>
                </label>
                <input
                  type="number"
                  value={typeof formData.price === "number" ? formData.price : ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) return;
                    setFormData({
                      ...formData,
                      price: value,
                    });
                  }}
                  min="0"
                  step="any"
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  USDT Amount
                </label>
                <input
                  type="number"
                  value={typeof formData.positionSize === "number" ? formData.positionSize : ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) return;
                    setFormData({
                      ...formData,
                      positionSize: value,
                    });
                  }}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder={`Enter USDT amount`}
                />
                {typeof formData.price === "number" && !isNaN(formData.price) && (
                  <p className="text-xs mt-2">
                    Minimum order: {calculateMinOrderValue(formData.price).toFixed(2)} {formData.isBuy ? "USDT" : "USDC"}
                    {typeof formData.positionSize === "number" &&
                      !isNaN(formData.positionSize) &&
                      formData.positionSize < calculateMinOrderValue(formData.price) && (
                        <span className="text-red-500 ml-2">Amount too small!</span>
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
                  value={(formData.amount as number) || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder="Enter USDC amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Transfer Direction
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="direction"
                      value="toPerp"
                      checked={formData.direction === 'toPerp'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direction: e.target.value as 'toPerp' | 'toSpot',
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Spot → Perp</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="direction"
                      value="toSpot"
                      checked={formData.direction === 'toSpot'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direction: e.target.value as 'toPerp' | 'toSpot',
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Perp → Spot</span>
                  </label>
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
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isLong"
                      value="true"
                      checked={formData.isLong === true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isLong: e.target.value === "true",
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Long</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isLong"
                      value="false"
                      checked={formData.isLong === false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isLong: e.target.value === "true",
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Short</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Price
                  <button
                    type="button"
                    onClick={fetchAndSetMidPrice}
                    className="ml-2 text-xs bg-[#1A2323] text-[#00FFB2] px-2 py-1 rounded hover:bg-[#2A3333] transition-colors"
                  >
                    Use Mid Price
                  </button>
                </label>
                <input
                  type="number"
                  value={(formData.price as number) || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Position Size
                </label>
                <input
                  type="number"
                  value={(formData.positionSize as number) || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      positionSize: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                  placeholder="Enter position size"
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
                {transferData.direction === 'toPerp' ? "Spot → Perp" : "Perp → Spot"}
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
        )
        }
      </div>
    );
  };

  return (
    <div className={`bg-[#0B1212] rounded-xl p-6 ${className}`}>
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