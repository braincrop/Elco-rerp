"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {tenantConfig} from "../utils/tenantConfig";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("");
  useEffect(() => {
    if (tenantConfig?.themeColor) {
    setTheme(tenantConfig);
    document.body.style.backgroundColor = tenantConfig.themeColor;
  }
  }, [tenantConfig]);

  return (
    <ThemeContext.Provider value={{ theme:theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);