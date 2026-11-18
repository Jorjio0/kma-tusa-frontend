import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Organizers from "./pages/Organizers.jsx";
import Venues from "./pages/Venues.jsx";
import Categories from "./pages/Categories.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ResponsePanel from "./components/ResponsePanel.jsx";

export default function App() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            KMA <span>Tusa</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>
              Головна
            </NavLink>
            <NavLink to="/events">Тусовки</NavLink>
            <NavLink to="/organizers">Організатори</NavLink>
            <NavLink to="/venues">Локації</NavLink>
            <NavLink to="/categories">Категорії</NavLink>
          </nav>
          {ready && (
            <div className="auth-nav">
              {user ? (
                <>
                  <NavLink to="/profile" className="user-name">
                    {user.first_name || user.username}
                  </NavLink>
                  <button type="button" className="btn btn-small" onClick={handleLogout}>
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-small">
                    Увійти
                  </NavLink>
                  <NavLink to="/register" className="btn btn-small btn-primary">
                    Реєстрація
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route
            path="/organizers"
            element={
              <RequireAuth>
                <Organizers />
              </RequireAuth>
            }
          />
          <Route
            path="/venues"
            element={
              <RequireAuth adminOnly>
                <Venues />
              </RequireAuth>
            }
          />
          <Route
            path="/categories"
            element={
              <RequireAuth adminOnly>
                <Categories />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<p className="empty">Сторінку не знайдено.</p>} />
        </Routes>
      </main>

      <ResponsePanel />
    </div>
  );
}
