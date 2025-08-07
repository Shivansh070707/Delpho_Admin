import HomeSidebar from "../components/HomeSidebar";
import TopNav from "../components/TopNav";
import MetricsSection from "../components/HyperLend/MetricsSection";
import CollateralNotice from "../components/HyperLend/CollateralNotice";
import SupplyBorrowSection from "../components/HyperLend/SupplyBorrowSection";
import LoopCycleExecutor from "../components/LoopCycleExecutor";
import { useHyperLendData } from "../hooks/useHyperLendData";

const HyperLend: React.FC = () => {
  const { data, isLoading, error } = useHyperLendData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen flex bg-[#101616] text-[#E6FFF6]">
      <HomeSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <TopNav title="HyperEVM Dashboard" />

        <div className="my-8">
          <LoopCycleExecutor />
        </div>

        {/* MetricsSection now handles its own data fetching */}
        <MetricsSection />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6FFF6]"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 rounded bg-[#1A2323] mb-8">
            Error loading HyperLend data
          </div>
        ) : (
          <>
            <CollateralNotice>
              Supply assets as collateral to borrow.{" "}
              <a href="#" className="underline">
                Go to Markets
              </a>
            </CollateralNotice>
            <div className="flex gap-8 mb-8">
              <button className="px-6 py-2 rounded-full bg-[#0B1212] text-[#E6FFF6] font-semibold border-b-2 border-[#E6FFF6]">
                Core
              </button>
              <button className="px-6 py-2 rounded-full bg-[#0B1212] text-[#A3B8B0]">
                Isolated
              </button>
            </div>
            <SupplyBorrowSection
              suppliedText={
                data?.totalCollateral ? (
                  <span>
                    {formatCurrency(data.totalCollateral)} supplied
                  </span>
                ) : (
                  <span>
                    No assets yet! Supply some to{" "}
                    <a href="#" className="underline">
                      get started
                    </a>
                    .
                  </span>
                )
              }
              borrowedText={
                data?.totalDebt ? (
                  <span>
                    {formatCurrency(data.totalDebt)} borrowed
                  </span>
                ) : (
                  <span>
                    No borrowings yet!{" "}
                    <a href="#" className="underline">
                      Supply
                    </a>{" "}
                    collateral to start borrowing.
                  </span>
                )
              }
            />
          </>
        )}
      </main>
    </div>
  );
};

export default HyperLend;