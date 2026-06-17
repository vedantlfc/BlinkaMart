import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CartPage } from "./pages/CartPage";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  );
}
