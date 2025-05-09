"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./ThemeToggle.module.scss";

export const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button onClick={toggleDarkMode} className={styles.toggle}>
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};
