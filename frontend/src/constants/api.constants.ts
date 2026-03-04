declare global {
  interface Window {
    APP_CONFIG?: { API_URL?: string };
  }
}

export const API_BASE_URL =
  (typeof window !== "undefined" && window.APP_CONFIG?.API_URL) ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },
  ITEMS: {
    LIST: "/api/items",
    CREATE: "/api/items",
    GET: (id: number) => `/api/items/${id}`,
    UPDATE: (id: number) => `/api/items/${id}`,
    DELETE: (id: number) => `/api/items/${id}`,
  },
};
