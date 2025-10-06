// hooks/useTheme.ts
import { ThemeContextType } from "@/context/ThemeContext";
import { createContext, useContext } from "react";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
