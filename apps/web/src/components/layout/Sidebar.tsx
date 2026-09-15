import { NavLink } from "react-router-dom";

type SidebarProps = {
  watchedCount: number;
  pendingCount: number;
};

export function Sidebar({ watchedCount, pendingCount }: SidebarProps) {
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
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/watched">
          <span>Vistas</span>
          <b className="nav__count">{watchedCount}</b>
        </NavLink>
        <NavLink to="/pending">
          <span>Pendientes</span>
          <b className="nav__count">{pendingCount}</b>
        </NavLink>
      </nav>
    </aside>
  );
}
