import CrudPage from "../components/CrudPage.jsx";
import { venuesApi } from "../api.js";

export const VENUE_TYPES = [
  { value: "club", label: "Клуб" },
  { value: "bar", label: "Бар" },
  { value: "loft", label: "Лофт" },
  { value: "apartment", label: "Квартира" },
  { value: "outdoor", label: "Просто неба" },
  { value: "campus", label: "Кампус" },
  { value: "other", label: "Інше" },
];
const typeLabel = Object.fromEntries(VENUE_TYPES.map((t) => [t.value, t.label]));

const fields = [
  { name: "name", label: "Назва", required: true, placeholder: "Лофт «Цех»" },
  { name: "type", label: "Тип", type: "select", required: true, options: VENUE_TYPES },
  { name: "district", label: "Район", required: true, placeholder: "Поділ" },
  { name: "address", label: "Адреса", required: true, placeholder: "вул. Сковороди, 2" },
  { name: "capacity", label: "Місткість", type: "number", min: 1, hint: "Порожньо, якщо місткість не обмежена" },
  { name: "description", label: "Опис", type: "textarea", full: true },
];

const emptyForm = { name: "", type: "", district: "", address: "", capacity: "", description: "" };

const toPayload = (f) => ({
  name: f.name.trim(),
  type: f.type,
  district: f.district.trim(),
  address: f.address.trim(),
  capacity: f.capacity === "" ? null : Number(f.capacity),
  description: f.description.trim(),
});

const fromItem = (v) => ({
  name: v.name ?? "",
  type: v.type ?? "",
  district: v.district ?? "",
  address: v.address ?? "",
  capacity: v.capacity == null ? "" : String(v.capacity),
  description: v.description ?? "",
});

const columns = [
  { label: "Назва", render: (v) => <strong>{v.name}</strong> },
  { label: "Тип", render: (v) => typeLabel[v.type] ?? v.type },
  { label: "Район", render: (v) => v.district },
  { label: "Адреса", render: (v) => v.address },
  { label: "Місткість", render: (v) => v.capacity ?? <span className="muted">без обмежень</span> },
];

export default function Venues() {
  return (
    <CrudPage
      title="Локації"
      intro="Місця, де проходять тусовки. Локацію, у якій заплановані тусовки, видалити не можна."
      api={venuesApi}
      fields={fields}
      emptyForm={emptyForm}
      toPayload={toPayload}
      fromItem={fromItem}
      columns={columns}
      itemLabel={(v) => v.name}
      nounAccusative="локацію"
    />
  );
}
