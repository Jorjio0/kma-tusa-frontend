import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { authApi } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const fields = [
  { name: "username", label: "Ім'я користувача", required: true, autoComplete: "username" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "first_name", label: "Ім'я", autoComplete: "given-name" },
  { name: "last_name", label: "Прізвище", autoComplete: "family-name" },
  {
    name: "password",
    label: "Пароль",
    type: "password",
    required: true,
    autoComplete: "new-password",
    hint: "Щонайменше 8 символів, не лише цифри",
  },
  {
    name: "password_confirm",
    label: "Повторіть пароль",
    type: "password",
    required: true,
    autoComplete: "new-password",
  },
];

const emptyForm = { username: "", email: "", first_name: "", last_name: "", password: "", password_confirm: "" };

export default function Register() {
  const { user, login } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  if (user) return <Navigate to="/profile" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setError(null);
    try {
      await authApi.register(form);
      await login(form.username, form.password);
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setError(err.fieldErrors ? null : err.message);
      setSaving(false);
    }
  }

  return (
    <section className="panel auth-card">
      <h1>Реєстрація</h1>

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {fields.map((field) => (
          <div key={field.name} className={`field${errors[field.name] ? " has-error" : ""}`}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="req"> *</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={handleChange}
              autoComplete={field.autoComplete}
            />
            {field.hint && !errors[field.name] && <small className="hint">{field.hint}</small>}
            {errors[field.name] && <small className="error">{errors[field.name].join(" ")}</small>}
          </div>
        ))}

        {error && <div className="alert alert-error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Реєструю…" : "Зареєструватися"}
        </button>
      </form>

      <p className="muted">
        Уже є акаунт? <Link to="/login">Увійти</Link>
      </p>
    </section>
  );
}
