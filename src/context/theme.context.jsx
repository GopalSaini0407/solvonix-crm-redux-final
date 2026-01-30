import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const THEMES = [
  { label: "Light", value: "theme-light" },
  { label: "Dark", value: "theme-dark" },
  { label: "Blue", value: "theme-blue" },
  { label: "Green", value: "theme-green" },
  { label: "Purple", value: "theme-purple" },
  { label: "Red", value: "theme-red" },
  { label: "Orange", value: "theme-orange" },
  { label: "Teal", value: "theme-teal" },
  { label: "Cyan", value: "theme-cyan" },
  { label: "Pink", value: "theme-pink" },

];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("theme-light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "theme-light";
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    document.documentElement.className = themeName;
    localStorage.setItem("theme", themeName);
    setTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
