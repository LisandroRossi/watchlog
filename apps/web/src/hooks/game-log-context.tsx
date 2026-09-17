import { createContext, useContext, type ReactNode } from "react";
import { useGameLog } from "./use-game-log";

type GameLogContextValue = ReturnType<typeof useGameLog>;
const GameLogContext = createContext<GameLogContextValue | null>(null);

export function GameLogProvider({ children }: { children: ReactNode }) {
  return <GameLogContext.Provider value={useGameLog()}>{children}</GameLogContext.Provider>;
}

export function useGameLogContext() {
  const value = useContext(GameLogContext);
  if (!value) throw new Error("useGameLogContext debe usarse dentro de GameLogProvider");
  return value;
}
