"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
    user_id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("reel_token");
        const storedUser = localStorage.getItem("reel_user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const res = await authApi.login(email, password);
        const { access_token, user_id } = res.data;
        const userData = { user_id, email };
        localStorage.setItem("reel_token", access_token);
        localStorage.setItem("reel_user", JSON.stringify(userData));
        setToken(access_token);
        setUser(userData);
    };

    const register = async (email: string, password: string) => {
        const res = await authApi.register(email, password);
        const { access_token, user_id } = res.data;
        const userData = { user_id, email };
        localStorage.setItem("reel_token", access_token);
        localStorage.setItem("reel_user", JSON.stringify(userData));
        setToken(access_token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("reel_token");
        localStorage.removeItem("reel_user");
        setToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
