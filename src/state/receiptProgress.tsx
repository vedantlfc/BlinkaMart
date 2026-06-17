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
import type { FakeOrderSnapshot } from "./fakeOrder";

const RECEIPT_PROGRESS_STORAGE_KEY = "blinkamart.receiptProgress.v1";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface ReceiptProgressState {
  countedOrderIds: string[];
  lastCompletedLocalDate: string | null;
  currentStreak: number;
  totalCompletedFakeOrders: number;
}

export interface ReceiptProgressContextValue {
  progress: ReceiptProgressState;
  recordCompletedOrder: (order: FakeOrderSnapshot) => ReceiptProgressState;
}

const defaultProgress: ReceiptProgressState = {
  countedOrderIds: [],
  lastCompletedLocalDate: null,
  currentStreak: 0,
  totalCompletedFakeOrders: 0,
};

const ReceiptProgressContext = createContext<ReceiptProgressContextValue | undefined>(
  undefined,
);

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isLocalDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function dateKeyToUtcMs(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getCalendarDayGap(previousDateKey: string, nextDateKey: string) {
  return Math.round((dateKeyToUtcMs(nextDateKey) - dateKeyToUtcMs(previousDateKey)) / DAY_IN_MS);
}

function normalizeProgress(value: unknown): ReceiptProgressState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaultProgress;
  }

  const progress = value as Partial<ReceiptProgressState>;
  const countedOrderIds = Array.isArray(progress.countedOrderIds)
    ? Array.from(
        new Set(
          progress.countedOrderIds.filter(
            (orderId): orderId is string => typeof orderId === "string" && orderId.length > 0,
          ),
        ),
      )
    : [];
  const storedCurrentStreak =
    typeof progress.currentStreak === "number" &&
    Number.isFinite(progress.currentStreak) &&
    Number.isInteger(progress.currentStreak) &&
    progress.currentStreak >= 0
      ? progress.currentStreak
      : 0;
  const currentStreak =
    countedOrderIds.length > 0 && storedCurrentStreak === 0 ? 1 : storedCurrentStreak;
  const storedTotalCompletedFakeOrders =
    typeof progress.totalCompletedFakeOrders === "number" &&
    Number.isFinite(progress.totalCompletedFakeOrders) &&
    Number.isInteger(progress.totalCompletedFakeOrders) &&
    progress.totalCompletedFakeOrders >= 0
      ? progress.totalCompletedFakeOrders
      : countedOrderIds.length;
  const totalCompletedFakeOrders = Math.max(
    storedTotalCompletedFakeOrders,
    countedOrderIds.length,
  );

  return {
    countedOrderIds,
    lastCompletedLocalDate: isLocalDateKey(progress.lastCompletedLocalDate)
      ? progress.lastCompletedLocalDate
      : null,
    currentStreak,
    totalCompletedFakeOrders,
  };
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

function getNextProgress(
  currentProgress: ReceiptProgressState,
  order: FakeOrderSnapshot,
  completedLocalDate: string,
): ReceiptProgressState {
  if (currentProgress.countedOrderIds.includes(order.id)) {
    return currentProgress;
  }

  const gap = currentProgress.lastCompletedLocalDate
    ? getCalendarDayGap(currentProgress.lastCompletedLocalDate, completedLocalDate)
    : null;
  const nextStreak =
    gap === null
      ? 1
      : gap === 0
        ? Math.max(currentProgress.currentStreak, 1)
        : gap === 1
          ? currentProgress.currentStreak + 1
          : 1;

  return {
    countedOrderIds: [...currentProgress.countedOrderIds, order.id],
    lastCompletedLocalDate: completedLocalDate,
    currentStreak: nextStreak,
    totalCompletedFakeOrders: currentProgress.totalCompletedFakeOrders + 1,
  };
}

export function getProjectedReceiptProgress(
  currentProgress: ReceiptProgressState,
  order: FakeOrderSnapshot,
) {
  return getNextProgress(currentProgress, order, getLocalDateKey(new Date()));
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
