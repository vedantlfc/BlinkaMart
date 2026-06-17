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
import type { CategoryId } from "../data/catalog";
import type { FakeOrderSnapshot } from "./fakeOrder";

const RECEIPT_PROGRESS_STORAGE_KEY = "blinkamart.receiptProgress.v1";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  quantity: number;
}

export interface CompletedFakeOrderRecord {
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
  totalCompletedFakeOrders: number;
  completedOrders: CompletedFakeOrderRecord[];
}

export interface ReceiptProgressSummary {
  totalFakeOrders: number;
  totalMoneySaved: number;
  totalCaloriesAvoided: number;
  currentStreak: number;
  longestStreak: number;
  unlockedBadgeIds: ProgressBadgeId[];
  recentOrders: CompletedFakeOrderRecord[];
}

export interface ReceiptProgressContextValue {
  progress: ReceiptProgressState;
  recordCompletedOrder: (order: FakeOrderSnapshot) => ReceiptProgressState;
}

export const progressBadgeDefinitions: ProgressBadgeDefinition[] = [
  {
    id: "chips-dodger",
    name: "Chips Dodger",
    lockedHint: "Avoid one fake order with Chips & Namkeen.",
  },
  {
    id: "maggi-monk",
    name: "Maggi Monk",
    lockedHint: "Cancel a lazy meal or noodle-shaped almost-order.",
  },
  {
    id: "cart-without-consequence",
    name: "Cart Without Consequence",
    lockedHint: "Complete 3 fake orders total.",
  },
  {
    id: "two-am-legend",
    name: "2 AM Legend",
    lockedHint: "Successfully not-order something between 2:00 AM and 2:59 AM.",
  },
  {
    id: "salary-saved",
    name: "Salary Saved",
    lockedHint: "Reach Rs 1000 total fake money saved.",
  },
];

const badgeById = new Map(progressBadgeDefinitions.map((badge) => [badge.id, badge]));

const defaultProgress: ReceiptProgressState = {
  countedOrderIds: [],
  lastCompletedLocalDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalCompletedFakeOrders: 0,
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
    value === "sweet-cravings" ||
    value === "lazy-meals" ||
    value === "random-midnight"
  );
}

function normalizeItemSummary(value: unknown): CompletedOrderItemSummary | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Partial<CompletedOrderItemSummary>;
  if (
    typeof item.name !== "string" ||
    !isCategoryId(item.categoryId) ||
    typeof item.categoryName !== "string" ||
    typeof item.quantity !== "number" ||
    !Number.isFinite(item.quantity) ||
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0 ||
    item.quantity > 99
  ) {
    return null;
  }

  return {
    name: item.name,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    quantity: item.quantity,
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

function normalizeCompletedOrderRecord(value: unknown): CompletedFakeOrderRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Partial<CompletedFakeOrderRecord>;
  if (
    typeof record.id !== "string" ||
    record.id.length === 0 ||
    typeof record.timestamp !== "string" ||
    !getValidDate(record.timestamp) ||
    !Array.isArray(record.items) ||
    typeof record.totalPrice !== "number" ||
    !Number.isFinite(record.totalPrice) ||
    record.totalPrice < 0 ||
    typeof record.totalCalories !== "number" ||
    !Number.isFinite(record.totalCalories) ||
    record.totalCalories < 0 ||
    typeof record.totalQuantity !== "number" ||
    !Number.isFinite(record.totalQuantity) ||
    !Number.isInteger(record.totalQuantity) ||
    record.totalQuantity <= 0 ||
    typeof record.averageRegretScore !== "number" ||
    !Number.isFinite(record.averageRegretScore) ||
    record.averageRegretScore < 0 ||
    record.averageRegretScore > 100
  ) {
    return null;
  }

  const items = record.items
    .map(normalizeItemSummary)
    .filter((item): item is CompletedOrderItemSummary => Boolean(item));
  if (items.length === 0) {
    return null;
  }

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  if (totalQuantity !== record.totalQuantity) {
    return null;
  }

  return {
    id: record.id,
    timestamp: record.timestamp,
    items,
    totalPrice: record.totalPrice,
    totalCalories: record.totalCalories,
    totalQuantity: record.totalQuantity,
    averageRegretScore: record.averageRegretScore,
    badgeIds: normalizeBadgeIds(record.badgeIds),
  };
}

