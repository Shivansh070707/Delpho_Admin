import HomeSidebar from "../components/HomeSidebar";
import TopNav from "../components/TopNav";
import MetricsSection from "../components/HyperLend/MetricsSection";
import CollateralNotice from "../components/HyperLend/CollateralNotice";
import SupplyBorrowSection from "../components/HyperLend/SupplyBorrowSection";
import AdminTradeExecutor from "../components/AdminTradeExecutor";

const HyperLend: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#101616] text-[#E6FFF6]">
      <HomeSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <TopNav title="HyperLend Dashboard" />

        <div className="my-8">
          <AdminTradeExecutor />
        </div>

        <MetricsSection
          currentBalance="$0"
          totalApy="0%"
          totalApyChange="(0%)"
          totalPoints="0"
          totalPointsChange="(+0%)"
          healthFactor="0"
          totalDeposited="$0"
          depositedPerDay="$0/day"
          totalBorrowed="$0"
          borrowedPerDay="-$0/day"
        />
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
            <span>
              No assets yet! Supply some to{" "}
              <a href="#" className="underline">
                get started
              </a>
              .
            </span>
          }
          borrowedText={
            <span>
              No borrowings yet!{" "}
              <a href="#" className="underline">
                Supply
              </a>{" "}
              collateral to start borrowing.
            </span>
          }
        />
      </main>
    </div>
  );
};

export default HyperLend;
