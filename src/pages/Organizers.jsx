import CrudPage from "../components/CrudPage.jsx";
import { organizersApi } from "../api.js";

const fields = [
  { name: "name", label: "Назва", required: true, placeholder: "Kyiv-Mohyla Party Crew", full: true },
  { name: "contact_email", label: "Email", type: "email", placeholder: "crew@example.com" },
  { name: "instagram_url", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
  { name: "description", label: "Опис", type: "textarea", full: true },
];

const emptyForm = { name: "", contact_email: "", instagram_url: "", description: "" };

const toPayload = (f) => ({
  name: f.name.trim(),
  contact_email: f.contact_email.trim(),
  instagram_url: f.instagram_url.trim(),
  description: f.description.trim(),
});

const fromItem = (o) => ({
  name: o.name ?? "",
  contact_email: o.contact_email ?? "",
  instagram_url: o.instagram_url ?? "",
  description: o.description ?? "",
});

const columns = [
  { label: "Назва", render: (o) => <strong>{o.name}</strong> },
  {
    label: "Email",
    render: (o) => (o.contact_email ? <a href={`mailto:${o.contact_email}`}>{o.contact_email}</a> : <span className="muted">—</span>),
  },
  {
    label: "Instagram",
    render: (o) =>
      o.instagram_url ? (
        <a href={o.instagram_url} target="_blank" rel="noreferrer">
          Instagram
        </a>
      ) : (
        <span className="muted">—</span>
      ),
  },
];

export default function Organizers() {
  return (
    <CrudPage
      title="Організатори"
      intro="Команди та ініціативи, які роблять тусовки. Організатора, за яким закріплені тусовки, видалити не можна."
      api={organizersApi}
      fields={fields}
      emptyForm={emptyForm}
      toPayload={toPayload}
      fromItem={fromItem}
      columns={columns}
      itemLabel={(o) => o.name}
      nounAccusative="організатора"
    />
  );
}
