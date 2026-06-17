import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./state/cart";
import { FakeOrderProvider } from "./state/fakeOrder";
import { ReceiptProgressProvider } from "./state/receiptProgress";
import { SettingsProvider } from "./state/settings";
import "./styles/tokens.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("BlinkaMart root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <CartProvider>
          <FakeOrderProvider>
            <ReceiptProgressProvider>
              <App />
            </ReceiptProgressProvider>
          </FakeOrderProvider>
        </CartProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
