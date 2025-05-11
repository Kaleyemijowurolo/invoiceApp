// import { createContext, useContext, useState, ReactNode } from "react";

// interface ThemeContextType {
//   darkMode: boolean;
//   toggleDarkMode: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode((prev) => !prev);
//     document.body.className = darkMode ? "light-mode" : "dark-mode";
//   };

//   return (
//     <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("useTheme must be used within a ThemeProvider");
//   return context;
// };

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark-mode" : false;
    }
    return false;
  });

  useEffect(() => {
    const themeClass = darkMode ? "dark-mode" : "light-mode";
    document.documentElement.className = themeClass; // Apply to <html>
    document.body.className = darkMode ? "dark-mode" : "light-mode";

    localStorage.setItem("theme", themeClass);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
