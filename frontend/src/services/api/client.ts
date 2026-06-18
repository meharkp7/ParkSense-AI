import axios from "axios";

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
  baseURL: configuredBaseUrl.replace(/\/$/, ""),
  timeout: 10000,
});
