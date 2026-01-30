import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();


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
