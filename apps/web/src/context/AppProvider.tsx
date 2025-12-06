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
    if (match) {
      return match[1];
    }

    return "dashboard";
  }, [location.pathname]);

  return (
    <AppContext.Provider
      value={{
        barHidden,
        setBarHidden,
        activeApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
