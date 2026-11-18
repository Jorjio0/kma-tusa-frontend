import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  return (
    <>
      <div className="page-head">
        <h1>Мій кабінет</h1>
        <p className="lead">Привіт, {user.first_name || user.username}! Ця сторінка доступна лише після входу.</p>
      </div>

      <section className="panel">
        <h2>Мої дані</h2>
        <dl className="profile-list">
          <dt>Ім'я користувача</dt>
          <dd>{user.username}</dd>
          <dt>Ім'я та прізвище</dt>
          <dd>{fullName || <span className="muted">не вказано</span>}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Роль</dt>
          <dd>
            <span className={`badge ${user.is_staff ? "badge-donation" : "badge-free"}`}>
              {user.is_staff ? "Адміністратор" : "Користувач"}
            </span>
          </dd>
        </dl>
      </section>

      <section className="panel">
        <h2>Що мені доступно</h2>
        <ul className="rights-list">
          <li>
            Додавати, редагувати й видаляти <Link to="/events">тусовки</Link> та{" "}
            <Link to="/organizers">організаторів</Link>.
          </li>
          {user.is_staff ? (
            <li>
              Керувати <Link to="/venues">локаціями</Link> та <Link to="/categories">категоріями</Link>.
            </li>
          ) : (
            <li className="muted">Локації й категорії змінюють лише адміністратори.</li>
          )}
        </ul>
      </section>
    </>
  );
}
