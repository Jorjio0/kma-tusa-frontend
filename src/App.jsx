import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Organizers from "./pages/Organizers.jsx";
import Venues from "./pages/Venues.jsx";
import Categories from "./pages/Categories.jsx";
import ResponsePanel from "./components/ResponsePanel.jsx";

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            KMA <span>Tusa</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>Головна</NavLink>
            <NavLink to="/events">Тусовки</NavLink>
            <NavLink to="/organizers">Організатори</NavLink>
            <NavLink to="/venues">Локації</NavLink>
            <NavLink to="/categories">Категорії</NavLink>
          </nav>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/organizers" element={<Organizers />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="*" element={<p className="empty">Сторінку не знайдено.</p>} />
        </Routes>
      </main>

      <ResponsePanel />
    </div>
  );
}
