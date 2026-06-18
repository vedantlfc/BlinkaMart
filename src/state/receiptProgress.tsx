import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { categories, products, type CategoryId, type Product } from "../data/catalog";
import { getOrderCompletionTimestamp, type OrderSnapshot } from "./order";

const RECEIPT_PROGRESS_STORAGE_KEY = "blinkamart.receiptProgress.v1";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_COMPLETED_ORDER_ITEM_QUANTITY = 99;
const productById = new Map(products.map((product) => [product.id, product]));
const productByLegacyKey = new Map(
  products.map((product) => [getLegacyProductKey(product.name, product.categoryId), product]),
);
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

export type ProgressBadgeId =
  | "chips-dodger"
  | "maggi-monk"
  | "cart-without-consequence"
  | "two-am-legend"
  | "salary-saved";

export interface ProgressBadgeDefinition {
  id: ProgressBadgeId;
  name: string;
  lockedHint: string;
}

export interface CompletedOrderItemSummary {
  productId: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  quantity: number;
  price: number;
  calories: number;
  regretScore: number;
}

export interface CompletedOrderRecord {
  id: string;
  timestamp: string;
  items: CompletedOrderItemSummary[];
  totalPrice: number;
  totalCalories: number;
  totalQuantity: number;
  averageRegretScore: number;
  badgeIds: ProgressBadgeId[];
}

export interface ReceiptProgressState {
  countedOrderIds: string[];
  lastCompletedLocalDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCompletedOrders: number;
  completedOrders: CompletedOrderRecord[];
}

export interface ReceiptProgressSummary {
  totalOrders: number;
  totalMoneySaved: number;
  totalCaloriesAvoided: number;
  currentStreak: number;
  longestStreak: number;
  unlockedBadgeIds: ProgressBadgeId[];
  recentOrders: CompletedOrderRecord[];
}

export interface ReceiptProgressContextValue {
  progress: ReceiptProgressState;
  recordCompletedOrder: (order: OrderSnapshot) => ReceiptProgressState;
}

export const progressBadgeDefinitions: ProgressBadgeDefinition[] = [
  {
    id: "chips-dodger",
    name: "Chips Dodger",
    lockedHint: "Avoid one order with Chips & Namkeen.",
  },
  {
    id: "maggi-monk",
    name: "Maggi Monk",
    lockedHint: "Complete an instant-food or noodle-shaped order ritual.",
  },
  {
    id: "cart-without-consequence",
    name: "Cart Without Consequence",
    lockedHint: "Complete 3 order rituals total.",
  },
  {
    id: "two-am-legend",
    name: "2 AM Legend",
    lockedHint: "Complete an order ritual between 2:00 AM and 2:59 AM.",
  },
  {
    id: "salary-saved",
    name: "Salary Saved",
    lockedHint: "Reach Rs 1000 total money saved.",
  },
];

const badgeById = new Map(progressBadgeDefinitions.map((badge) => [badge.id, badge]));

const defaultProgress: ReceiptProgressState = {
  countedOrderIds: [],
  lastCompletedLocalDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalCompletedOrders: 0,
  completedOrders: [],
};

const ReceiptProgressContext = createContext<ReceiptProgressContextValue | undefined>(
  undefined,
);

