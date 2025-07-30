import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HyperLend from "./pages/HyperLend";
import HyperLiquid from "./pages/HyperLiquid";
import VaultDashboard from "./pages/VaultDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HyperLend />} />
        <Route path="/vault" element={<VaultDashboard />} />
        <Route path="/hyperliquid" element={<HyperLiquid />} />
        <Route path="/hyperlend" element={<HyperLend />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
