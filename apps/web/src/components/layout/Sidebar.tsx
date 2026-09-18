import { useState } from "react";
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
  userName: string;
  userEmail: string;
  onLogout: () => Promise<void>;
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
  userName,
  userEmail,
  onLogout,
}: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand">
        <button className="brand__mark brand__mark--button" aria-label="Abrir perfil" onClick={() => setProfileOpen((open) => !open)}>
          {initials || "U"}
        </button>
        <button className="brand__profile" onClick={() => setProfileOpen((open) => !open)}>
          <strong>{userName}</strong>
          <p>Ver perfil</p>
        </button>
      </div>

      {profileOpen ? (
        <section className="profile-panel">
          <span className="profile-panel__eyebrow">Perfil</span>
          <strong>{userName}</strong>
          <span>{userEmail}</span>
          <button className="sidebar__logout" onClick={onLogout}>Cerrar sesión</button>
        </section>
      ) : null}

      <nav className="nav">
        {isGames ? (
          <>
            <NavLink to="/games">Buscar videojuego</NavLink>
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
