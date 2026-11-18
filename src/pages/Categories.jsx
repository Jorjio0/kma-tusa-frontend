import CrudPage from "../components/CrudPage.jsx";
import { categoriesApi } from "../api.js";

const fields = [{ name: "name", label: "Назва", required: true, placeholder: "Квартирник", full: true }];

const emptyForm = { name: "" };

const toPayload = (f) => ({
  name: f.name.trim(),
});

const fromItem = (c) => ({
  name: c.name ?? "",
});

const columns = [{ label: "Назва", render: (c) => <strong>{c.name}</strong> }];

export default function Categories() {
  return (
    <CrudPage
      title="Категорії"
      intro="Типи тусовок. Категорію, у якій є тусовки, видалити не можна."
      api={categoriesApi}
      fields={fields}
      emptyForm={emptyForm}
      toPayload={toPayload}
      fromItem={fromItem}
      columns={columns}
      itemLabel={(c) => c.name}
      nounAccusative="категорію"
    />
  );
}
