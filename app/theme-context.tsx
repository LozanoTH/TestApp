import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type ThemePreference = "auto" | "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedScheme: "light" | "dark";
  setPreference: (value: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme-preference";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme() ?? "light";
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (value === "light" || value === "dark" || value === "auto") {
          setPreferenceState(value);
        }
      } catch {
        // ignore storage errors
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const setPreference = async (value: ThemePreference) => {
    setPreferenceState(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
  };

  const resolvedScheme: "light" | "dark" =
    preference === "auto" ? systemScheme : preference;

  const ctx = useMemo(
    () => ({ preference, resolvedScheme, setPreference }),
    [preference, resolvedScheme]
  );

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
