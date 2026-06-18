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

// Keep legacy storage key for existing browsers.
const ORDER_STORAGE_KEY = "blinkamart.currentFakeOrder.v1";
const MAX_ORDER_ITEM_QUANTITY = 99;
const productById = new Map(products.map((product) => [product.id, product]));
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
const validCategoryIds = new Set(categories.map((category) => category.id));

export type OrderStatus = "draft" | "tracking" | "completed";

export interface OrderItem {
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

export interface OrderSnapshot {
  id: string;
  timestamp: string;
  items: OrderItem[];
  totalPrice: number;
  totalCalories: number;
  averageRegretScore: number;
  totalQuantity: number;
  showCalories: boolean;
  status: OrderStatus;
}

export interface OrderContextValue {
  currentOrder: OrderSnapshot | null;
  createOrderFromCart: (
    items: CartItems,
    showCalories: boolean,
    status?: OrderStatus,
  ) => OrderSnapshot | null;
  updateOrderStatus: (status: OrderStatus) => OrderSnapshot | null;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

function createOrderId() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BM-${timePart}-${randomPart}`;
}

function buildOrderSnapshot(
  items: CartItems,
  showCalories: boolean,
  status: OrderStatus = "draft",
): OrderSnapshot | null {
  const orderItems = Object.entries(items).reduce<OrderItem[]>(
    (runningItems, [productId, quantity]) => {
      const product = productById.get(productId);

      if (!product || quantity <= 0 || !Number.isFinite(quantity)) {
        return runningItems;
      }

      runningItems.push({
        productId: product.id,
        name: product.name,
        categoryId: product.categoryId,
        categoryName: categoryNames.get(product.categoryId) ?? "Shelf",
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

function normalizeOrderItem(value: unknown): OrderItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Partial<OrderItem>;
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

function getStoredStatus(value: unknown): OrderStatus | null {
  if (value === undefined) {
    return "completed";
  }

  return value === "draft" || value === "tracking" || value === "completed"
    ? value
    : null;
}

function normalizeOrder(value: unknown): OrderSnapshot | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const order = value as Partial<OrderSnapshot>;
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
    .filter((item): item is OrderItem => Boolean(item));
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

function readStoredOrder(): OrderSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return normalizeOrder(
      JSON.parse(window.localStorage.getItem(ORDER_STORAGE_KEY) ?? "null"),
    );
  } catch {
    return null;
  }
}

function writeStoredOrder(order: OrderSnapshot | null) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (order) {
      window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } else {
      window.localStorage.removeItem(ORDER_STORAGE_KEY);
    }
  } catch {
    // The order flow can still recover if storage is unavailable.
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<OrderSnapshot | null>(() =>
    readStoredOrder(),
  );

  useEffect(() => {
    writeStoredOrder(currentOrder);
  }, [currentOrder]);

  const createOrderFromCart = useCallback((
    items: CartItems,
    showCalories: boolean,
    status: OrderStatus = "draft",
  ) => {
    const nextOrder = buildOrderSnapshot(items, showCalories, status);
    setCurrentOrder(nextOrder);
    return nextOrder;
  }, []);

  const updateOrderStatus = useCallback((status: OrderStatus) => {
    const nextOrder = currentOrder ? { ...currentOrder, status } : null;
    setCurrentOrder(nextOrder);
    return nextOrder;
  }, [currentOrder]);

  const clearOrder = useCallback(() => setCurrentOrder(null), []);

  const value = useMemo<OrderContextValue>(
    () => ({
      currentOrder,
      createOrderFromCart,
      updateOrderStatus,
      clearOrder,
    }),
    [clearOrder, createOrderFromCart, currentOrder, updateOrderStatus],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const order = useContext(OrderContext);

  if (!order) {
    throw new Error("useOrder must be used inside OrderProvider.");
  }

  return order;
}
