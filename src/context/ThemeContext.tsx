"use client";

import React, { useEffect, useState } from "react";
import { ThemeContext } from "../hooks/useTheme";

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: string | boolean) => void; // Added setTheme function
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Whether to persist theme changes to localStorage (default: true) */
  persistTheme?: boolean;
  /** Whether to check system preference on first load (default: true) */
  useSystemTheme?: boolean;
  /** Default theme when no persistence or system theme detection (default: false = light) */
  defaultTheme?: "light" | "dark";
  /** Storage key for localStorage (default: 'theme') */
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  persistTheme = true,
  useSystemTheme = true,
  defaultTheme = "light",
  storageKey = "theme",
}) => {
  // Initialize theme based on props configuration
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 1. First priority: Check saved theme if persistence is enabled
    if (persistTheme && typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme) {
        return savedTheme === "dark";
      }
    }

    // 2. Second priority: Check system preference if enabled
    if (useSystemTheme && typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    // 3. Fallback to default theme
    return defaultTheme === "dark";
  });

  useEffect(() => {
    // Update class on document element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage only if persistence is enabled
    if (persistTheme && typeof window !== "undefined") {
      localStorage.setItem(storageKey, isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode, persistTheme, storageKey]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Added setTheme function that accepts string or boolean
  const setTheme = (theme: string | boolean) => {
    if (typeof theme === "boolean") {
      setIsDarkMode(theme);
    } else {
      setIsDarkMode(theme === "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
