"use client";

import { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    // Cek preferensi dark mode dari localStorage dan fallback ke preferensi sistem jika tidak ada
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDark = savedDarkMode
      ? JSON.parse(savedDarkMode)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // Menangani perubahan ukuran layar untuk sidebar mobile
    const handleResize = () => {
      setMobileSidebar(window.innerWidth < 768);
    };

    handleResize(); // Cek ukuran layar awal
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark-mode", newMode);
     document.documentElement.classList.toggle('dark', newMode);
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
  return useContext(AppContext);
}
