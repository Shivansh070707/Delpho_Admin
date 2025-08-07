import React from "react";
import HomeSidebar from "../components/HomeSidebar";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";
import { useVaultData } from "../hooks/useVaultData";

interface VaultMetrics {
  delpho: string;
  totalCollateral: string;
  totalBorrowed: string;
  dusdMinted: string;
}

const VaultDashboard: React.FC = () => {
  const { data, isLoading, error } = useVaultData();

  const VAULT_METRICS: VaultMetrics[] = data ? [{
    delpho: "Delpho Vault",
    totalCollateral: Number(data.totalCollateral).toFixed(3),
    totalBorrowed: Number(data.totalBorrowed).toFixed(3),
    dusdMinted: Number(data.dusdMinted).toFixed(3),
  }] : [];

  return (
    <div className="min-h-screen flex bg-[#101616] text-[#E6FFF6]">
      <HomeSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <TopNav title="Delpho Vault Dashboard" />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6FFF6]"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 rounded bg-[#1A2323]">
            Error loading vault data
          </div>
        ) : (
          <div className="bg-[#0B1212] rounded-xl p-0 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[#A3B8B0] border-b border-[#1A2323]">
                  <th className="py-2 px-4 font-normal">Delpho</th>
                  <th className="py-2 px-4 font-normal">Total Collateral</th>
                  <th className="py-2 px-4 font-normal">Total Borrowed</th>
                  <th className="py-2 px-4 font-normal">dUSD Minted</th>
                </tr>
              </thead>
              <tbody>
                {VAULT_METRICS.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="border-b border-[#1A2323]"
                  >
                    <td className="py-2 px-4">{row.delpho}</td>
                    <td className="py-2 px-4">{row.totalCollateral}</td>
                    <td className="py-2 px-4">{row.totalBorrowed}</td>
                    <td className="py-2 px-4">{row.dusdMinted}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default VaultDashboard;