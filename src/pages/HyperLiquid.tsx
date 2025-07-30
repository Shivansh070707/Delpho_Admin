import React, { useState } from "react";
import HomeSidebar from "../components/HomeSidebar";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

const TABS = [
  "Balances",
  "Positions",
  "Open Orders",
  "TWAP",
  "Trade History",
  "Funding History",
  "Order History",
];

type TableRow = Record<string, string>;

// Dummy data for each tab
const balancesData: TableRow[] = [
  {
    coin: "USDC",
    totalBalance: "1,000.00",
    availableBalance: "1,000.00",
    usdcValue: "$1,000.00",
    pnl: "+0.00 (0.00%)",
    contract: "-",
  },
  {
    coin: "BTC",
    totalBalance: "0.50",
    availableBalance: "0.50",
    usdcValue: "$32,500.00",
    pnl: "+100.00 (0.31%)",
    contract: "-",
  },
  {
    coin: "ETH",
    totalBalance: "2.00",
    availableBalance: "1.50",
    usdcValue: "$7,200.00",
    pnl: "-50.00 (-0.69%)",
    contract: "-",
  },
  {
    coin: "SOL",
    totalBalance: "10.00",
    availableBalance: "10.00",
    usdcValue: "$1,500.00",
    pnl: "+10.00 (0.67%)",
    contract: "-",
  },
  {
    coin: "ARB",
    totalBalance: "100.00",
    availableBalance: "80.00",
    usdcValue: "$1,200.00",
    pnl: "-5.00 (-0.42%)",
    contract: "-",
  },
];
const positionsData: TableRow[] = [
  {
    coin: "ETH",
    size: "0.50",
    positionValue: "$1,800.00",
    entryPrice: "$3,600.00",
    markPrice: "$3,600.00",
    pnl: "+0.00 (0.00%)",
    liqPrice: "$2,000.00",
    margin: "$500.00",
    funding: "$0.00",
  },
  {
    coin: "BTC",
    size: "0.10",
    positionValue: "$6,500.00",
    entryPrice: "$65,000.00",
    markPrice: "$65,000.00",
    pnl: "+50.00 (0.08%)",
    liqPrice: "$50,000.00",
    margin: "$1,000.00",
    funding: "$2.00",
  },
  {
    coin: "SOL",
    size: "5.00",
    positionValue: "$750.00",
    entryPrice: "$150.00",
    markPrice: "$150.00",
    pnl: "-10.00 (-1.33%)",
    liqPrice: "$100.00",
    margin: "$200.00",
    funding: "$0.50",
  },
  {
    coin: "ARB",
    size: "20.00",
    positionValue: "$240.00",
    entryPrice: "$12.00",
    markPrice: "$12.00",
    pnl: "+5.00 (2.08%)",
    liqPrice: "$8.00",
    margin: "$50.00",
    funding: "$0.10",
  },
  {
    coin: "USDC",
    size: "100.00",
    positionValue: "$100.00",
    entryPrice: "$1.00",
    markPrice: "$1.00",
    pnl: "+0.00 (0.00%)",
    liqPrice: "$0.80",
    margin: "$20.00",
    funding: "$0.00",
  },
];
const openOrdersData: TableRow[] = [
  {
    time: "2024-06-01 12:00",
    type: "Limit",
    coin: "BTC",
    direction: "Buy",
    size: "0.01",
    originalSize: "0.01",
    orderValue: "$650.00",
    price: "$65,000.00",
    reduceOnly: "No",
    triggerConditions: "-",
    tpSl: "-",
  },
  {
    time: "2024-06-01 12:05",
    type: "Market",
    coin: "ETH",
    direction: "Sell",
    size: "0.10",
    originalSize: "0.10",
    orderValue: "$360.00",
    price: "$3,600.00",
    reduceOnly: "No",
    triggerConditions: "-",
    tpSl: "-",
  },
  {
    time: "2024-06-01 12:10",
    type: "Limit",
    coin: "SOL",
    direction: "Buy",
    size: "2.00",
    originalSize: "2.00",
    orderValue: "$300.00",
    price: "$150.00",
    reduceOnly: "Yes",
    triggerConditions: "-",
    tpSl: "-",
  },
  {
    time: "2024-06-01 12:15",
    type: "Stop",
    coin: "ARB",
    direction: "Sell",
    size: "10.00",
    originalSize: "10.00",
    orderValue: "$120.00",
    price: "$12.00",
    reduceOnly: "No",
    triggerConditions: "Price < $11.00",
    tpSl: "TP",
  },
  {
    time: "2024-06-01 12:20",
    type: "Limit",
    coin: "USDC",
    direction: "Buy",
    size: "50.00",
    originalSize: "50.00",
    orderValue: "$50.00",
    price: "$1.00",
    reduceOnly: "No",
    triggerConditions: "-",
    tpSl: "SL",
  },
];
const twapData: TableRow[] = [
  {
    coin: "SOL",
    size: "10",
    executedSize: "5",
    averagePrice: "$150.00",
    runningTime: "10m / 20m",
    reduceOnly: "No",
    creationTime: "2024-06-01 11:50",
    terminate: "-",
  },
  {
    coin: "BTC",
    size: "0.05",
    executedSize: "0.03",
    averagePrice: "$65,100.00",
    runningTime: "5m / 15m",
    reduceOnly: "No",
    creationTime: "2024-06-01 11:55",
    terminate: "-",
  },
  {
    coin: "ETH",
    size: "1.00",
    executedSize: "0.50",
    averagePrice: "$3,620.00",
    runningTime: "8m / 30m",
    reduceOnly: "Yes",
    creationTime: "2024-06-01 12:00",
    terminate: "-",
  },
  {
    coin: "ARB",
    size: "15.00",
    executedSize: "10.00",
    averagePrice: "$12.10",
    runningTime: "12m / 25m",
    reduceOnly: "No",
    creationTime: "2024-06-01 12:05",
    terminate: "-",
  },
  {
    coin: "USDC",
    size: "200.00",
    executedSize: "100.00",
    averagePrice: "$1.00",
    runningTime: "20m / 40m",
    reduceOnly: "No",
    creationTime: "2024-06-01 12:10",
    terminate: "-",
  },
];
const tradeHistoryData: TableRow[] = [
  {
    time: "2024-06-01 10:00",
    type: "Market",
    coin: "BTC",
    direction: "Sell",
    price: "$67,000.00",
    size: "0.02",
    tradeValue: "$1,340.00",
    fee: "$1.00",
    closedPnl: "+$10.00",
  },
  {
    time: "2024-06-01 10:05",
    type: "Limit",
    coin: "ETH",
    direction: "Buy",
    price: "$3,600.00",
    size: "0.10",
    tradeValue: "$360.00",
    fee: "$0.50",
    closedPnl: "-$2.00",
  },
  {
    time: "2024-06-01 10:10",
    type: "Market",
    coin: "SOL",
    direction: "Sell",
    price: "$150.00",
    size: "1.00",
    tradeValue: "$150.00",
    fee: "$0.10",
    closedPnl: "+$1.00",
  },
  {
    time: "2024-06-01 10:15",
    type: "Limit",
    coin: "ARB",
    direction: "Buy",
    price: "$12.00",
    size: "5.00",
    tradeValue: "$60.00",
    fee: "$0.05",
    closedPnl: "+$0.50",
  },
  {
    time: "2024-06-01 10:20",
    type: "Market",
    coin: "USDC",
    direction: "Sell",
    price: "$1.00",
    size: "100.00",
    tradeValue: "$100.00",
    fee: "$0.01",
    closedPnl: "+$0.00",
  },
];
const fundingHistoryData: TableRow[] = [
  {
    time: "2024-06-01 09:00",
    coin: "ETH",
    size: "0.5",
    positionSide: "Long",
    payment: "$0.50",
    rate: "0.01%",
  },
  {
    time: "2024-06-01 09:05",
    coin: "BTC",
    size: "0.1",
    positionSide: "Short",
    payment: "$0.10",
    rate: "0.02%",
  },
  {
    time: "2024-06-01 09:10",
    coin: "SOL",
    size: "2.0",
    positionSide: "Long",
    payment: "$0.20",
    rate: "0.03%",
  },
  {
    time: "2024-06-01 09:15",
    coin: "ARB",
    size: "10.0",
    positionSide: "Short",
    payment: "$0.05",
    rate: "0.01%",
  },
  {
    time: "2024-06-01 09:20",
    coin: "USDC",
    size: "50.0",
    positionSide: "Long",
    payment: "$0.01",
    rate: "0.00%",
  },
];
const orderHistoryData: TableRow[] = [
  {
    time: "2024-05-31 18:00",
    type: "Limit",
    coin: "BTC",
    direction: "Buy",
    size: "0.01",
    filledSize: "0.01",
    orderValue: "$650.00",
    price: "$65,000.00",
    reduceOnly: "No",
    triggerConditions: "-",
    tpSl: "-",
    status: "Filled",
    orderId: "1234567890",
  },
  {
    time: "2024-05-31 18:05",
    type: "Market",
    coin: "ETH",
    direction: "Sell",
    size: "0.10",
    filledSize: "0.10",
    orderValue: "$360.00",
    price: "$3,600.00",
    reduceOnly: "No",
    triggerConditions: "-",
    tpSl: "-",
    status: "Filled",
    orderId: "1234567891",
  },
  {
    time: "2024-05-31 18:10",
    type: "Limit",
    coin: "SOL",
    direction: "Buy",
    size: "2.00",
    filledSize: "2.00",
    orderValue: "$300.00",
    price: "$150.00",
    reduceOnly: "Yes",
    triggerConditions: "-",
    tpSl: "-",
    status: "Cancelled",
    orderId: "1234567892",
  },
  {
    time: "2024-05-31 18:15",
    type: "Stop",
    coin: "ARB",
    direction: "Sell",
    size: "10.00",
    filledSize: "0.00",
    orderValue: "$120.00",
    price: "$12.00",
    reduceOnly: "No",
    triggerConditions: "Price < $11.00",
    tpSl: "TP",
    status: "Open",
    orderId: "1234567893",
  },
  {
    time: "2024-05-31 18:20",
    type: "Limit",
    coin: "USDC",
    direction: "Buy",
    size: "50.00",
    filledSize: "50.00",
    orderValue: "$50.00",
    price: "$1.00",
    reduceOnly: "No",
    triggerConditions: "-",
    tpSl: "SL",
    status: "Filled",
    orderId: "1234567894",
  },
];

