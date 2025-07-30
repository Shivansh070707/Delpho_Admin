import React from "react";
import HomeSidebar from "../components/HomeSidebar";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

const VAULT_METRICS = [
  {
    delpho: "Delpho Vault",
    total: "$1,000,000",
    assets: "5",
    totalSupplied: "$800,000",
    dusdcMinted: "$200,000",
  },
];

const VaultDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#101616] text-[#E6FFF6]">
      <HomeSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <TopNav title="Delpho Vault Dashboard" />
        <div className="bg-[#0B1212] rounded-xl p-0 min-h-[200px] overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[#A3B8B0] border-b border-[#1A2323]">
                <th className="py-2 px-4 font-normal">Delpho</th>
                <th className="py-2 px-4 font-normal">Total</th>
                <th className="py-2 px-4 font-normal">Assets</th>
                <th className="py-2 px-4 font-normal">Total Supplied</th>
                <th className="py-2 px-4 font-normal">dUSDC Minted</th>
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
                  <td className="py-2 px-4">{row.total}</td>
                  <td className="py-2 px-4">{row.assets}</td>
                  <td className="py-2 px-4">{row.totalSupplied}</td>
                  <td className="py-2 px-4">{row.dusdcMinted}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default VaultDashboard;
