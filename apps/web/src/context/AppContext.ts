import { createContext } from "react";

export interface AppState {
  activeApp: string | null;
  barHidden: boolean;
}

interface AppContextType extends AppState {
  setBarHidden: (hidden: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
