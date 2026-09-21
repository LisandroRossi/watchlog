import { createContext, useContext, type ReactNode } from "react";
import { useBookLog } from "./use-book-log";

type BookLogContextValue = ReturnType<typeof useBookLog>;
const BookLogContext = createContext<BookLogContextValue | null>(null);

export function BookLogProvider({ children }: { children: ReactNode }) {
  return <BookLogContext.Provider value={useBookLog()}>{children}</BookLogContext.Provider>;
}

export function useBookLogContext() {
  const value = useContext(BookLogContext);
  if (!value) throw new Error("useBookLogContext debe usarse dentro de BookLogProvider");
  return value;
}