const columns = {
  Balances: [
    { label: "Coin", key: "coin" },
    { label: "Total Balance", key: "totalBalance" },
    { label: "Available Balance", key: "availableBalance" },
    { label: "USDC Value", key: "usdcValue" },
    { label: "PNL (ROE %)", key: "pnl" },
    { label: "Contract", key: "contract" },
  ],
  Positions: [
    { label: "Coin", key: "coin" },
    { label: "Size", key: "size" },
    { label: "Position Value", key: "positionValue" },
    { label: "Entry Price", key: "entryPrice" },
    { label: "Mark Price", key: "markPrice" },
    { label: "PNL (ROE %)", key: "pnl" },
    { label: "Liq. Price", key: "liqPrice" },
    { label: "Margin", key: "margin" },
    { label: "Funding", key: "funding" },
  ],
  "Open Orders": [
    { label: "Time", key: "time" },
    { label: "Type", key: "type" },
    { label: "Coin", key: "coin" },
    { label: "Direction", key: "direction" },
    { label: "Size", key: "size" },
    { label: "Original Size", key: "originalSize" },
    { label: "Order Value", key: "orderValue" },
    { label: "Price", key: "price" },
    { label: "Reduce Only", key: "reduceOnly" },
    { label: "Trigger Conditions", key: "triggerConditions" },
    { label: "TP/SL", key: "tpSl" },
  ],
  TWAP: [
    { label: "Coin", key: "coin" },
    { label: "Size", key: "size" },
    { label: "Executed Size", key: "executedSize" },
    { label: "Average Price", key: "averagePrice" },
    { label: "Running Time / Total", key: "runningTime" },
    { label: "Reduce Only", key: "reduceOnly" },
    { label: "Creation Time", key: "creationTime" },
    { label: "Terminate", key: "terminate" },
  ],
  "Trade History": [
    { label: "Time", key: "time" },
    { label: "Type", key: "type" },
    { label: "Coin", key: "coin" },
    { label: "Direction", key: "direction" },
    { label: "Price", key: "price" },
    { label: "Size", key: "size" },
    { label: "Trade Value", key: "tradeValue" },
    { label: "Fee", key: "fee" },
    { label: "Closed PNL", key: "closedPnl" },
  ],
  "Funding History": [
    { label: "Time", key: "time" },
    { label: "Coin", key: "coin" },
    { label: "Size", key: "size" },
    { label: "Position Side", key: "positionSide" },
    { label: "Payment", key: "payment" },
    { label: "Rate", key: "rate" },
  ],
  "Order History": [
    { label: "Time", key: "time" },
    { label: "Type", key: "type" },
    { label: "Coin", key: "coin" },
    { label: "Direction", key: "direction" },
    { label: "Size", key: "size" },
    { label: "Filled Size", key: "filledSize" },
    { label: "Order Value", key: "orderValue" },
    { label: "Price", key: "price" },
    { label: "Reduce Only", key: "reduceOnly" },
    { label: "Trigger Conditions", key: "triggerConditions" },
    { label: "TP/SL", key: "tpSl" },
    { label: "Status", key: "status" },
    { label: "Order ID", key: "orderId" },
  ],
};

