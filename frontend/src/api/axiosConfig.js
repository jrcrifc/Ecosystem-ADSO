import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const apiAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAxios;