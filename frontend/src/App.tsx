import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PaymentDetail from "./pages/PaymentDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payment/:id" element={<PaymentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