function getSafeDate(timestamp: string) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function getValidDate(timestamp: string) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyToUtcMs(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getCalendarDayGap(previousDateKey: string, nextDateKey: string) {
  return Math.round((dateKeyToUtcMs(nextDateKey) - dateKeyToUtcMs(previousDateKey)) / DAY_IN_MS);
}

function isCategoryId(value: unknown): value is CategoryId {
  return (
    value === "chips-namkeen" ||
    value === "cold-drinks" ||
    value === "chocolate" ||
    value === "ice-cream" ||
    value === "instant-food" ||
    value === "bakery" ||
    value === "frozen-snacks" ||
    value === "breakfast-regrets" ||
    value === "random-non-food-items" ||
    value === "emotional-purchases"
  );
}

function getLegacyProductKey(name: string, categoryId: CategoryId) {
  return `${categoryId}::${name.trim()}`;
}

function hasValidCatalogStats(product: Product) {
  return (
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    Number.isFinite(product.calories) &&
    product.calories >= 0 &&
    Number.isFinite(product.regretScore) &&
    product.regretScore >= 0 &&
    product.regretScore <= 100
  );
}

function resolveCatalogProduct(item: Partial<CompletedOrderItemSummary>): Product | null {
  if (typeof item.name !== "string" || !isCategoryId(item.categoryId)) {
    return null;
  }

  const itemName = item.name.trim();
  if (!itemName) {
    return null;
  }

  if (typeof item.productId === "string" && item.productId.trim().length > 0) {
    const product = productById.get(item.productId.trim());
    if (!product || product.name !== itemName || product.categoryId !== item.categoryId) {
      return null;
    }

    return hasValidCatalogStats(product) ? product : null;
  }

  const legacyProduct = productByLegacyKey.get(getLegacyProductKey(itemName, item.categoryId));
  return legacyProduct && hasValidCatalogStats(legacyProduct) ? legacyProduct : null;
}

function normalizeItemSummary(value: unknown): CompletedOrderItemSummary | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Partial<CompletedOrderItemSummary>;
  if (
    typeof item.name !== "string" ||
    !isCategoryId(item.categoryId) ||
    typeof item.quantity !== "number" ||
    !Number.isFinite(item.quantity) ||
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0 ||
    item.quantity > MAX_COMPLETED_ORDER_ITEM_QUANTITY
  ) {
    return null;
  }

  const product = resolveCatalogProduct(item);
  if (!product) {
    return null;
  }

  return {
    productId: product.id,
    name: product.name,
    categoryId: product.categoryId,
    categoryName: categoryNames.get(product.categoryId) ?? "Shelf",
    quantity: item.quantity,
    price: product.price,
    calories: product.calories,
    regretScore: product.regretScore,
  };
}

function getCompletedOrderTotals(items: CompletedOrderItemSummary[]) {
  const totals = items.reduce(
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
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    averageRegretScore:
      totals.totalQuantity > 0
        ? Math.round(totals.regretScoreTotal / totals.totalQuantity)
        : 0,
  };
}

function normalizeBadgeIds(value: unknown): ProgressBadgeId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter((badgeId): badgeId is ProgressBadgeId => badgeById.has(badgeId)),
    ),
  );
}

function normalizeCompletedOrderRecord(value: unknown): CompletedOrderRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Partial<CompletedOrderRecord>;
  if (
    typeof record.id !== "string" ||
    record.id.trim().length === 0 ||
    typeof record.timestamp !== "string" ||
    !getValidDate(record.timestamp) ||
    !Array.isArray(record.items)
  ) {
    return null;
  }

  const items = record.items
    .map(normalizeItemSummary)
    .filter((item): item is CompletedOrderItemSummary => Boolean(item));
  if (items.length === 0) {
    return null;
  }

  const totals = getCompletedOrderTotals(items);
  if (totals.totalQuantity <= 0) {
    return null;
  }

  return {
    id: record.id.trim(),
    timestamp: record.timestamp,
    items,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    totalQuantity: totals.totalQuantity,
    averageRegretScore: totals.averageRegretScore,
    badgeIds: normalizeBadgeIds(record.badgeIds),
  };
}

function getUniqueOrderRecords(records: CompletedOrderRecord[]) {
  const seenOrderIds = new Set<string>();
  return records.filter((record) => {
    if (seenOrderIds.has(record.id)) {
      return false;
    }

    seenOrderIds.add(record.id);
    return true;
  });
}

function getSortedOrderRecords(records: CompletedOrderRecord[]) {
  return [...records].sort((firstOrder, secondOrder) => {
    const timestampDifference =
      getSafeDate(firstOrder.timestamp).getTime() - getSafeDate(secondOrder.timestamp).getTime();

    return timestampDifference || firstOrder.id.localeCompare(secondOrder.id);
  });
}

function deriveStreakMetadata(completedOrders: CompletedOrderRecord[]) {
  if (completedOrders.length === 0) {
    return {
      lastCompletedLocalDate: null,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletedOrders: 0,
    };
  }

  const completedDateKeys = Array.from(
    new Set(
      getSortedOrderRecords(completedOrders).map((order) =>
        getLocalDateKey(getSafeDate(order.timestamp)),
      ),
    ),
  );
  let currentRun = 0;
  let longestStreak = 0;
  const runByDateKey = new Map<string, number>();
  let previousDateKey: string | null = null;

  completedDateKeys.forEach((dateKey) => {
    const gap = previousDateKey ? getCalendarDayGap(previousDateKey, dateKey) : null;
    currentRun = gap === 1 ? currentRun + 1 : 1;
    longestStreak = Math.max(longestStreak, currentRun);
    runByDateKey.set(dateKey, currentRun);
    previousDateKey = dateKey;
  });

  const lastCompletedLocalDate = completedDateKeys[completedDateKeys.length - 1];
  const gapFromLastCompletionToToday = getCalendarDayGap(
    lastCompletedLocalDate,
    getLocalDateKey(new Date()),
  );
  const isActiveStreak =
    gapFromLastCompletionToToday === 0 || gapFromLastCompletionToToday === 1;

  return {
    lastCompletedLocalDate,
    currentStreak: isActiveStreak ? runByDateKey.get(lastCompletedLocalDate) ?? 0 : 0,
    longestStreak,
    totalCompletedOrders: completedOrders.length,
  };
}

