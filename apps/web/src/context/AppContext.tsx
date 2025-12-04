import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AppState {
  pinnedApps: string[];
  activeApp: string | null;
}

interface AppContextType extends AppState {
  setActiveApp: (appId: string | null) => void;
  addPinnedApp: (appId: string) => void;
  removePinnedApp: (appId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pinnedApps, setPinnedApps] = useState<string[]>(['Dashboard', 'Shop', 'Apps', 'Library', 'Settings']);
  const [activeApp, setActiveApp] = useState<string | null>(null);

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
        pinnedApps,
        activeApp,
        setActiveApp,
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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