function getUniqueOrderRecords(records: CompletedFakeOrderRecord[]) {
  const seenOrderIds = new Set<string>();
  return records.filter((record) => {
    if (seenOrderIds.has(record.id)) {
      return false;
    }

    seenOrderIds.add(record.id);
    return true;
  });
}

function getSortedOrderRecords(records: CompletedFakeOrderRecord[]) {
  return [...records].sort((firstOrder, secondOrder) => {
    const timestampDifference =
      getSafeDate(firstOrder.timestamp).getTime() - getSafeDate(secondOrder.timestamp).getTime();

    return timestampDifference || firstOrder.id.localeCompare(secondOrder.id);
  });
}

function deriveStreakMetadata(completedOrders: CompletedFakeOrderRecord[]) {
  if (completedOrders.length === 0) {
    return {
      lastCompletedLocalDate: null,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletedFakeOrders: 0,
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
  let previousDateKey: string | null = null;

  completedDateKeys.forEach((dateKey) => {
    const gap = previousDateKey ? getCalendarDayGap(previousDateKey, dateKey) : null;
    currentRun = gap === 1 ? currentRun + 1 : 1;
    longestStreak = Math.max(longestStreak, currentRun);
    previousDateKey = dateKey;
  });

  return {
    lastCompletedLocalDate: completedDateKeys[completedDateKeys.length - 1],
    currentStreak: currentRun,
    longestStreak: Math.max(longestStreak, currentRun),
    totalCompletedFakeOrders: completedOrders.length,
  };
}

function getBadgeIdsForCompletedOrder(
  order: Pick<CompletedFakeOrderRecord, "items" | "timestamp">,
  nextCompletedOrders: CompletedFakeOrderRecord[],
): ProgressBadgeId[] {
  const totalMoneySaved = getTotalMoneySaved(nextCompletedOrders);
  const badgeIds: ProgressBadgeId[] = [];

  if (order.items.some((item) => item.categoryId === "chips-namkeen")) {
    badgeIds.push("chips-dodger");
  }

  if (order.items.some((item) => item.categoryId === "lazy-meals")) {
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

function deriveBadgeIds(completedOrders: CompletedFakeOrderRecord[]) {
  const badgeIdsByOrderId = new Map<string, ProgressBadgeId[]>();
  const runningOrders: CompletedFakeOrderRecord[] = [];

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
  completedOrders: CompletedFakeOrderRecord[],
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
          .filter((record): record is CompletedFakeOrderRecord => Boolean(record))
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

function getTotalMoneySaved(records: CompletedFakeOrderRecord[]) {
  return records.reduce((total, order) => total + order.totalPrice, 0);
}

function getTotalCaloriesAvoided(records: CompletedFakeOrderRecord[]) {
  return records.reduce((total, order) => total + order.totalCalories, 0);
}

function getBadgeIdsForOrder(
  order: FakeOrderSnapshot,
  nextCompletedOrders: CompletedFakeOrderRecord[],
): ProgressBadgeId[] {
  return getBadgeIdsForCompletedOrder(order, nextCompletedOrders);
}

function buildCompletedOrderRecord(
  order: FakeOrderSnapshot,
  badgeIds: ProgressBadgeId[],
): CompletedFakeOrderRecord {
  return {
    id: order.id,
    timestamp: order.timestamp,
    items: order.items.map((item) => ({
      name: item.name,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      quantity: item.quantity,
    })),
    totalPrice: order.totalPrice,
    totalCalories: order.totalCalories,
    totalQuantity: order.totalQuantity,
    averageRegretScore: order.averageRegretScore,
    badgeIds,
  };
}

function addOrderRecord(
  completedOrders: CompletedFakeOrderRecord[],
  order: FakeOrderSnapshot,
) {
  const placeholderRecord = buildCompletedOrderRecord(order, []);
  const nextCompletedOrders = [...completedOrders, placeholderRecord];
  const badgeIds = getBadgeIdsForOrder(order, nextCompletedOrders);
  const orderRecord = buildCompletedOrderRecord(order, badgeIds);
  return [...completedOrders, orderRecord];
}

function getNextProgress(
  currentProgress: ReceiptProgressState,
  order: FakeOrderSnapshot,
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
  order: FakeOrderSnapshot,
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
    totalFakeOrders: progress.completedOrders.length,
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

  const recordCompletedOrder = useCallback((order: FakeOrderSnapshot) => {
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