function getBadgeIdsForCompletedOrder(
  order: Pick<CompletedOrderRecord, "items" | "timestamp">,
  nextCompletedOrders: CompletedOrderRecord[],
): ProgressBadgeId[] {
  const totalMoneySaved = getTotalMoneySaved(nextCompletedOrders);
  const badgeIds: ProgressBadgeId[] = [];

  if (order.items.some((item) => item.categoryId === "chips-namkeen")) {
    badgeIds.push("chips-dodger");
  }

  if (order.items.some((item) => item.categoryId === "instant-food")) {
    badgeIds.push("maggi-monk");
  }

  if (nextCompletedOrders.length >= 3) {
    badgeIds.push("cart-without-consequence");
  }

  if (getSafeDate(order.timestamp).getHours() === 2) {
    badgeIds.push("two-am-legend");
  }

  if (totalMoneySaved >= 1000) {
    badgeIds.push("salary-saved");
  }

  return badgeIds;
}

function deriveBadgeIds(completedOrders: CompletedOrderRecord[]) {
  const badgeIdsByOrderId = new Map<string, ProgressBadgeId[]>();
  const runningOrders: CompletedOrderRecord[] = [];

  getSortedOrderRecords(completedOrders).forEach((order) => {
    const nextOrder = {
      ...order,
      badgeIds: [],
    };
    const nextCompletedOrders = [...runningOrders, nextOrder];
    const badgeIds = getBadgeIdsForCompletedOrder(nextOrder, nextCompletedOrders);

    badgeIdsByOrderId.set(order.id, badgeIds);
    runningOrders.push({
      ...order,
      badgeIds,
    });
  });

  return completedOrders.map((order) => ({
    ...order,
    badgeIds: badgeIdsByOrderId.get(order.id) ?? [],
  }));
}

function buildProgressState(
  countedOrderIds: string[],
  completedOrders: CompletedOrderRecord[],
): ReceiptProgressState {
  const uniqueCompletedOrders = deriveBadgeIds(getUniqueOrderRecords(completedOrders));
  const uniqueCountedOrderIds = Array.from(
    new Set([
      ...countedOrderIds.filter((orderId) => orderId.length > 0),
      ...uniqueCompletedOrders.map((order) => order.id),
    ]),
  );
  const metadata = deriveStreakMetadata(uniqueCompletedOrders);

  return {
    countedOrderIds: uniqueCountedOrderIds,
    ...metadata,
    completedOrders: uniqueCompletedOrders,
  };
}

function normalizeProgress(value: unknown): ReceiptProgressState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaultProgress;
  }

  const progress = value as Partial<ReceiptProgressState>;
  const completedOrders = getUniqueOrderRecords(
    Array.isArray(progress.completedOrders)
      ? progress.completedOrders
          .map(normalizeCompletedOrderRecord)
          .filter((record): record is CompletedOrderRecord => Boolean(record))
      : [],
  );
  const countedOrderIds = Array.from(
    new Set([
      ...(Array.isArray(progress.countedOrderIds)
        ? progress.countedOrderIds.filter(
            (orderId): orderId is string => typeof orderId === "string" && orderId.length > 0,
          )
        : []),
      ...completedOrders.map((order) => order.id),
    ]),
  );

  return buildProgressState(countedOrderIds, completedOrders);
}

function readStoredProgress(): ReceiptProgressState {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    return normalizeProgress(
      JSON.parse(window.localStorage.getItem(RECEIPT_PROGRESS_STORAGE_KEY) ?? "null"),
    );
  } catch {
    return defaultProgress;
  }
}

function writeStoredProgress(progress: ReceiptProgressState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(RECEIPT_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Receipt progress is a bonus; the receipt still renders if storage is blocked.
  }
}

function getTotalMoneySaved(records: CompletedOrderRecord[]) {
  return records.reduce((total, order) => total + order.totalPrice, 0);
}

function getTotalCaloriesAvoided(records: CompletedOrderRecord[]) {
  return records.reduce((total, order) => total + order.totalCalories, 0);
}

