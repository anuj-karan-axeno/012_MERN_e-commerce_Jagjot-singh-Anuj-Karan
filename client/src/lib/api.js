import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8080/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;