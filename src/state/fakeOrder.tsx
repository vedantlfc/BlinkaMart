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
const MAX_ORDER_ITEM_QUANTITY = 99;
const productById = new Map(products.map((product) => [product.id, product]));
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
const validCategoryIds = new Set(categories.map((category) => category.id));

export type FakeOrderStatus = "draft" | "tracking" | "completed";

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
  status: FakeOrderStatus;
}

export interface FakeOrderContextValue {
  currentOrder: FakeOrderSnapshot | null;
  createOrderFromCart: (
    items: CartItems,
    showCalories: boolean,
    status?: FakeOrderStatus,
  ) => FakeOrderSnapshot | null;
  updateOrderStatus: (status: FakeOrderStatus) => FakeOrderSnapshot | null;
  clearOrder: () => void;
}

const FakeOrderContext = createContext<FakeOrderContextValue | undefined>(undefined);

function createOrderId() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BM-${timePart}-${randomPart}`;
}

function buildOrderSnapshot(
  items: CartItems,
  showCalories: boolean,
  status: FakeOrderStatus = "draft",
): FakeOrderSnapshot | null {
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
    status,
  };
}

function normalizeOrderItem(value: unknown): FakeOrderItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Partial<FakeOrderItem>;
  if (
    typeof item.productId !== "string" ||
    typeof item.name !== "string" ||
    typeof item.categoryId !== "string" ||
    !validCategoryIds.has(item.categoryId as CategoryId) ||
    typeof item.categoryName !== "string" ||
    typeof item.quantity !== "number" ||
    !Number.isFinite(item.quantity) ||
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0 ||
    item.quantity > MAX_ORDER_ITEM_QUANTITY ||
    typeof item.price !== "number" ||
    !Number.isFinite(item.price) ||
    item.price < 0 ||
    typeof item.calories !== "number" ||
    !Number.isFinite(item.calories) ||
    item.calories < 0 ||
    typeof item.regretScore !== "number" ||
    !Number.isFinite(item.regretScore) ||
    item.regretScore < 0 ||
    item.regretScore > 100 ||
    typeof item.subtitle !== "string"
  ) {
    return null;
  }

  return {
    productId: item.productId,
    name: item.name,
    categoryId: item.categoryId as CategoryId,
    categoryName: item.categoryName,
    quantity: item.quantity,
    price: item.price,
    calories: item.calories,
    regretScore: item.regretScore,
    subtitle: item.subtitle,
  };
}

function getStoredStatus(value: unknown): FakeOrderStatus | null {
  if (value === undefined) {
    return "completed";
  }

  return value === "draft" || value === "tracking" || value === "completed"
    ? value
    : null;
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
    typeof order.showCalories !== "boolean"
  ) {
    return null;
  }

  const status = getStoredStatus(order.status);
  if (!status) {
    return null;
  }

  const normalizedItems = order.items
    .map(normalizeOrderItem)
    .filter((item): item is FakeOrderItem => Boolean(item));
  if (normalizedItems.length === 0) {
    return null;
  }

  const totals = normalizedItems.reduce(
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

  return {
    id: order.id,
    timestamp: order.timestamp,
    items: normalizedItems,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    averageRegretScore: Math.round(totals.regretScoreTotal / totals.totalQuantity),
    totalQuantity: totals.totalQuantity,
    showCalories: order.showCalories,
    status,
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

  const createOrderFromCart = useCallback((
    items: CartItems,
    showCalories: boolean,
    status: FakeOrderStatus = "draft",
  ) => {
    const nextOrder = buildOrderSnapshot(items, showCalories, status);
    setCurrentOrder(nextOrder);
    return nextOrder;
  }, []);

  const updateOrderStatus = useCallback((status: FakeOrderStatus) => {
    const nextOrder = currentOrder ? { ...currentOrder, status } : null;
    setCurrentOrder(nextOrder);
    return nextOrder;
  }, [currentOrder]);

  const clearOrder = useCallback(() => setCurrentOrder(null), []);

  const value = useMemo<FakeOrderContextValue>(
    () => ({
      currentOrder,
      createOrderFromCart,
      updateOrderStatus,
      clearOrder,
    }),
    [clearOrder, createOrderFromCart, currentOrder, updateOrderStatus],
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
