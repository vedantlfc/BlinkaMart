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
export type TrackingOutcome = "pending" | "lost";

export interface DeliveryPartner {
  name: string;
  vehicle: string;
  reliabilityLabel: string;
  oneLineStatus: string;
}

export interface OrderTrackingMetadata {
  etaMinutes: number;
  deliveryPartner: DeliveryPartner;
  routeSeed: number;
  trackingStartedAt: string | null;
  completedAt: string | null;
  trackingOutcome: TrackingOutcome;
  darkStoreName: string;
}

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
  tracking: OrderTrackingMetadata;
}

export interface OrderContextValue {
  currentOrder: OrderSnapshot | null;
  createOrderFromCart: (
    items: CartItems,
    showCalories: boolean,
    status?: OrderStatus,
  ) => OrderSnapshot | null;
  updateOrderStatus: (status: OrderStatus) => OrderSnapshot | null;
  beginTracking: () => OrderSnapshot | null;
  completeTracking: (outcome: "lost") => OrderSnapshot | null;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

function createOrderId() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BM-${timePart}-${randomPart}`;
}

const deliveryPartnerNames = [
  "Asha Pause",
  "Kabir Calm",
  "Mira Maybe",
  "Nikhil Nope",
  "Tara Timeout",
  "Ravi Reroute",
];

const deliveryVehicles = [
  "Scooter of Second Thoughts",
  "Cycle of Common Sense",
  "Moped of Mild Reflection",
  "Tiny Van of Timing",
  "Shortcut Scooter",
  "Snack Patrol Bike",
];

const reliabilityLabels = [
  "99% drama-aware",
  "Calm under snack pressure",
  "Excellent at heroic detours",
  "Certified cart negotiator",
  "Very steady near sofas",
  "Knows every craving shortcut",
];

const partnerStatuses = [
  "Scanning the route for snack fog.",
  "Carrying the bag with delivery seriousness.",
  "Keeping one eye on Self Control Signal.",
  "Preparing for a graceful wrong turn.",
  "Respectfully questioning the craving.",
  "Rolling through the late-night delivery grid.",
];

const darkStoreNames = [
  "Craving Store 7",
  "Late-Night Craving Desk",
  "Snack Annex 12",
  "Midnight Aisle Hub",
  "Almost Ordered Depot",
  "Tiny Temptation Warehouse",
];

function hashOrderId(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickStableValue<T>(values: T[], seed: number, offset: number) {
  return values[(seed + offset) % values.length];
}

function buildTrackingMetadata(
  orderId: string,
  status: OrderStatus,
  trackingStartedAt: string | null,
): OrderTrackingMetadata {
  const seed = hashOrderId(orderId);

  return {
    etaMinutes: 8 + (seed % 13),
    deliveryPartner: {
      name: pickStableValue(deliveryPartnerNames, seed, 1),
      vehicle: pickStableValue(deliveryVehicles, seed, 3),
      reliabilityLabel: pickStableValue(reliabilityLabels, seed, 5),
      oneLineStatus: pickStableValue(partnerStatuses, seed, 7),
    },
    routeSeed: seed,
    trackingStartedAt,
    completedAt: null,
    trackingOutcome: status === "completed" ? "lost" : "pending",
    darkStoreName: pickStableValue(darkStoreNames, seed, 9),
  };
}

function isValidIsoTimestamp(value: string) {
  return !Number.isNaN(new Date(value).getTime());
}

export function getOrderCompletionTimestamp(order: OrderSnapshot) {
  return order.tracking.completedAt && isValidIsoTimestamp(order.tracking.completedAt)
    ? order.tracking.completedAt
    : order.timestamp;
}

function normalizeTrackingMetadata(
  value: unknown,
  orderId: string,
  status: OrderStatus,
): OrderTrackingMetadata {
  const fallback = buildTrackingMetadata(orderId, status, null);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }

  const tracking = value as Partial<OrderTrackingMetadata>;
  const storedStartedAt =
    typeof tracking.trackingStartedAt === "string" &&
    isValidIsoTimestamp(tracking.trackingStartedAt)
      ? tracking.trackingStartedAt
      : null;
  const storedCompletedAt =
    typeof tracking.completedAt === "string" &&
    isValidIsoTimestamp(tracking.completedAt)
      ? tracking.completedAt
      : null;

  return {
    etaMinutes: fallback.etaMinutes,
    deliveryPartner: fallback.deliveryPartner,
    routeSeed: fallback.routeSeed,
    trackingStartedAt: storedStartedAt,
    completedAt: status === "completed" ? storedCompletedAt : null,
    trackingOutcome: status === "completed" ? "lost" : "pending",
    darkStoreName: fallback.darkStoreName,
  };
}

function ensureTrackingMetadata(order: OrderSnapshot): OrderSnapshot {
  return {
    ...order,
    tracking: normalizeTrackingMetadata(order.tracking, order.id, order.status),
  };
}

function buildOrderSnapshot(
  items: CartItems,
  showCalories: boolean,
  status: OrderStatus = "draft",
): OrderSnapshot | null {
  const id = createOrderId();
  const timestamp = new Date().toISOString();
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
    id,
    timestamp,
    items: orderItems,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    averageRegretScore: Math.round(totals.regretScoreTotal / totals.totalQuantity),
    totalQuantity: totals.totalQuantity,
    showCalories,
    status,
    tracking: buildTrackingMetadata(
      id,
      status,
      status === "tracking" ? timestamp : null,
    ),
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
    tracking: normalizeTrackingMetadata(order.tracking, order.id, status),
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
    const nextOrder = currentOrder
      ? ensureTrackingMetadata({
          ...currentOrder,
          status,
          tracking: {
            ...currentOrder.tracking,
            trackingOutcome: status === "completed" ? "lost" : currentOrder.tracking.trackingOutcome,
            completedAt:
              status === "completed"
                ? currentOrder.tracking.completedAt ?? new Date().toISOString()
                : null,
          },
        })
      : null;
    setCurrentOrder(nextOrder);
    return nextOrder;
  }, [currentOrder]);

  const beginTracking = useCallback(() => {
    const nextOrder = currentOrder
      ? ensureTrackingMetadata({
          ...currentOrder,
          status: "tracking",
          tracking: {
            ...currentOrder.tracking,
            trackingStartedAt: currentOrder.tracking.trackingStartedAt ?? new Date().toISOString(),
            completedAt: null,
            trackingOutcome: "pending",
          },
        })
      : null;

    setCurrentOrder(nextOrder);
    return nextOrder;
  }, [currentOrder]);

  const completeTracking = useCallback((outcome: "lost") => {
    const nextOrder = currentOrder
      ? ensureTrackingMetadata({
          ...currentOrder,
          status: "completed",
          tracking: {
            ...currentOrder.tracking,
            completedAt: currentOrder.tracking.completedAt ?? new Date().toISOString(),
            trackingOutcome: outcome,
          },
        })
      : null;

    setCurrentOrder(nextOrder);
    return nextOrder;
  }, [currentOrder]);

  const clearOrder = useCallback(() => setCurrentOrder(null), []);

  const value = useMemo<OrderContextValue>(
    () => ({
      currentOrder,
      createOrderFromCart,
      updateOrderStatus,
      beginTracking,
      completeTracking,
      clearOrder,
    }),
    [
      beginTracking,
      clearOrder,
      completeTracking,
      createOrderFromCart,
      currentOrder,
      updateOrderStatus,
    ],
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
