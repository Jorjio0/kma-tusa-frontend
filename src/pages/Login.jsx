import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/profile";

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  if (user) return <Navigate to={from} replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setError(null);
    try {
      await login(form.username, form.password);
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setError(err.fieldErrors ? null : err.message);
      setSaving(false);
    }
  }

  return (
    <section className="panel auth-card">
      <h1>Вхід</h1>
      {location.state?.from && <p className="muted">Щоб відкрити цю сторінку, увійдіть в акаунт.</p>}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className={`field${errors.username ? " has-error" : ""}`}>
          <label htmlFor="username">Ім'я користувача</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} autoComplete="username" />
          {errors.username && <small className="error">{errors.username.join(" ")}</small>}
        </div>

        <div className={`field${errors.password ? " has-error" : ""}`}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <small className="error">{errors.password.join(" ")}</small>}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Входжу…" : "Увійти"}
        </button>
      </form>

      <p className="muted">
        Ще немає акаунта? <Link to="/register">Зареєструватися</Link>
      </p>
    </section>
  );
}
