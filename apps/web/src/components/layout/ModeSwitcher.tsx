import { NavLink } from "react-router-dom";

export function ModeSwitcher() {
  return (
    <nav className="mode-switcher" aria-label="Tipo de contenido">
      <NavLink to="/" end className={({ isActive }) => isActive ? "mode-switcher__button mode-switcher__button--movies active" : "mode-switcher__button mode-switcher__button--movies"}>
        Películas / series
      </NavLink>
      <NavLink to="/games" className={({ isActive }) => isActive ? "mode-switcher__button mode-switcher__button--games active" : "mode-switcher__button mode-switcher__button--games"}>
        Videojuegos
      </NavLink>
      <NavLink to="/books" className={({ isActive }) => isActive ? "mode-switcher__button mode-switcher__button--books active" : "mode-switcher__button mode-switcher__button--books"}>
        Libros
      </NavLink>
    </nav>
  );
}
