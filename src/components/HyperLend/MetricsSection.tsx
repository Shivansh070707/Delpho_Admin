import React from "react";
import { motion } from "framer-motion";
import MetricCard from "./MetricCard";

interface MetricsSectionProps {
  currentBalance: string;
  totalApy: string;
  totalApyChange: string;
  totalPoints: string;
  totalPointsChange: string;
  healthFactor: string;
  totalDeposited: string;
  depositedPerDay: string;
  totalBorrowed: string;
  borrowedPerDay: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  currentBalance,
  totalApy,
  totalApyChange,
  totalPoints,
  totalPointsChange,
  healthFactor,
  totalDeposited,
  depositedPerDay,
  totalBorrowed,
  borrowedPerDay,
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-[#0B1212] rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-stretch relative overflow-hidden w-full"
  >
    <div className="flex-1 w-full">
      <div className="text-[#A3B8B0] mb-2 flex items-center gap-2">
        <span>Unranked</span>
      </div>
      <h2 className="text-3xl font-bold mb-6">Welcome to HyperLend!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <MetricCard title="Current Balance" value={currentBalance} />
        <MetricCard
          title="Total APY"
          value={totalApy}
          subvalue={<span className="text-[#00FFB2]">{totalApyChange}</span>}
        />
        <MetricCard
          title="Total Points"
          value={totalPoints}
          subvalue={<span className="text-[#00FFB2]">{totalPointsChange}</span>}
        />
        <MetricCard
          title="Health Factor"
          value={<span className="text-[#FF4B4B]">{healthFactor}</span>}
        >
          <div className="w-full h-2 bg-[#1A2323] rounded-full mt-2">
            <div
              className="h-2 bg-[#FF4B4B] rounded-full transition-all duration-500"
              style={{
                width: healthFactor === "0" ? "0%" : healthFactor + "%",
              }}
            />
          </div>
        </MetricCard>
      </div>
    </div>
    {/* Right Card */}
    <div className="bg-[#101616] rounded-2xl p-6 min-w-[260px] flex flex-col gap-4 w-full max-w-xs shadow-md">
      <div>
        <span className="text-xs text-[#A3B8B0]">Total Deposited</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{totalDeposited}</span>
          <span className="text-xs text-[#00FFB2]">{depositedPerDay}</span>
        </div>
      </div>
      <div>
        <span className="text-xs text-[#A3B8B0]">Total Borrowed</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{totalBorrowed}</span>
          <span className="text-xs text-[#FF4B4B]">{borrowedPerDay}</span>
        </div>
      </div>
    </div>
  </motion.section>
);

export default MetricsSection;
