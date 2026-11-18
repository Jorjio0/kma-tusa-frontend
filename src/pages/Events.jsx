import { useMemo } from "react";
import { Link } from "react-router-dom";
import CrudPage from "../components/CrudPage.jsx";
import { categoriesApi, eventsApi, organizersApi, venuesApi } from "../api.js";
import { byId, useLookup } from "../hooks.js";
import { useAuth } from "../AuthContext.jsx";

const ENTRY_TYPES = [
  { value: "free", label: "Вхід вільний" },
  { value: "donation", label: "За донат" },
  { value: "ticket", label: "Платний квиток" },
];

const emptyForm = {
  title: "",
  starts_at: "",
  ends_at: "",
  entry_type: "",
  price: "",
  min_donation: "",
  capacity: "",
  category: "",
  organizer: "",
  venue: "",
  fundraising_purpose: "",
  fundraising_url: "",
  fundraising_goal: "",
  lineup: "",
  dress_code: "",
  description: "",
};

const toPayload = (f) => ({
  title: f.title.trim(),
  starts_at: f.starts_at === "" ? null : f.starts_at,
  ends_at: f.ends_at === "" ? null : f.ends_at,
  entry_type: f.entry_type,
  price: f.price === "" ? 0 : Number(f.price),
  min_donation: f.min_donation === "" ? null : Number(f.min_donation),
  capacity: f.capacity === "" ? null : Number(f.capacity),
  category: f.category === "" ? null : Number(f.category),
  organizer: f.organizer === "" ? null : Number(f.organizer),
  venue: f.venue === "" ? null : Number(f.venue),
  fundraising_purpose: f.fundraising_purpose.trim(),
  fundraising_url: f.fundraising_url.trim(),
  fundraising_goal: f.fundraising_goal === "" ? null : Number(f.fundraising_goal),
  lineup: f.lineup.trim(),
  dress_code: f.dress_code.trim(),
  description: f.description.trim(),
});

const fromItem = (e) => ({
  title: e.title ?? "",
  starts_at: e.starts_at ? e.starts_at.slice(0, 16) : "",
  ends_at: e.ends_at ? e.ends_at.slice(0, 16) : "",
  entry_type: e.entry_type ?? "",
  price: e.price ? String(e.price) : "",
  min_donation: e.min_donation == null ? "" : String(e.min_donation),
  capacity: e.capacity == null ? "" : String(e.capacity),
  category: e.category == null ? "" : String(e.category),
  organizer: e.organizer == null ? "" : String(e.organizer),
  venue: e.venue == null ? "" : String(e.venue),
  fundraising_purpose: e.fundraising_purpose ?? "",
  fundraising_url: e.fundraising_url ?? "",
  fundraising_goal: e.fundraising_goal == null ? "" : String(e.fundraising_goal),
  lineup: e.lineup ?? "",
  dress_code: e.dress_code ?? "",
  description: e.description ?? "",
});

function formatDate(value) {
  return new Date(value).toLocaleString("uk-UA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Kyiv",
  });
}

function entryText(e) {
  if (e.entry_type === "free") return "Вхід вільний";
  if (e.entry_type === "donation") return e.min_donation ? `Донат від ${e.min_donation} грн` : "За донат";
  return `Квиток ${e.price} грн`;
}

export default function Events() {
  const { user } = useAuth();
  const categories = useLookup(categoriesApi.list);
  const organizers = useLookup(organizersApi.list);
  const venues = useLookup(venuesApi.list);
  const categoryById = useMemo(() => byId(categories.items), [categories.items]);
  const organizerById = useMemo(() => byId(organizers.items), [organizers.items]);
  const venueById = useMemo(() => byId(venues.items), [venues.items]);

  const toOptions = (items) => items.map((i) => ({ value: String(i.id), label: i.name }));

  const fields = [
    { name: "title", label: "Назва", required: true, placeholder: "Вечірка «Мокрий листопад»", full: true },
    { name: "starts_at", label: "Початок", type: "datetime-local", required: true },
    { name: "ends_at", label: "Кінець", type: "datetime-local" },
    { name: "category", label: "Категорія", type: "select", required: true, options: toOptions(categories.items) },
    { name: "organizer", label: "Організатор", type: "select", required: true, options: toOptions(organizers.items) },
    { name: "venue", label: "Локація", type: "select", required: true, options: toOptions(venues.items) },
    { name: "capacity", label: "Місткість", type: "number", required: true, min: 1, placeholder: "100" },
    { name: "entry_type", label: "Тип входу", type: "select", required: true, options: ENTRY_TYPES },
    { name: "price", label: "Ціна квитка, грн", type: "number", min: 0, hint: "Лише для платного квитка" },
    {
      name: "min_donation",
      label: "Мінімальний донат, грн",
      type: "number",
      min: 1,
      hint: "Лише для тусовки за донат",
    },
    {
      name: "fundraising_url",
      label: "Посилання на збір",
      type: "url",
      placeholder: "https://send.monobank.ua/jar/...",
    },
    { name: "fundraising_purpose", label: "Мета збору", placeholder: "Збір на FPV-дрони" },
    { name: "fundraising_goal", label: "Ціль збору, грн", type: "number", min: 1 },
    { name: "lineup", label: "Лайнап", placeholder: "DJ Ворон, DJ Pumpkin" },
    { name: "dress_code", label: "Дрес-код" },
    { name: "description", label: "Опис", type: "textarea", full: true },
  ];

  const columns = [
    {
      label: "Тусовка",
      render: (e) => (
        <>
          <strong>{e.title}</strong>
          <div className="muted">{formatDate(e.starts_at)}</div>
        </>
      ),
    },
    {
      label: "Категорія",
      render: (e) => categoryById[e.category]?.name ?? <span className="muted">id {e.category}</span>,
    },
    { label: "Локація", render: (e) => venueById[e.venue]?.name ?? <span className="muted">id {e.venue}</span> },
    {
      label: "Організатор",
      render: (e) => organizerById[e.organizer]?.name ?? <span className="muted">id {e.organizer}</span>,
    },
    {
      label: "Вхід",
      render: (e) => (
        <>
          <span className={`badge badge-${e.entry_type}`}>{entryText(e)}</span>
          {e.fundraising_url && (
            <div>
              <a href={e.fundraising_url} target="_blank" rel="noreferrer">
                {e.fundraising_purpose || "Збір"}
              </a>
            </div>
          )}
        </>
      ),
    },
  ];

  const errors = [
    categories.error && `категорії: ${categories.error}`,
    organizers.error && `організаторів: ${organizers.error}`,
    venues.error && `локації: ${venues.error}`,
  ].filter(Boolean);
  const notice = (
    <>
      {errors.length > 0 && <div className="alert alert-error">Не вдалося завантажити {errors.join("; ")}</div>}
      {!user && (
        <div className="alert alert-info">
          Щоб додавати й редагувати тусовки,{" "}
          <Link to="/login" state={{ from: "/events" }}>
            увійдіть
          </Link>{" "}
          або <Link to="/register">зареєструйтеся</Link>.
        </div>
      )}
    </>
  );

  return (
    <CrudPage
      title="Тусовки"
      intro="Афіша студентських тусовок: вечірки, квартирники, настолки й караоке. Більшість благодійні або безкоштовні."
      api={eventsApi}
      fields={fields}
      emptyForm={emptyForm}
      toPayload={toPayload}
      fromItem={fromItem}
      columns={columns}
      itemLabel={(e) => e.title}
      nounAccusative="тусовку"
      notice={notice}
      readOnly={!user}
    />
  );
}
