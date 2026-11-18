import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function RequireAuth({ adminOnly = false, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <p className="empty">Завантаження…</p>;

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (adminOnly && !user.is_staff) {
    return (
      <section className="panel">
        <h2>Доступ лише для адміністраторів</h2>
        <p className="muted">Ця сторінка доступна лише адміністраторам. Ви увійшли як {user.username}.</p>
      </section>
    );
  }

  return children;
}