function buildCompletedOrderRecord(
  order: OrderSnapshot,
  badgeIds: ProgressBadgeId[],
): CompletedOrderRecord | null {
  const items = order.items
    .map((item) =>
      normalizeItemSummary({
        productId: item.productId,
        name: item.name,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        quantity: item.quantity,
      }),
    )
    .filter((item): item is CompletedOrderItemSummary => Boolean(item));
  const totals = getCompletedOrderTotals(items);

  if (totals.totalQuantity <= 0) {
    return null;
  }

  return {
    id: order.id,
    timestamp: getOrderCompletionTimestamp(order),
    items,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    totalQuantity: totals.totalQuantity,
    averageRegretScore: totals.averageRegretScore,
    badgeIds,
  };
}

function addOrderRecord(
  completedOrders: CompletedOrderRecord[],
  order: OrderSnapshot,
) {
  const placeholderRecord = buildCompletedOrderRecord(order, []);
  if (!placeholderRecord) {
    return completedOrders;
  }

  const nextCompletedOrders = [...completedOrders, placeholderRecord];
  const badgeIds = getBadgeIdsForCompletedOrder(placeholderRecord, nextCompletedOrders);
  const orderRecord = {
    ...placeholderRecord,
    badgeIds,
  };
  return [...completedOrders, orderRecord];
}

function getNextProgress(
  currentProgress: ReceiptProgressState,
  order: OrderSnapshot,
): ReceiptProgressState {
  const hasCountedOrder = currentProgress.countedOrderIds.includes(order.id);
  const hasHistoryRecord = currentProgress.completedOrders.some(
    (completedOrder) => completedOrder.id === order.id,
  );

  if (hasCountedOrder && hasHistoryRecord) {
    return currentProgress;
  }

  const completedOrders = hasHistoryRecord
    ? currentProgress.completedOrders
    : addOrderRecord(currentProgress.completedOrders, order);

  if (hasCountedOrder) {
    return buildProgressState(currentProgress.countedOrderIds, completedOrders);
  }

  return buildProgressState([...currentProgress.countedOrderIds, order.id], completedOrders);
}

export function getProjectedReceiptProgress(
  currentProgress: ReceiptProgressState,
  order: OrderSnapshot,
) {
  return getNextProgress(currentProgress, order);
}

export function getReceiptProgressSummary(
  progress: ReceiptProgressState,
): ReceiptProgressSummary {
  const unlockedBadgeIds = Array.from(
    new Set(progress.completedOrders.flatMap((order) => order.badgeIds)),
  );

  return {
    totalOrders: progress.completedOrders.length,
    totalMoneySaved: getTotalMoneySaved(progress.completedOrders),
    totalCaloriesAvoided: getTotalCaloriesAvoided(progress.completedOrders),
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    unlockedBadgeIds,
    recentOrders: [...progress.completedOrders]
      .sort((firstOrder, secondOrder) =>
        getSafeDate(secondOrder.timestamp).getTime() - getSafeDate(firstOrder.timestamp).getTime(),
      )
      .slice(0, 8),
  };
}

export function getProgressBadgeName(badgeId: ProgressBadgeId) {
  return badgeById.get(badgeId)?.name ?? "Successfully Not Ordered";
}

export function getPrimaryBadgeNameForOrder(
  progress: ReceiptProgressState,
  orderId: string,
) {
  const order = progress.completedOrders.find((completedOrder) => completedOrder.id === orderId);
  const primaryBadgeId = order?.badgeIds[0];
  return primaryBadgeId ? getProgressBadgeName(primaryBadgeId) : "Successfully Not Ordered";
}

export function ReceiptProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ReceiptProgressState>(() => readStoredProgress());
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
    writeStoredProgress(progress);
  }, [progress]);

  const recordCompletedOrder = useCallback((order: OrderSnapshot) => {
    const recordedProgress = getProjectedReceiptProgress(progressRef.current, order);
    progressRef.current = recordedProgress;
    setProgress(recordedProgress);

    return recordedProgress;
  }, []);

  const value = useMemo<ReceiptProgressContextValue>(
    () => ({
      progress,
      recordCompletedOrder,
    }),
    [progress, recordCompletedOrder],
  );

  return (
    <ReceiptProgressContext.Provider value={value}>
      {children}
    </ReceiptProgressContext.Provider>
  );
}

export function useReceiptProgress() {
  const progress = useContext(ReceiptProgressContext);

  if (!progress) {
    throw new Error("useReceiptProgress must be used inside ReceiptProgressProvider.");
  }

  return progress;
}
