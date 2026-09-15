import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { useWatchLogContext } from "./hooks/watch-log-context";

export function App() {
  const { watched, pending } = useWatchLogContext();

  return (
    <div className="shell">
      <Sidebar watchedCount={watched.length} pendingCount={pending.length} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
