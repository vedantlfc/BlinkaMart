import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "../data/catalog";

const CART_STORAGE_KEY = "blinkamart.cart.v1";
const productById = new Map(products.map((product) => [product.id, product]));
const validProductIds = new Set(productById.keys());

export type CartItems = Record<string, number>;

export interface CartTotals {
  uniqueItems: number;
  totalQuantity: number;
  totalPrice: number;
  totalCalories: number;
  averageRegretScore: number;
}

export interface CartContextValue {
  items: CartItems;
  totals: CartTotals;
  addItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
}

const emptyTotals: CartTotals = {
  uniqueItems: 0,
  totalQuantity: 0,
  totalPrice: 0,
  totalCalories: 0,
  averageRegretScore: 0,
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function normalizeCartItems(value: unknown): CartItems {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<CartItems>(
    (items, [productId, quantity]) => {
      if (!validProductIds.has(productId) || typeof quantity !== "number") {
        return items;
      }

      const safeQuantity = Math.floor(quantity);
      if (safeQuantity > 0) {
        items[productId] = safeQuantity;
      }

      return items;
    },
    {},
  );
}

function readStoredCart(): CartItems {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return normalizeCartItems(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "{}"));
  } catch {
    return {};
  }
}

function writeStoredCart(items: CartItems) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Browsing still works if storage is unavailable.
  }
}

function updateQuantity(
  items: CartItems,
  productId: string,
  updater: (currentQuantity: number) => number,
) {
  if (!validProductIds.has(productId)) {
    return items;
  }

  const nextQuantity = updater(items[productId] ?? 0);
  const nextItems = { ...items };

  if (nextQuantity > 0) {
    nextItems[productId] = nextQuantity;
  } else {
    delete nextItems[productId];
  }

  return nextItems;
}

function getTotals(items: CartItems): CartTotals {
  const totals = Object.entries(items).reduce(
    (runningTotals, [productId, quantity]) => {
      const product = productById.get(productId);
      if (!product || quantity <= 0) {
        return runningTotals;
      }

      runningTotals.uniqueItems += 1;
      runningTotals.totalQuantity += quantity;
      runningTotals.totalPrice += product.price * quantity;
      runningTotals.totalCalories += product.calories * quantity;
      runningTotals.regretScoreTotal += product.regretScore * quantity;
      return runningTotals;
    },
    {
      ...emptyTotals,
      regretScoreTotal: 0,
    },
  );

  return {
    uniqueItems: totals.uniqueItems,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    averageRegretScore:
      totals.totalQuantity > 0
        ? Math.round(totals.regretScoreTotal / totals.totalQuantity)
        : 0,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>(() => readStoredCart());

  useEffect(() => {
    writeStoredCart(items);
  }, [items]);

  const addItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      updateQuantity(currentItems, productId, (currentQuantity) => currentQuantity + 1),
    );
  }, []);

  const incrementItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      updateQuantity(currentItems, productId, (currentQuantity) => currentQuantity + 1),
    );
  }, []);

  const decrementItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      updateQuantity(currentItems, productId, (currentQuantity) => currentQuantity - 1),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => {
      if (!currentItems[productId]) {
        return currentItems;
      }

      const nextItems = { ...currentItems };
      delete nextItems[productId];
      return nextItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const getQuantity = useCallback((productId: string) => items[productId] ?? 0, [items]);
  const totals = useMemo(() => getTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getQuantity,
    }),
    [addItem, clearCart, decrementItem, getQuantity, incrementItem, items, removeItem, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return cart;
}
