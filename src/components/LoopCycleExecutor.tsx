import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvmActions } from "../hooks/useEvmActions";

interface LoopCycleData {
  withdrawAmount: number;
  initialAmount: number;
  flashloanAmount: number;
  minAmountOut: number;
  minInitialAmountOut: number;
  borrowUsdtAmount: number;
}

const LoopCycleExecutor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loopCycleData, setLoopCycleData] = useState<LoopCycleData>({
    withdrawAmount: 0,
    initialAmount: 0,
    flashloanAmount: 0,
    minAmountOut: 0,
    minInitialAmountOut: 0,
    borrowUsdtAmount: 0,
  });

  const { executeEvmFlow } = useEvmActions();

  const executeLoopCycle = async (data: LoopCycleData) => {
    setIsLoading(true);
    try {
      console.log("Executing loop cycle with data:", data);

      await executeEvmFlow();

      alert("Loop cycle executed successfully!");
      setLoopCycleData(data);
    } catch (error) {
      console.error("Loop cycle failed:", error);
      alert(
        `Loop cycle failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const LoopCycleModal = () => {
    const [formData, setFormData] = useState<LoopCycleData>(loopCycleData);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      executeLoopCycle(formData);
      setIsModalOpen(false);
    };

    const isFormValid = () => {
      return Object.values(formData).every((value) => value > 0);
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
              className="bg-[#0B1212]/95 backdrop-blur-md border border-[#1A2323]/50 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#E6FFF6]">
                  Configure Loop Cycle Parameters
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                      Withdraw Amount (WHYPE)
                    </label>
                    <input
                      type="number"
                      value={formData.withdrawAmount || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) return;
                        setFormData({ ...formData, withdrawAmount: value });
                      }}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                      placeholder="Enter withdraw amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                      Initial Amount
                    </label>
                    <input
                      type="number"
                      value={formData.initialAmount || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) return;
                        setFormData({ ...formData, initialAmount: value });
                      }}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                      placeholder="Enter initial amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                      Flashloan Amount
                    </label>
                    <input
                      type="number"
                      value={formData.flashloanAmount || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) return;
                        setFormData({ ...formData, flashloanAmount: value });
                      }}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                      placeholder="Enter flashloan amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                      Min Amount Out
                    </label>
                    <input
                      type="number"
                      value={formData.minAmountOut || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) return;
                        setFormData({ ...formData, minAmountOut: value });
                      }}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                      placeholder="Enter min amount out"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                      Min Initial Amount Out
                    </label>
                    <input
                      type="number"
                      value={formData.minInitialAmountOut || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) return;
                        setFormData({
                          ...formData,
                          minInitialAmountOut: value,
                        });
                      }}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                      placeholder="Enter min initial amount out"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6FFF6] mb-2">
                      Borrow USDT Amount
                    </label>
                    <input
                      type="number"
                      value={formData.borrowUsdtAmount || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) return;
                        setFormData({ ...formData, borrowUsdtAmount: value });
                      }}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-[#1A2323] border border-[#2A3333] rounded-lg text-[#E6FFF6] focus:outline-none focus:border-[#00FFB2] cursor-text"
                      placeholder="Enter borrow USDT amount"
                    />
                  </div>
                </div>

                <div className="bg-[#1A2323] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-[#E6FFF6] mb-2">
                    Loop Cycle Process:
                  </h4>
                  <div className="text-xs text-[#A3B8B0] space-y-1">
                    <div>1. Withdraw WHYPE from vault</div>
                    <div>2. Open leveraged position via flashloan and swap</div>
                    <div>3. Borrow USDT</div>
                    <div>4. Transfer borrowed USDT to HyperCore</div>
                  </div>
                </div>

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
                    disabled={isLoading || !isFormValid()}
                    className="flex-1 px-4 py-3 bg-[#00FFB2] text-[#0B1212] rounded-lg font-semibold hover:bg-[#00E6A3] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "Executing..." : "Execute Loop Cycle"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-[#0B1212] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#E6FFF6]">
            Loop Cycle Executor
          </h2>
          <p className="text-[#A3B8B0] text-sm mt-1">
            Execute a full leveraged loop cycle with flashloan and position
            management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00FFB2] rounded-full animate-pulse"></div>
          <span className="text-sm text-[#A3B8B0]">Ready</span>
        </div>
      </div>

      <div className="bg-[#0B1212] rounded-xl p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#E6FFF6]">
            Current Configuration
          </h3>
          <p className="text-[#A3B8B0] text-sm">
            Configure parameters for the leveraged loop cycle execution
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#A3B8B0]">Withdraw Amount:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {loopCycleData.withdrawAmount || "0"} WHYPE
            </span>
          </div>
          <div>
            <span className="text-[#A3B8B0]">Initial Amount:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {loopCycleData.initialAmount || "0"}
            </span>
          </div>
          <div>
            <span className="text-[#A3B8B0]">Flashloan Amount:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {loopCycleData.flashloanAmount || "0"}
            </span>
          </div>
          <div>
            <span className="text-[#A3B8B0]">Min Amount Out:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {loopCycleData.minAmountOut || "0"}
            </span>
          </div>
          <div>
            <span className="text-[#A3B8B0]">Min Initial Amount Out:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {loopCycleData.minInitialAmountOut || "0"}
            </span>
          </div>
          <div>
            <span className="text-[#A3B8B0]">Borrow USDT Amount:</span>
            <span className="ml-2 text-[#E6FFF6]">
              {loopCycleData.borrowUsdtAmount || "0"} USDT
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="px-6 py-3 bg-[#00FFB2] text-[#0B1212] rounded-lg font-semibold hover:bg-[#00E6A3] transition-colors disabled:opacity-50 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? "Executing..." : "Start Loop Cycle"}
        </motion.button>
      </div>

      <LoopCycleModal />
    </div>
  );
};

export default LoopCycleExecutor;
