import { NavLink } from "react-router-dom";

type SidebarProps = {
  watchedCount: number;
  pendingCount: number;
  gameCompletedCount?: number;
  gameWantedCount?: number;
  gamePlayingCount?: number;
  gameAbandonedCount?: number;
  gameReplayingCount?: number;
  isGames?: boolean;
};

export function Sidebar({
  watchedCount,
  pendingCount,
  gameCompletedCount = 0,
  gameWantedCount = 0,
  gamePlayingCount = 0,
  gameAbandonedCount = 0,
  gameReplayingCount = 0,
  isGames = false,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          WL
        </span>
        <div>
          <strong>Watchlog</strong>
          <p>Bitácora personal</p>
        </div>
      </div>

      <nav className="nav">
        {isGames ? (
          <>
            <NavLink to="/games/want"><span>Quiero Jugar</span><b className="nav__count">{gameWantedCount}</b></NavLink>
            <NavLink to="/games/playing"><span>Jugando</span><b className="nav__count">{gamePlayingCount}</b></NavLink>
            <NavLink to="/games/completed"><span>Completado</span><b className="nav__count">{gameCompletedCount}</b></NavLink>
            <NavLink to="/games/abandoned"><span>Abandonado</span><b className="nav__count">{gameAbandonedCount}</b></NavLink>
            <NavLink to="/games/replaying"><span>Rejugando</span><b className="nav__count">{gameReplayingCount}</b></NavLink>
          </>
        ) : (
          <>
            <NavLink to="/">Buscar película o serie</NavLink>
            <NavLink to="/watched"><span>Vistas</span><b className="nav__count">{watchedCount}</b></NavLink>
            <NavLink to="/pending"><span>Pendientes</span><b className="nav__count">{pendingCount}</b></NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
