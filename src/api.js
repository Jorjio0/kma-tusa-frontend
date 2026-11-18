// Усі звернення до бекенду проходять через цей файл.
// Специфікація ендпоінтів — у README_BE.md бекенду.

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

// ---- Остання відповідь сервера (для панелі внизу сторінки) ----
let lastResponse = null;
const listeners = new Set();

export function subscribeLastResponse(fn) {
  listeners.add(fn);
  fn(lastResponse);
  return () => listeners.delete(fn);
}

function publish(info) {
  lastResponse = info;
  listeners.forEach((fn) => fn(info));
}

// ---- Помилка API з розібраним тілом ----
export class ApiError extends Error {
  constructor(status, body, message) {
    super(message);
    this.status = status;
    this.body = body;
    // { field: ["msg", ...] } для 400
    this.fieldErrors = status === 400 && body && typeof body === "object" && !Array.isArray(body) ? body : null;
  }
}

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const AUTH_PATHS = ["/api/auth/register/", "/api/auth/login/", "/api/auth/refresh/"];

const tokenListeners = new Set();

export function subscribeTokensCleared(fn) {
  tokenListeners.add(fn);
  return () => tokenListeners.delete(fn);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

function saveTokens(access, refresh) {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  tokenListeners.forEach((fn) => fn());
}

let refreshing = null;

function refreshAccessToken() {
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: localStorage.getItem(REFRESH_KEY) }),
    })
      .then(async (response) => {
        if (!response.ok) {
          clearTokens();
          return false;
        }
        const body = await response.json();
        saveTokens(body.access);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

function send(method, path, data) {
  const options = { method, headers: { Accept: "application/json" } };
  const access = getAccessToken();
  if (access && !AUTH_PATHS.includes(path)) {
    options.headers.Authorization = `Bearer ${access}`;
  }
  if (data !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }
  return fetch(`${API_URL}${path}`, options);
}

async function request(method, path, data) {
  const url = `${API_URL}${path}`;

  let response;
  try {
    response = await send(method, path, data);
    if (response.status === 401 && localStorage.getItem(REFRESH_KEY) && !AUTH_PATHS.includes(path)) {
      const refreshed = await refreshAccessToken();
      if (refreshed) response = await send(method, path, data);
    }
  } catch (err) {
    publish({ method, url, status: null, statusText: "Network error", headers: [], body: null, at: new Date() });
    throw new ApiError(
      0,
      null,
      "Не вдалося отримати відповідь від сервера. Перевірте, що бекенд запущений на " +
        API_URL +
        " і що він дозволяє запити з цього сайту (CORS). Подробиці — у консолі браузера.",
    );
  }

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  publish({
    method,
    url,
    status: response.status,
    statusText: response.statusText,
    headers: [...response.headers.entries()],
    body,
    at: new Date(),
  });

  if (!response.ok) {
    let message;
    if (response.status === 400) message = "Дані не пройшли перевірку на сервері.";
    else if (response.status === 404) message = "Об'єкт не знайдено (404). Можливо, його вже видалили.";
    else if (response.status === 401 && body && body.code === "token_not_valid")
      message = "Сесія закінчилась. Увійдіть знову.";
    else if (body && typeof body === "object" && body.detail) message = body.detail;
    else message = `Сервер повернув помилку ${response.status} ${response.statusText}`.trim();
    throw new ApiError(response.status, body, message);
  }

  return body;
}

// ---- Ресурси ----
function resource(name) {
  return {
    list: () => request("GET", `/api/${name}/`),
    create: (data) => request("POST", `/api/${name}/`, data),
    update: (id, data) => request("PUT", `/api/${name}/${id}/`, data),
    remove: (id) => request("DELETE", `/api/${name}/${id}/`),
  };
}

export const categoriesApi = resource("categories");
export const organizersApi = resource("organizers");
export const venuesApi = resource("venues");
export const eventsApi = resource("events");

export const authApi = {
  register: (data) => request("POST", "/api/auth/register/", data),
  login: async (username, password) => {
    const tokens = await request("POST", "/api/auth/login/", { username, password });
    saveTokens(tokens.access, tokens.refresh);
  },
  me: () => request("GET", "/api/auth/me/"),
};
