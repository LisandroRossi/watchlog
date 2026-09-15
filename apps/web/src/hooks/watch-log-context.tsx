import { createContext, useContext, type ReactNode } from "react";
import { useWatchLog } from "../hooks/use-watch-log";

type WatchLogContextValue = ReturnType<typeof useWatchLog>;

const WatchLogContext = createContext<WatchLogContextValue | null>(null);

export function WatchLogProvider({ children }: { children: ReactNode }) {
  const value = useWatchLog();
  return <WatchLogContext.Provider value={value}>{children}</WatchLogContext.Provider>;
}

export function useWatchLogContext() {
  const value = useContext(WatchLogContext);
  if (!value) {
    throw new Error("useWatchLogContext debe usarse dentro de WatchLogProvider");
  }
  return value;
}
