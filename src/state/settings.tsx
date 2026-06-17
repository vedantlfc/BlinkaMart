import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SETTINGS_STORAGE_KEY = "blinkamart.settings.v1";

export interface AppSettings {
  showCalories: boolean;
}

export interface SettingsContextValue extends AppSettings {
  setShowCalories: (showCalories: boolean) => void;
}

const defaultSettings: AppSettings = {
  showCalories: true,
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaultSettings;
  }

  const settings = value as Partial<AppSettings>;

  return {
    showCalories:
      typeof settings.showCalories === "boolean"
        ? settings.showCalories
        : defaultSettings.showCalories,
  };
}

function readStoredSettings(): AppSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    return normalizeSettings(
      JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "{}"),
    );
  } catch {
    return defaultSettings;
  }
}

function writeStoredSettings(settings: AppSettings) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // The app still works if the browser blocks storage.
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => readStoredSettings());

  useEffect(() => {
    writeStoredSettings(settings);
  }, [settings]);

  const setShowCalories = useCallback((showCalories: boolean) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      showCalories,
    }));
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setShowCalories,
    }),
    [setShowCalories, settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("useSettings must be used inside SettingsProvider.");
  }

  return settings;
}
