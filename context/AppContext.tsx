"use client";

import { createContext, useState, useContext, useEffect } from "react";

type AppContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activePage: number;
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  mobileSidebar: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDark = savedDarkMode
      ? JSON.parse(savedDarkMode)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const handleResize = () => {
      setMobileSidebar(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    document.body.classList.toggle("dark-mode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        activePage,
        setActivePage,
        mobileSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
