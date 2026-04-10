"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {tenantConfig} from "../utils/tenantConfig";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID

const url =`https://sprucesol.com/${clientId}/branding.json`

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch theme");
        }
        const data = await response.json();
        setTheme(data);
        console.log("Fetched theme:", data);
        // document.body.style.backgroundColor = data.themeColor;
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    }
    fetchTheme();
  }, []);

  useEffect(() => {
    if (theme && theme.secondaryColor) {
    document.body.style.backgroundColor = theme.secondaryColor;
  }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme:theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);