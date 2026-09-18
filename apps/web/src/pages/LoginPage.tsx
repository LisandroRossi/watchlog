import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth-context";

export function LoginPage() {
  const { user, loading, error, login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [navigate, user]);

  if (loading) return <main className="auth-page"><p>Comprobando sesión...</p></main>;
  if (user) return <Navigate to="/" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await (isRegistering ? register(name, email, password) : login(email, password));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand"><span className="brand__mark">WL</span><span>Watchlog</span></div>
        <p className="auth-kicker">Tu bitácora personal</p>
        <h1>{isRegistering ? "Crea tu cuenta" : "Volvé a tu catálogo"}</h1>
        <p className="lede">Guardá lo que viste, lo que querés ver y tus partidas en un solo lugar.</p>
        <form className="auth-form" onSubmit={submit}>
          {isRegistering ? <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" /></label> : null}
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={isRegistering ? "new-password" : "current-password"} /></label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn btn--primary auth-submit" disabled={submitting}>{submitting ? "Entrando..." : isRegistering ? "Crear cuenta" : "Iniciar sesión"}</button>
        </form>
        <button className="auth-switch" onClick={() => setIsRegistering((current) => !current)}>{isRegistering ? "Ya tengo una cuenta" : "Crear una cuenta nueva"}</button>
      </section>
    </main>
  );
}