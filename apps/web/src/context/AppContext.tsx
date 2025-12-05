import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import { useLocation } from "@tanstack/react-router";

export interface AppState {
  pinnedApps: string[];
  activeApp: string | null;
  barHidden: boolean;
}

interface AppContextType extends AppState {
  addPinnedApp: (appId: string) => void;
  removePinnedApp: (appId: string) => void;
  setBarHidden: (hidden: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pinnedApps, setPinnedApps] = useState<string[]>([
    "Dashboard",
    "Shop",
    "Apps",
    "Library",
    "Settings",
  ]);
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

  const addPinnedApp = (appId: string) => {
    if (!pinnedApps.includes(appId)) {
      setPinnedApps([...pinnedApps, appId]);
    }
  };

  const removePinnedApp = (appId: string) => {
    setPinnedApps(pinnedApps.filter((id) => id !== appId));
  };

  return (
    <AppContext.Provider
      value={{
        barHidden,
        setBarHidden,
        pinnedApps,
        activeApp,
        addPinnedApp,
        removePinnedApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
