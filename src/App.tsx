import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ReceiptPage } from "./pages/ReceiptPage";
import { TrackingPage } from "./pages/TrackingPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  );
}