const noDataMessages = {
  Balances: "No balances yet",
  Positions: "No open positions yet",
  "Open Orders": "No open orders yet",
  TWAP: "No TWAPs Yet",
  "Trade History": "No trades yet",
  "Funding History": "No funding distributions yet",
  "Order History": "No historical orders yet",
};

const HyperLiquid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  // Dummy data for demonstration (empty for now, can add sample rows)
  const dataMap: Record<string, TableRow[]> = {
    Balances: balancesData,
    Positions: positionsData,
    "Open Orders": openOrdersData,
    TWAP: twapData,
    "Trade History": tradeHistoryData,
    "Funding History": fundingHistoryData,
    "Order History": orderHistoryData,
  };

  const activeColumns = columns[activeTab as keyof typeof columns];
  const activeData = dataMap[activeTab] || [];
  const noDataMsg = noDataMessages[activeTab as keyof typeof noDataMessages];

  return (
    <div className="min-h-screen flex bg-[#101616] text-[#E6FFF6]">
      <HomeSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <TopNav title="HyperLiquid Dashboard" />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-[#1A2323] flex items-center gap-2 mb-4 overflow-x-auto"
        >
          {TABS.map((tab) => (
            <motion.button
              key={tab}
              className={`px-4 py-2 text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-[#00FFB2] text-[#E6FFF6]"
                  : "border-transparent text-[#A3B8B0] hover:text-[#E6FFF6]"
              }`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>
        <div className="mt-6">
          <div className="bg-[#0B1212] rounded-xl p-0 min-h-[200px] overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[#A3B8B0] border-b border-[#1A2323]">
                  {activeColumns.map((col) => (
                    <th key={col.key} className="py-2 px-4 font-normal">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeColumns.length}
                      className="py-4 px-4 text-[#E6FFF6]"
                    >
                      {noDataMsg}
                    </td>
                  </tr>
                ) : (
                  activeData.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="border-b border-[#1A2323]"
                    >
                      {activeColumns.map((col) => (
                        <td key={col.key} className="py-2 px-4">
                          {row[col.key]}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HyperLiquid;
