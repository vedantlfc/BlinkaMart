import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { categories, products, type CategoryId } from "../data/catalog";
import type { CartItems } from "./cart";

const FAKE_ORDER_STORAGE_KEY = "blinkamart.currentFakeOrder.v1";
const productById = new Map(products.map((product) => [product.id, product]));
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

export interface FakeOrderItem {
  productId: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  quantity: number;
  price: number;
  calories: number;
  regretScore: number;
  subtitle: string;
}

export interface FakeOrderSnapshot {
  id: string;
  timestamp: string;
  items: FakeOrderItem[];
  totalPrice: number;
  totalCalories: number;
  averageRegretScore: number;
  totalQuantity: number;
  showCalories: boolean;
}

export interface FakeOrderContextValue {
  currentOrder: FakeOrderSnapshot | null;
  createOrderFromCart: (items: CartItems, showCalories: boolean) => FakeOrderSnapshot | null;
  clearOrder: () => void;
}

const FakeOrderContext = createContext<FakeOrderContextValue | undefined>(undefined);

function createOrderId() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BM-${timePart}-${randomPart}`;
}

function buildOrderSnapshot(items: CartItems, showCalories: boolean): FakeOrderSnapshot | null {
  const orderItems = Object.entries(items).reduce<FakeOrderItem[]>(
    (runningItems, [productId, quantity]) => {
      const product = productById.get(productId);

      if (!product || quantity <= 0 || !Number.isFinite(quantity)) {
        return runningItems;
      }

      runningItems.push({
        productId: product.id,
        name: product.name,
        categoryId: product.categoryId,
        categoryName: categoryNames.get(product.categoryId) ?? "Fake shelf",
        quantity,
        price: product.price,
        calories: product.calories,
        regretScore: product.regretScore,
        subtitle: product.subtitle,
      });

      return runningItems;
    },
    [],
  );

  const totals = orderItems.reduce(
    (runningTotals, item) => {
      runningTotals.totalQuantity += item.quantity;
      runningTotals.totalPrice += item.price * item.quantity;
      runningTotals.totalCalories += item.calories * item.quantity;
      runningTotals.regretScoreTotal += item.regretScore * item.quantity;
      return runningTotals;
    },
    {
      totalQuantity: 0,
      totalPrice: 0,
      totalCalories: 0,
      regretScoreTotal: 0,
    },
  );

  if (totals.totalQuantity <= 0) {
    return null;
  }

  return {
    id: createOrderId(),
    timestamp: new Date().toISOString(),
    items: orderItems,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    averageRegretScore: Math.round(totals.regretScoreTotal / totals.totalQuantity),
    totalQuantity: totals.totalQuantity,
    showCalories,
  };
}

function isValidOrderItem(value: unknown): value is FakeOrderItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const item = value as Partial<FakeOrderItem>;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.categoryId === "string" &&
    typeof item.categoryName === "string" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0 &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.calories === "number" &&
    Number.isFinite(item.calories) &&
    typeof item.regretScore === "number" &&
    Number.isFinite(item.regretScore) &&
    typeof item.subtitle === "string"
  );
}

function normalizeOrder(value: unknown): FakeOrderSnapshot | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const order = value as Partial<FakeOrderSnapshot>;
  if (
    typeof order.id !== "string" ||
    typeof order.timestamp !== "string" ||
    !Array.isArray(order.items) ||
    typeof order.totalPrice !== "number" ||
    !Number.isFinite(order.totalPrice) ||
    typeof order.totalCalories !== "number" ||
    !Number.isFinite(order.totalCalories) ||
    typeof order.averageRegretScore !== "number" ||
    !Number.isFinite(order.averageRegretScore) ||
    typeof order.totalQuantity !== "number" ||
    !Number.isFinite(order.totalQuantity) ||
    order.totalQuantity <= 0 ||
    typeof order.showCalories !== "boolean"
  ) {
    return null;
  }

  const normalizedItems = order.items.filter(isValidOrderItem);
  if (normalizedItems.length === 0) {
    return null;
  }

  return {
    id: order.id,
    timestamp: order.timestamp,
    items: normalizedItems,
    totalPrice: order.totalPrice,
    totalCalories: order.totalCalories,
    averageRegretScore: order.averageRegretScore,
    totalQuantity: order.totalQuantity,
    showCalories: order.showCalories,
  };
}

function readStoredOrder(): FakeOrderSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return normalizeOrder(
      JSON.parse(window.localStorage.getItem(FAKE_ORDER_STORAGE_KEY) ?? "null"),
    );
  } catch {
    return null;
  }
}

function writeStoredOrder(order: FakeOrderSnapshot | null) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (order) {
      window.localStorage.setItem(FAKE_ORDER_STORAGE_KEY, JSON.stringify(order));
    } else {
      window.localStorage.removeItem(FAKE_ORDER_STORAGE_KEY);
    }
  } catch {
    // The fake order flow can still recover if storage is unavailable.
  }
}

export function FakeOrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<FakeOrderSnapshot | null>(() =>
    readStoredOrder(),
  );

  useEffect(() => {
    writeStoredOrder(currentOrder);
  }, [currentOrder]);

  const createOrderFromCart = useCallback((items: CartItems, showCalories: boolean) => {
    const nextOrder = buildOrderSnapshot(items, showCalories);
    setCurrentOrder(nextOrder);
    return nextOrder;
  }, []);

  const clearOrder = useCallback(() => setCurrentOrder(null), []);

  const value = useMemo<FakeOrderContextValue>(
    () => ({
      currentOrder,
      createOrderFromCart,
      clearOrder,
    }),
    [clearOrder, createOrderFromCart, currentOrder],
  );

  return <FakeOrderContext.Provider value={value}>{children}</FakeOrderContext.Provider>;
}

export function useFakeOrder() {
  const order = useContext(FakeOrderContext);

  if (!order) {
    throw new Error("useFakeOrder must be used inside FakeOrderProvider.");
  }

  return order;
}
