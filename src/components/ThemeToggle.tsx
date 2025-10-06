"use client";

import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  variant = "desktop",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid rendering mismatched text/icons during SSR
    return null;
  }

  if (variant === "mobile") {
    return (
      <button type="button" onClick={onToggle} className="text-sm">
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="hidden md:inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default ThemeToggle;
