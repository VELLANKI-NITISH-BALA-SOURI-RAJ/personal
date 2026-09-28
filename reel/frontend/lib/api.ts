import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("reel_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Redirect to login on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("reel_token");
            localStorage.removeItem("reel_user");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
    register: (email: string, password: string) =>
        api.post("/auth/register", { email, password }),
    login: (email: string, password: string) =>
        api.post("/auth/login", { email, password }),
    me: () => api.get("/auth/me"),
};

// ─── Reels ─────────────────────────────────────────────────────────────────────
export const reelsApi = {
    create: (data: {
        topic: string;
        format: string;
        views: number;
        likes: number;
        comments: number;
        shares: number;
        length: number;
    }) => api.post("/reels/", data),
    list: (limit = 20) => api.get(`/reels/?limit=${limit}`),
    delete: (id: string) => api.delete(`/reels/${id}`),
};

// ─── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsApi = {
    get: () => api.get("/analytics/"),
};

// ─── Scripts ───────────────────────────────────────────────────────────────────
export const scriptsApi = {
    generate: (data: {
        topic: string;
        format?: string;
        target_length?: number;
        additional_context?: string;
    }) => api.post("/scripts/generate", data),
    list: () => api.get("/scripts/"),
};

// ─── Chat ──────────────────────────────────────────────────────────────────────
export const chatApi = {
    send: (message: string, history: { role: string; content: string }[]) =>
        api.post("/chat/", { message, history }),
};
