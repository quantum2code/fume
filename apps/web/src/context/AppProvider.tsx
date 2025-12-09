import { useState, type ReactNode, useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { AppContext } from "./AppContext";

export function AppProvider({ children }: { children: ReactNode }) {
  const [barHidden, setBarHidden] = useState(false);
  const location = useLocation();

  //active app logic
  const activeApp = useMemo(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "dashboard";
    if (path.includes("shop")) return "shop";
    if (path.includes("library")) return "library";
    if (path.includes("settings")) return "settings";

    const match = path.match(/^\/apps\/(\d+)/);
    if (match && match[1]) {
      return match[1];
    }

    return "dashboard";
  }, [location.pathname]) as string;

  //background image logic
  const backgroundImage = useMemo(() => {
    // System pages don't have background images
    if (
      activeApp === "dashboard" ||
      activeApp === "shop" ||
      activeApp === "library" ||
      activeApp === "settings"
    ) {
      return null;
    }
    // For app pages, use library_hero.jpg for high-res backgrounds
    if (activeApp && /^\d+$/.test(activeApp)) {
      return `https://steamcdn-a.akamaihd.net/steam/apps/${activeApp}/library_hero.jpg`;
    }
    return null;
  }, [activeApp]);

  return (
    <AppContext.Provider
      value={{
        barHidden,
        setBarHidden,
        activeApp,
        backgroundImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
