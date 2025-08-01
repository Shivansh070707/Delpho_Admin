import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepData {
  isBuy: boolean;
  price: number;
  positionSize: number;
}

interface TransferData {
  amount: number;
  isPerp: boolean;
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
    isPerp: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Swap USDT to USDC",
      description: "Configure swap parameters",
      completed: false,
    },
    {
      id: 2,
      title: "Transfer USDC to Perp Account",
      description: "Set transfer amount and destination",
      completed: false,
    },
    {
      id: 3,
      title: "Open Short Position",
      description: "Configure position parameters",
      completed: false,
    },
  ];

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = (data: StepData | TransferData) => {
    if (currentStep === 1 || currentStep === 3) {
      setStepData(data as StepData);
    } else if (currentStep === 2) {
      setTransferData(data as TransferData);
    }

    setIsModalOpen(false);

    // Move to next step if not on last step
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const executeTransaction = async () => {
    setIsLoading(true);
    try {
      // Simulate transaction execution
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset for next execution
      setCurrentStep(1);
      setStepData({ isBuy: true, price: 0, positionSize: 0 });
      setTransferData({ amount: 0, isPerp: true });
      steps.forEach((step) => (step.completed = false));

      alert("Transaction executed successfully!");
    } catch {
      alert("Transaction failed. Please try again.");
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
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${
                step.id === currentStep
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
                className={`text-sm font-medium ${
                  step.id === currentStep ? "text-[#E6FFF6]" : "text-[#A3B8B0]"
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
              className={`flex-1 h-0.5 mx-4 ${
                step.completed ? "bg-[#00FFB2]" : "bg-[#1A2323]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const StepModal = () => {
    const [formData, setFormData] = useState<Record<string, unknown>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentStep === 1 || currentStep === 3) {
        const stepData: StepData = {
          isBuy: formData.isBuy as boolean,
          price: formData.price as number,
          positionSize: formData.positionSize as number,
        };
        handleModalSubmit(stepData);
      } else {
        const transferData: TransferData = {
          amount: formData.amount as number,
          isPerp: formData.isPerp as boolean,
        };
        handleModalSubmit(transferData);
      }
    };

    const renderStepForm = () => {
      switch (currentStep) {
        case 1:
        case 3:
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
                    <span className="text-[#E6FFF6]">Buy</span>
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
                    <span className="text-[#E6FFF6]">Sell</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Price
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
        case 2:
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Amount
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
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                  Destination
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isPerp"
                      value="true"
                      checked={formData.isPerp === true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPerp: e.target.value === "true",
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Perp Account</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isPerp"
                      value="false"
                      checked={formData.isPerp === false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPerp: e.target.value === "true",
                        })
                      }
                      className="mr-2 cursor-pointer"
                    />
                    <span className="text-[#E6FFF6]">Other</span>
                  </label>
                </div>
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
                    className="flex-1 px-4 py-3 bg-[#1A2323] text-[#E6FFF6] rounded-lg hover:bg-[#2A3333] transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#00FFB2] text-[#0B1212] rounded-lg font-semibold hover:bg-[#00E6A3] transition-colors cursor-pointer"
                  >
                    Continue
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

        {currentStep === 1 || currentStep === 3 ? (
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
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#A3B8B0]">Amount:</span>
              <span className="ml-2 text-[#E6FFF6]">
                ${transferData.amount || "0"}
              </span>
            </div>
            <div>
              <span className="text-[#A3B8B0]">Destination:</span>
              <span className="ml-2 text-[#E6FFF6]">
                {transferData.isPerp ? "Perp Account" : "Other"}
              </span>
            </div>
          </div>
        )}
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

        {currentStep === 3 && (
          <button
            onClick={executeTransaction}
            disabled={isLoading || !steps.every((step) => step.completed)}
            className="px-6 py-3 bg-[#00FFB2] text-[#0B1212] rounded-lg font-semibold hover:bg-[#00E6A3] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Executing..." : "Execute Transaction"}
          </button>
        )}
      </div>

      <StepModal />
    </div>
  );
};

export default AdminTradeExecutor;
