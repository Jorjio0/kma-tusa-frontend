import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Студентські тусовки Могилянки</p>
        <h1>
          Куди йдемо <span>цієї п'ятниці?</span>
        </h1>
        <p className="lead">
          Вечірки, квартирники, «Бунтівники», ночі настолок і караоке в одній афіші. Знайди й обери, куди піти, за кілька
          кліків.
        </p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary">
            Дивитись афішу
          </Link>
          <Link to="/organizers" className="btn btn-light">
            Організатори
          </Link>
        </div>
        <div className="tags">
          <span>Вечірки</span>
          <span>Квартирники</span>
          <span>Настолки</span>
          <span>Караоке</span>
          <span>Кіновечори</span>
          <span>Пікніки</span>
        </div>
      </section>

      <section className="about">
        <h2>Про нас</h2>
        <div className="split">
          <p>
            Студенти Могилянки постійно влаштовують зібрання, щоб відпочити після пар. Але дізнатися про них можна лише
            випадково: з історії в Instagram, з репосту в Telegram-чаті або від друга, який «чув, що в суботу щось буде».
          </p>
          <p>
            Більшість тусовок у Могилянці <strong>благодійні</strong>, з донатом на збір, або <strong>безкоштовні</strong>.
            Тому для кожної тусовки видно тип входу, мету збору й посилання на банку.
          </p>
        </div>
      </section>

      <section className="quick-links">
        <Link to="/events" className="quick-link">
          <strong>Тусовки</strong>
          <span>Афіша на найближчі тижні</span>
        </Link>
        <Link to="/organizers" className="quick-link">
          <strong>Організатори</strong>
          <span>Хто робить тусовки</span>
        </Link>
        <Link to="/venues" className="quick-link">
          <strong>Локації</strong>
          <span>Де вони проходять</span>
        </Link>
      </section>
    </>
  );
}
